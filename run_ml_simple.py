import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
import warnings
import os
warnings.filterwarnings('ignore')

print("Starting ML Data Preprocessing and Model Training...")
print("="*60)

# Load datasets
print("\n1. Loading datasets...")
career_df = pd.read_csv('dataset/career_path_in_all_field.csv')
skills_df = pd.read_csv('dataset/skill-career.csv')

print(f"✓ Career Path Dataset: {career_df.shape[0]} records, {career_df.shape[1]} features")
print(f"✓ Skills-Career Dataset: {skills_df.shape[0]} records, {skills_df.shape[1]} features")

# Clean datasets
print("\n2. Cleaning datasets...")

# Clean career dataset
career_cleaned = career_df.copy()
career_cleaned = career_cleaned.dropna(axis=1, how='all')
career_cleaned = career_cleaned.dropna(axis=0, how='all')

for col in career_cleaned.columns:
    if career_cleaned[col].dtype == 'object':
        career_cleaned[col] = career_cleaned[col].fillna('Unknown')
    else:
        career_cleaned[col] = career_cleaned[col].fillna(career_cleaned[col].median())

print(f"✓ Career dataset cleaned: {career_cleaned.shape}")

# Clean skills dataset
skills_cleaned = skills_df.copy()
skills_cleaned = skills_cleaned.dropna(axis=1, how='all')
skills_cleaned = skills_cleaned.dropna(axis=0, how='all')
skills_cleaned = skills_cleaned.dropna(subset=['Job profession'])  # Keep only rows with job profession

for col in skills_cleaned.columns:
    if skills_cleaned[col].dtype == 'object':
        skills_cleaned[col] = skills_cleaned[col].fillna('Unknown')
    else:
        skills_cleaned[col] = skills_cleaned[col].fillna(skills_cleaned[col].median())

print(f"✓ Skills dataset cleaned: {skills_cleaned.shape}")

# Create RIASEC scores for skills dataset
print("\n3. Creating RIASEC personality scores...")

# Rename columns for consistency
column_mapping = {
    'Logical - Mathematical': 'Logical_Mathematical',
    'Spatial-Visualization': 'Spatial',
    'Bodily': 'Bodily_Kinesthetic'
}

for old_name, new_name in column_mapping.items():
    if old_name in skills_cleaned.columns:
        skills_cleaned = skills_cleaned.rename(columns={old_name: new_name})

# Create RIASEC scores
intelligence_cols = ['Logical_Mathematical', 'Spatial', 'Linguistic', 'Musical', 
                    'Bodily_Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalist']

# Initialize RIASEC scores
skills_cleaned['R_Realistic'] = 5.0
skills_cleaned['I_Investigative'] = 5.0
skills_cleaned['A_Artistic'] = 5.0
skills_cleaned['S_Social'] = 5.0
skills_cleaned['E_Enterprising'] = 5.0
skills_cleaned['C_Conventional'] = 5.0

# Calculate RIASEC scores based on available intelligence scores
for idx, row in skills_cleaned.iterrows():
    # R - Realistic: Bodily-Kinesthetic + Naturalist
    if 'Bodily_Kinesthetic' in skills_cleaned.columns and 'Naturalist' in skills_cleaned.columns:
        realistic_scores = [row['Bodily_Kinesthetic'], row['Naturalist']]
        realistic_scores = [x for x in realistic_scores if pd.notna(x)]
        if realistic_scores:
            skills_cleaned.loc[idx, 'R_Realistic'] = np.mean(realistic_scores)
    
    # I - Investigative: Logical-Mathematical + Naturalist
    if 'Logical_Mathematical' in skills_cleaned.columns:
        investigative_scores = [row['Logical_Mathematical']]
        if 'Naturalist' in skills_cleaned.columns:
            investigative_scores.append(row['Naturalist'])
        investigative_scores = [x for x in investigative_scores if pd.notna(x)]
        if investigative_scores:
            skills_cleaned.loc[idx, 'I_Investigative'] = np.mean(investigative_scores)
    
    # A - Artistic: Musical + Spatial + Linguistic
    artistic_cols = ['Musical', 'Spatial', 'Linguistic']
    artistic_scores = []
    for col in artistic_cols:
        if col in skills_cleaned.columns and pd.notna(row[col]):
            artistic_scores.append(row[col])
    if artistic_scores:
        skills_cleaned.loc[idx, 'A_Artistic'] = np.mean(artistic_scores)
    
    # S - Social: Interpersonal + Intrapersonal
    if 'Interpersonal' in skills_cleaned.columns and 'Intrapersonal' in skills_cleaned.columns:
        social_scores = [row['Interpersonal'], row['Intrapersonal']]
        social_scores = [x for x in social_scores if pd.notna(x)]
        if social_scores:
            skills_cleaned.loc[idx, 'S_Social'] = np.mean(social_scores)
    
    # E - Enterprising: Interpersonal + Linguistic
    if 'Interpersonal' in skills_cleaned.columns:
        enterprising_scores = [row['Interpersonal']]
        if 'Linguistic' in skills_cleaned.columns:
            enterprising_scores.append(row['Linguistic'])
        enterprising_scores = [x for x in enterprising_scores if pd.notna(x)]
        if enterprising_scores:
            skills_cleaned.loc[idx, 'E_Enterprising'] = np.mean(enterprising_scores)
    
    # C - Conventional: Logical-Mathematical + Intrapersonal
    if 'Logical_Mathematical' in skills_cleaned.columns:
        conventional_scores = [row['Logical_Mathematical']]
        if 'Intrapersonal' in skills_cleaned.columns:
            conventional_scores.append(row['Intrapersonal'])
        conventional_scores = [x for x in conventional_scores if pd.notna(x)]
        if conventional_scores:
            skills_cleaned.loc[idx, 'C_Conventional'] = np.mean(conventional_scores)

riasec_cols = ['R_Realistic', 'I_Investigative', 'A_Artistic', 'S_Social', 'E_Enterprising', 'C_Conventional']
print(f"✓ Created RIASEC scores: {riasec_cols}")

# Display RIASEC statistics
print("\nRIASEC Score Statistics:")
for col in riasec_cols:
    avg_score = skills_cleaned[col].mean()
    print(f"  {col}: {avg_score:.2f}")

# Train simplified models
print("\n4. Training machine learning models...")

# Prepare career dataset for ML
def prepare_simple_ml_data(df, target_col):
    """Simplified ML data preparation"""
    if target_col not in df.columns:
        return None, None
    
    X = df.drop(columns=[target_col]).copy()
    y = df[target_col].copy()
    
    # Encode categorical variables
    for col in X.columns:
        if X[col].dtype == 'object':
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
    
    # Encode target if categorical
    if y.dtype == 'object':
        le_target = LabelEncoder()
        y = le_target.fit_transform(y.astype(str))
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, y

# Train model for career dataset
print("\nTraining Career Prediction Model...")
X_career, y_career = prepare_simple_ml_data(career_cleaned, 'Career')

if X_career is not None:
    X_train, X_test, y_train, y_test = train_test_split(X_career, y_career, test_size=0.2, random_state=42)
    
    # Train Random Forest (most reliable)
    rf_career = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10)
    rf_career.fit(X_train, y_train)
    
    y_pred = rf_career.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✓ Career Model - Random Forest Accuracy: {accuracy:.4f}")
    
    # Save model
    os.makedirs('models', exist_ok=True)
    with open('models/career_prediction_model.pkl', 'wb') as f:
        pickle.dump(rf_career, f)
    print("✓ Career model saved to models/career_prediction_model.pkl")

# Train model for skills dataset
print("\nTraining Skills-Career Prediction Model...")
X_skills, y_skills = prepare_simple_ml_data(skills_cleaned, 'Job profession')

if X_skills is not None:
    X_train, X_test, y_train, y_test = train_test_split(X_skills, y_skills, test_size=0.2, random_state=42)
    
    # Train Random Forest
    rf_skills = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=10)
    rf_skills.fit(X_train, y_train)
    
    y_pred = rf_skills.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✓ Skills Model - Random Forest Accuracy: {accuracy:.4f}")
    
    # Save model
    with open('models/skills_prediction_model.pkl', 'wb') as f:
        pickle.dump(rf_skills, f)
    print("✓ Skills model saved to models/skills_prediction_model.pkl")

# Save cleaned datasets
print("\n5. Saving cleaned datasets...")
career_cleaned.to_csv('dataset/career_path_cleaned.csv', index=False)
skills_cleaned.to_csv('dataset/skill_career_cleaned.csv', index=False)

print("✓ Cleaned datasets saved:")
print("  - dataset/career_path_cleaned.csv")
print("  - dataset/skill_career_cleaned.csv")

# Create visualizations
print("\n6. Creating visualizations...")

# Create a simple visualization showing RIASEC score distribution
plt.figure(figsize=(12, 6))

# RIASEC scores distribution
plt.subplot(1, 2, 1)
riasec_means = [skills_cleaned[col].mean() for col in riasec_cols]
riasec_labels = [col.replace('_', ' ') for col in riasec_cols]
plt.bar(riasec_labels, riasec_means, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'])
plt.title('Average RIASEC Personality Scores')
plt.ylabel('Score (0-10)')
plt.xticks(rotation=45)

# Career distribution (top 10)
plt.subplot(1, 2, 2)
career_counts = career_cleaned['Career'].value_counts().head(10)
plt.barh(range(len(career_counts)), career_counts.values)
plt.yticks(range(len(career_counts)), career_counts.index)
plt.title('Top 10 Careers in Dataset')
plt.xlabel('Count')

plt.tight_layout()
plt.savefig('ml_analysis_results.png', dpi=300, bbox_inches='tight')
plt.show()

print("✓ Visualization saved as ml_analysis_results.png")

# Generate summary report
print("\n" + "="*60)
print("MACHINE LEARNING PREPROCESSING SUMMARY")
print("="*60)

print(f"\nDataset Statistics:")
print(f"📊 Career Dataset: {career_cleaned.shape[0]} records, {career_cleaned.shape[1]} features")
print(f"📊 Skills Dataset: {skills_cleaned.shape[0]} records, {skills_cleaned.shape[1]} features")

print(f"\nFeature Engineering:")
print(f"🧠 Created 6 RIASEC personality dimensions")
print(f"🎯 Processed {len(career_cleaned['Career'].unique())} unique careers")
print(f"🎯 Processed {len(skills_cleaned['Job profession'].unique())} unique job professions")

print(f"\nModel Performance:")
if X_career is not None:
    print(f"💼 Career Prediction Model: Trained and saved")
if X_skills is not None:
    print(f"🎓 Skills-Career Model: Trained and saved")

print(f"\nFiles Generated:")
print(f"📁 models/career_prediction_model.pkl")
print(f"📁 models/skills_prediction_model.pkl")
print(f"📁 dataset/career_path_cleaned.csv")
print(f"📁 dataset/skill_career_cleaned.csv")
print(f"📁 ml_analysis_results.png")

print("\n✅ ML Data Preprocessing and Model Training Completed Successfully!")
print("🚀 Ready for integration with the career guidance web application!")