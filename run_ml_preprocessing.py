import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.impute import SimpleImputer
import pickle
import warnings
import os
warnings.filterwarnings('ignore')

# Set style for plots
plt.style.use('default')
sns.set_palette("husl")

print("Libraries imported successfully!")

# Load datasets
print("Loading datasets...")
career_df = pd.read_csv('dataset/career_path_in_all_field.csv')
skills_df = pd.read_csv('dataset/skill-career.csv')

print(f"Career Path Dataset Shape: {career_df.shape}")
print(f"Skills-Career Dataset Shape: {skills_df.shape}")
print("\nCareer Dataset Columns:")
print(career_df.columns.tolist())
print("\nSkills Dataset Columns:")
print(skills_df.columns.tolist())

# Data exploration
print("\nCareer Dataset Info:")
career_df.info()
print("\nSkills Dataset Info:")
skills_df.info()

# Clean both datasets
def clean_dataset(df, dataset_name):
    """Clean dataset by handling missing values"""
    df_clean = df.copy()
    
    # Remove completely empty columns
    df_clean = df_clean.dropna(axis=1, how='all')
    
    # Remove rows where all values are missing
    df_clean = df_clean.dropna(axis=0, how='all')
    
    # Handle missing values
    numeric_columns = df_clean.select_dtypes(include=[np.number]).columns
    categorical_columns = df_clean.select_dtypes(include=['object']).columns
    
    # Fill numeric columns with median
    for col in numeric_columns:
        df_clean[col] = df_clean[col].fillna(df_clean[col].median())
    
    # Fill categorical columns with mode
    for col in categorical_columns:
        mode_value = df_clean[col].mode()
        if len(mode_value) > 0:
            df_clean[col] = df_clean[col].fillna(mode_value[0])
        else:
            df_clean[col] = df_clean[col].fillna('Unknown')
    
    print(f"{dataset_name} cleaned. Shape: {df_clean.shape}")
    print(f"Missing values after cleaning: {df_clean.isnull().sum().sum()}")
    
    return df_clean

print("\nCleaning datasets...")
career_cleaned = clean_dataset(career_df, "Career dataset")
skills_cleaned = clean_dataset(skills_df, "Skills dataset")

# Create RIASEC scores from multiple intelligence data
def create_riasec_scores(df):
    """Create RIASEC personality scores from multiple intelligence scores"""
    df = df.copy()
    
    # Map column names (handle variations in naming)
    column_mapping = {
        'Logical - Mathematical': 'Logical-Mathematical',
        'Spatial-Visualization': 'Spatial',
        'Bodily': 'Bodily-Kinesthetic'
    }
    
    # Rename columns to standardize
    for old_name, new_name in column_mapping.items():
        if old_name in df.columns:
            df = df.rename(columns={old_name: new_name})
    
    # Intelligence columns mapping to RIASEC
    intelligence_mapping = {
        'Logical-Mathematical': ['I_Investigative', 'C_Conventional'],
        'Spatial': ['A_Artistic'],
        'Linguistic': ['A_Artistic', 'E_Enterprising'],
        'Musical': ['A_Artistic'],
        'Bodily-Kinesthetic': ['R_Realistic'],
        'Interpersonal': ['S_Social', 'E_Enterprising'],
        'Intrapersonal': ['S_Social', 'C_Conventional'],
        'Naturalist': ['R_Realistic', 'I_Investigative']
    }
    
    # Initialize RIASEC scores
    riasec_scores = {
        'R_Realistic': [],
        'I_Investigative': [],
        'A_Artistic': [],
        'S_Social': [],
        'E_Enterprising': [],
        'C_Conventional': []
    }
    
    # Calculate RIASEC scores for each row
    for idx, row in df.iterrows():
        scores = {key: [] for key in riasec_scores.keys()}
        
        for intel_col, riasec_list in intelligence_mapping.items():
            if intel_col in df.columns:
                value = row[intel_col] if pd.notna(row[intel_col]) else 5
                # Ensure value is numeric
                try:
                    value = float(value)
                except (ValueError, TypeError):
                    value = 5
                
                for riasec in riasec_list:
                    scores[riasec].append(value)
        
        # Average scores for each RIASEC dimension
        for riasec, values in scores.items():
            if values:
                riasec_scores[riasec].append(np.mean(values))
            else:
                riasec_scores[riasec].append(5)  # Default middle value
    
    # Add RIASEC scores to dataframe
    for riasec, scores in riasec_scores.items():
        df[riasec] = scores
    
    return df

print("\nCreating RIASEC scores...")
skills_cleaned = create_riasec_scores(skills_cleaned)
riasec_cols = [col for col in skills_cleaned.columns if col.startswith(('R_', 'I_', 'A_', 'S_', 'E_', 'C_'))]
print(f"Created RIASEC scores: {riasec_cols}")

# Prepare data for ML
def prepare_ml_data(df, target_col):
    """Prepare dataset for machine learning"""
    if target_col not in df.columns:
        print(f"Target column '{target_col}' not found")
        return None, None, None, None
    
    df_ml = df.copy()
    y = df_ml[target_col]
    X = df_ml.drop(columns=[target_col])
    
    # Encode categorical variables
    categorical_cols = X.select_dtypes(include=['object']).columns
    label_encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    
    # Encode target if categorical
    target_encoder = None
    if y.dtype == 'object':
        target_encoder = LabelEncoder()
        y = target_encoder.fit_transform(y.astype(str))
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns, index=X.index)
    
    return X_scaled, y, {'label_encoders': label_encoders, 'target_encoder': target_encoder, 'scaler': scaler}, X.columns.tolist()

# Find target columns
career_target_cols = [col for col in career_cleaned.columns if any(term in col.lower() for term in ['career', 'job', 'profession'])]
skills_target_cols = [col for col in skills_cleaned.columns if any(term in col.lower() for term in ['career', 'job', 'profession'])]

print(f"Career target columns: {career_target_cols}")
print(f"Skills target columns: {skills_target_cols}")

# Train models function
def train_models(X, y, dataset_name):
    """Train and evaluate ML models"""
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000)
    }
    
    results = {}
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    for name, model in models.items():
        print(f"\nTraining {name} for {dataset_name}...")
        
        try:
            # Train model
            model.fit(X_train, y_train)
            
            # Predictions
            y_pred = model.predict(X_test)
            
            # Cross-validation
            cv_scores = cross_val_score(model, X, y, cv=3)  # Reduced CV folds for speed
            
            # Store results
            results[name] = {
                'model': model,
                'accuracy': accuracy_score(y_test, y_pred),
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std()
            }
            
            print(f"Accuracy: {results[name]['accuracy']:.4f}")
            print(f"CV Score: {results[name]['cv_mean']:.4f} (+/- {results[name]['cv_std']*2:.4f})")
        except Exception as e:
            print(f"Error training {name}: {str(e)}")
            continue
    
    return results

# Train models for both datasets
all_results = {}

print("\n" + "="*50)
print("TRAINING MACHINE LEARNING MODELS")
print("="*50)

# Career dataset
if career_target_cols:
    target_col = career_target_cols[0]
    print(f"\nProcessing Career Dataset with target: {target_col}")
    X_career, y_career, encoders_career, _ = prepare_ml_data(career_cleaned, target_col)
    if X_career is not None and len(X_career) > 0:
        all_results['career'] = train_models(X_career, y_career, "Career Dataset")

# Skills dataset
if skills_target_cols:
    target_col = skills_target_cols[0]
    print(f"\nProcessing Skills Dataset with target: {target_col}")
    X_skills, y_skills, encoders_skills, _ = prepare_ml_data(skills_cleaned, target_col)
    if X_skills is not None and len(X_skills) > 0:
        all_results['skills'] = train_models(X_skills, y_skills, "Skills Dataset")

# Save cleaned datasets
print("\n" + "="*50)
print("SAVING RESULTS")
print("="*50)

career_cleaned.to_csv('dataset/career_path_cleaned.csv', index=False)
skills_cleaned.to_csv('dataset/skill_career_cleaned.csv', index=False)

print("Cleaned datasets saved:")
print("- dataset/career_path_cleaned.csv")
print("- dataset/skill_career_cleaned.csv")

# Save best performing models
if all_results:
    best_models = {}
    for dataset_name, results in all_results.items():
        if results:  # Check if results is not empty
            best_model_name = max(results.keys(), key=lambda x: results[x]['cv_mean'])
            best_models[dataset_name] = {
                'model': results[best_model_name]['model'],
                'name': best_model_name,
                'score': results[best_model_name]['cv_mean']
            }
            
            # Create models directory if it doesn't exist
            os.makedirs('models', exist_ok=True)
            
            # Save the best model
            model_filename = f'models/best_{dataset_name}_model.pkl'
            with open(model_filename, 'wb') as f:
                pickle.dump(results[best_model_name]['model'], f)
            
            print(f"Best {dataset_name} model ({best_model_name}) saved with CV score: {results[best_model_name]['cv_mean']:.4f}")

# Generate summary statistics
print("\n" + "="*50)
print("SUMMARY STATISTICS")
print("="*50)

print(f"Career Dataset: {career_cleaned.shape[0]} records, {career_cleaned.shape[1]} features")
print(f"Skills Dataset: {skills_cleaned.shape[0]} records, {skills_cleaned.shape[1]} features")

if riasec_cols:
    print(f"\nRIASEC Scores Created: {len(riasec_cols)} personality dimensions")
    print("Average RIASEC Scores:")
    for col in riasec_cols:
        avg_score = skills_cleaned[col].mean()
        print(f"  {col}: {avg_score:.2f}")

print("\nData preprocessing and model training completed successfully!")
print("Ready for integration with the web application.")