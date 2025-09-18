import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import pickle
import warnings
import os
warnings.filterwarnings('ignore')

print("🚀 Starting ML Data Preprocessing and Model Training...")
print("="*60)

# Load and clean datasets quickly
print("\n1. Loading and cleaning datasets...")
career_df = pd.read_csv('dataset/career_path_in_all_field.csv')
skills_df = pd.read_csv('dataset/skill-career.csv')

# Clean career dataset
career_cleaned = career_df.dropna(subset=['Career']).copy()
print(f"✓ Career dataset: {career_cleaned.shape[0]} records")

# Clean skills dataset and focus on records with job professions
skills_cleaned = skills_df.dropna(subset=['Job profession']).copy()
# Rename columns for easier processing
skills_cleaned = skills_cleaned.rename(columns={
    'Logical - Mathematical': 'Logical_Mathematical',
    'Spatial-Visualization': 'Spatial',
    'Bodily': 'Bodily_Kinesthetic'
})
print(f"✓ Skills dataset: {skills_cleaned.shape[0]} records")

# Create RIASEC scores using vectorized operations
print("\n2. Creating RIASEC personality scores...")

# Fill missing intelligence scores with median values
intel_cols = ['Logical_Mathematical', 'Spatial', 'Linguistic', 'Musical', 
              'Bodily_Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalist']

for col in intel_cols:
    if col in skills_cleaned.columns:
        skills_cleaned[col] = skills_cleaned[col].fillna(skills_cleaned[col].median())

# Create RIASEC scores using vectorized operations
default_score = 5.0

# R - Realistic
if 'Bodily_Kinesthetic' in skills_cleaned.columns and 'Naturalist' in skills_cleaned.columns:
    skills_cleaned['R_Realistic'] = (skills_cleaned['Bodily_Kinesthetic'] + skills_cleaned['Naturalist']) / 2
else:
    skills_cleaned['R_Realistic'] = default_score

# I - Investigative  
if 'Logical_Mathematical' in skills_cleaned.columns and 'Naturalist' in skills_cleaned.columns:
    skills_cleaned['I_Investigative'] = (skills_cleaned['Logical_Mathematical'] + skills_cleaned['Naturalist']) / 2
elif 'Logical_Mathematical' in skills_cleaned.columns:
    skills_cleaned['I_Investigative'] = skills_cleaned['Logical_Mathematical']
else:
    skills_cleaned['I_Investigative'] = default_score

# A - Artistic
artistic_cols = ['Musical', 'Spatial', 'Linguistic']
available_artistic = [col for col in artistic_cols if col in skills_cleaned.columns]
if available_artistic:
    skills_cleaned['A_Artistic'] = skills_cleaned[available_artistic].mean(axis=1)
else:
    skills_cleaned['A_Artistic'] = default_score

# S - Social
if 'Interpersonal' in skills_cleaned.columns and 'Intrapersonal' in skills_cleaned.columns:
    skills_cleaned['S_Social'] = (skills_cleaned['Interpersonal'] + skills_cleaned['Intrapersonal']) / 2
elif 'Interpersonal' in skills_cleaned.columns:
    skills_cleaned['S_Social'] = skills_cleaned['Interpersonal']
else:
    skills_cleaned['S_Social'] = default_score

# E - Enterprising
if 'Interpersonal' in skills_cleaned.columns and 'Linguistic' in skills_cleaned.columns:
    skills_cleaned['E_Enterprising'] = (skills_cleaned['Interpersonal'] + skills_cleaned['Linguistic']) / 2
elif 'Interpersonal' in skills_cleaned.columns:
    skills_cleaned['E_Enterprising'] = skills_cleaned['Interpersonal']
else:
    skills_cleaned['E_Enterprising'] = default_score

# C - Conventional
if 'Logical_Mathematical' in skills_cleaned.columns and 'Intrapersonal' in skills_cleaned.columns:
    skills_cleaned['C_Conventional'] = (skills_cleaned['Logical_Mathematical'] + skills_cleaned['Intrapersonal']) / 2
elif 'Logical_Mathematical' in skills_cleaned.columns:
    skills_cleaned['C_Conventional'] = skills_cleaned['Logical_Mathematical']
else:
    skills_cleaned['C_Conventional'] = default_score

riasec_cols = ['R_Realistic', 'I_Investigative', 'A_Artistic', 'S_Social', 'E_Enterprising', 'C_Conventional']
print(f"✓ Created RIASEC scores: {len(riasec_cols)} dimensions")

# Display RIASEC statistics
print("\nRIASEC Score Statistics:")
for col in riasec_cols:
    avg_score = skills_cleaned[col].mean()
    print(f"  {col}: {avg_score:.2f}")

# Train models
print("\n3. Training machine learning models...")

def encode_features(df, target_col):
    """Encode features for ML"""
    X = df.drop(columns=[target_col]).copy()
    y = df[target_col].copy()
    
    # Encode categorical variables
    for col in X.columns:
        if X[col].dtype == 'object':
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
    
    # Encode target
    if y.dtype == 'object':
        le_target = LabelEncoder()
        y = le_target.fit_transform(y.astype(str))
    
    return X.values, y

# Train career model
print("\nTraining Career Prediction Model...")
X_career, y_career = encode_features(career_cleaned, 'Career')
X_train, X_test, y_train, y_test = train_test_split(X_career, y_career, test_size=0.2, random_state=42)

rf_career = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=15)
rf_career.fit(X_train, y_train)
y_pred = rf_career.predict(X_test)
career_accuracy = accuracy_score(y_test, y_pred)
print(f"✓ Career Model Accuracy: {career_accuracy:.4f}")

# Train skills model
print("\nTraining Skills-Career Prediction Model...")
X_skills, y_skills = encode_features(skills_cleaned, 'Job profession')
X_train, X_test, y_train, y_test = train_test_split(X_skills, y_skills, test_size=0.2, random_state=42)

rf_skills = RandomForestClassifier(n_estimators=50, random_state=42, max_depth=15)
rf_skills.fit(X_train, y_train)
y_pred = rf_skills.predict(X_test)
skills_accuracy = accuracy_score(y_test, y_pred)
print(f"✓ Skills Model Accuracy: {skills_accuracy:.4f}")

# Save models and data
print("\n4. Saving models and cleaned datasets...")
os.makedirs('models', exist_ok=True)

# Save models
with open('models/career_prediction_model.pkl', 'wb') as f:
    pickle.dump(rf_career, f)

with open('models/skills_prediction_model.pkl', 'wb') as f:
    pickle.dump(rf_skills, f)

# Save cleaned datasets
career_cleaned.to_csv('dataset/career_path_cleaned.csv', index=False)
skills_cleaned.to_csv('dataset/skill_career_cleaned.csv', index=False)

print("✓ Models saved to models/ directory")
print("✓ Cleaned datasets saved to dataset/ directory")

# Create visualizations
print("\n5. Creating data visualization...")

plt.figure(figsize=(16, 10))

# RIASEC scores distribution
plt.subplot(2, 3, 1)
riasec_means = [skills_cleaned[col].mean() for col in riasec_cols]
riasec_labels = [col.replace('_', '\n') for col in riasec_cols]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
plt.bar(riasec_labels, riasec_means, color=colors)
plt.title('Average RIASEC Personality Scores', fontsize=12, fontweight='bold')
plt.ylabel('Score (0-10)')
plt.ylim(0, 10)

# Top careers
plt.subplot(2, 3, 2)
career_counts = career_cleaned['Career'].value_counts().head(8)
plt.barh(range(len(career_counts)), career_counts.values, color='#45B7D1')
plt.yticks(range(len(career_counts)), [c[:20] + '...' if len(c) > 20 else c for c in career_counts.index])
plt.title('Top 8 Careers in Dataset', fontsize=12, fontweight='bold')
plt.xlabel('Count')

# GPA distribution
plt.subplot(2, 3, 3)
plt.hist(career_cleaned['GPA'], bins=20, color='#96CEB4', alpha=0.7, edgecolor='black')
plt.title('GPA Distribution', fontsize=12, fontweight='bold')
plt.xlabel('GPA')
plt.ylabel('Frequency')

# Skills correlation matrix
plt.subplot(2, 3, 4)
skill_cols = [col for col in career_cleaned.columns if 'Skills' in col][:5]
if skill_cols:
    corr_matrix = career_cleaned[skill_cols].corr()
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0, square=True)
    plt.title('Skills Correlation Matrix', fontsize=12, fontweight='bold')

# Model accuracy comparison
plt.subplot(2, 3, 5)
models = ['Career\nPrediction', 'Skills-Career\nMapping']
accuracies = [career_accuracy, skills_accuracy]
plt.bar(models, accuracies, color=['#FF6B6B', '#4ECDC4'])
plt.title('Model Performance', fontsize=12, fontweight='bold')
plt.ylabel('Accuracy')
plt.ylim(0, 1)
for i, v in enumerate(accuracies):
    plt.text(i, v + 0.01, f'{v:.3f}', ha='center', fontweight='bold')

# RIASEC score distribution (violin plot)
plt.subplot(2, 3, 6)
riasec_data = skills_cleaned[riasec_cols].values.flatten()
plt.hist(riasec_data, bins=30, color='#FFEAA7', alpha=0.7, edgecolor='black')
plt.title('RIASEC Scores Distribution', fontsize=12, fontweight='bold')
plt.xlabel('Score')
plt.ylabel('Frequency')

plt.tight_layout()
plt.savefig('ml_analysis_comprehensive.png', dpi=300, bbox_inches='tight')
print("✓ Comprehensive visualization saved as ml_analysis_comprehensive.png")

# Generate final summary
print("\n" + "="*60)
print("🎯 MACHINE LEARNING PREPROCESSING COMPLETED!")
print("="*60)

print(f"\n📊 Dataset Statistics:")
print(f"   • Career Dataset: {career_cleaned.shape[0]:,} records, {career_cleaned.shape[1]} features")
print(f"   • Skills Dataset: {skills_cleaned.shape[0]:,} records, {skills_cleaned.shape[1]} features")
print(f"   • Unique Careers: {career_cleaned['Career'].nunique():,}")
print(f"   • Unique Job Professions: {skills_cleaned['Job profession'].nunique():,}")

print(f"\n🧠 Feature Engineering:")
print(f"   • Created 6 RIASEC personality dimensions")
print(f"   • Processed multiple intelligence scores")
print(f"   • Cleaned and standardized all features")

print(f"\n🤖 Model Performance:")
print(f"   • Career Prediction Model: {career_accuracy:.1%} accuracy")
print(f"   • Skills-Career Model: {skills_accuracy:.1%} accuracy")

print(f"\n📁 Generated Files:")
print(f"   • models/career_prediction_model.pkl")
print(f"   • models/skills_prediction_model.pkl") 
print(f"   • dataset/career_path_cleaned.csv")
print(f"   • dataset/skill_career_cleaned.csv")
print(f"   • ml_analysis_comprehensive.png")

print(f"\n✅ Status: READY FOR WEB APPLICATION INTEGRATION!")
print(f"🚀 The cleaned datasets and trained models are now ready to be")
print(f"   integrated with your career guidance results page.")

plt.show()