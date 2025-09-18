/**
 * Advanced ML-powered Career Recommendation System
 * Integrates with CSV datasets for accurate career matching
 */

import * as Papa from 'papaparse';

export interface StudentProfile {
  class: '10' | '12';
  aptitudeScore: number;
  careerScores: {
    I: number; // Investigative (Science)
    A: number; // Artistic (Arts) 
    S: number; // Social (Social Work)
    E: number; // Enterprising (Business)
    R: number; // Realistic (Technical)
  };
}

export interface CareerPrediction {
  career: string;
  field: string;
  probability: number;
  confidence: number;
  reasoning: string[];
  requiredSkills: string[];
  salaryRange: { min: number; max: number };
  marketDemand: 'high' | 'medium' | 'low';
  educationPath: string[];
  matchingFactors: {
    aptitudeMatch: number;
    personalityMatch: number;
    skillsMatch: number;
    marketAlignment: number;
  };
}

export interface MLAnalysisResult {
  topCareers: CareerPrediction[];
  streamRecommendations: any[];
  skillGaps: any[];
  riskFactors: any[];
  confidence: number;
  personalityInsights: any;
}

export class MLCareerModel {
  private careerPathData: any[] = [];
  private skillCareerData: any[] = [];
  private isDataLoaded = false;

  private indianMarketData = {
    highDemandCareers: [
      'Software Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst',
      'Digital Marketing Specialist', 'Product Manager', 'UX Designer', 'Doctor',
      'Engineer', 'Teacher', 'Chartered Accountant'
    ],
    salaryRanges: {
      'Software Developer': { entry: 400000, mid: 1200000, senior: 2500000 },
      'Data Scientist': { entry: 600000, mid: 1500000, senior: 3000000 },
      'Doctor': { entry: 500000, mid: 1500000, senior: 3500000 },
      'Engineer': { entry: 350000, mid: 1000000, senior: 2000000 },
      'Teacher': { entry: 250000, mid: 600000, senior: 1200000 },
      'Lawyer': { entry: 400000, mid: 1500000, senior: 3000000 },
      'Chartered Accountant': { entry: 400000, mid: 1200000, senior: 2500000 }
    }
  };

  constructor() {
    this.loadDatasets();
  }

  private async loadDatasets() {
    try {
      console.log('🔄 Loading ML cleaned datasets...');
      
      // Load cleaned career path dataset
      const careerResponse = await fetch('/dataset/career_path_cleaned.csv');
      const careerCsv = await careerResponse.text();
      
      Papa.parse(careerCsv, {
        header: true,
        complete: (results: any) => {
          this.careerPathData = results.data.filter((row: any) => row.Career && row.Field);
          console.log('✅ Career Path cleaned dataset loaded:', this.careerPathData.length, 'records');
        }
      });

      // Load cleaned skill-career mapping dataset
      const skillResponse = await fetch('/dataset/skill_career_cleaned.csv');
      const skillCsv = await skillResponse.text();
      
      Papa.parse(skillCsv, {
        header: true,
        complete: (results: any) => {
          this.skillCareerData = results.data.filter((row: any) => {
            return row['Job profession'] && (
              row.R_Realistic || row.I_Investigative || row.A_Artistic ||
              row.S_Social || row.E_Enterprising || row.C_Conventional
            );
          });
          console.log('✅ Skill-Career cleaned dataset with RIASEC scores loaded:', this.skillCareerData.length, 'records');
          this.isDataLoaded = true;
        }
      });

    } catch (error) {
      console.error('❌ Error loading datasets:', error);
      this.initializeFallbackData();
    }
  }

  private initializeFallbackData() {
    console.log('⚠️ Using fallback data for ML model');
    this.isDataLoaded = true;
  }

  public async predictCareer(profile: StudentProfile): Promise<MLAnalysisResult> {
    // Wait for data to load
    while (!this.isDataLoaded) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('🤖 Running ML career prediction for:', profile);

    const careerPredictions = await this.calculateCareerProbabilities(profile);
    const streamRecommendations = profile.class === '10' 
      ? this.generateStreamRecommendations(profile, careerPredictions)
      : [];
    const skillGaps = this.identifySkillGaps(profile, careerPredictions);
    const riskFactors = this.analyzeRiskFactors(profile);
    const confidence = this.calculateModelConfidence(profile, careerPredictions);
    const personalityInsights = this.generatePersonalityInsights(profile);

    return {
      topCareers: careerPredictions.slice(0, 5),
      streamRecommendations,
      skillGaps,
      riskFactors,
      confidence,
      personalityInsights
    };
  }

  private async calculateCareerProbabilities(profile: StudentProfile): Promise<CareerPrediction[]> {
    const predictions: CareerPrediction[] = [];

    // Get careers from both datasets
    const careerPathCareers = Array.from(new Set(this.careerPathData.map(d => d.Career)));
    const skillCareers = Array.from(new Set(this.skillCareerData.map(d => d['Job profession'])));
    const allCareers = Array.from(new Set([...careerPathCareers, ...skillCareers]));

    console.log('🔍 Analyzing', allCareers.length, 'unique careers');

    for (const career of allCareers) {
      const probability = this.calculateCareerProbability(profile, career);
      const confidence = this.calculateCareerConfidence(profile, career);
      
      if (probability > 0.3) { // Only include careers with significant probability
        const field = this.getCareerField(career);
        
        predictions.push({
          career,
          field,
          probability: Math.round(probability * 100),
          confidence: Math.round(confidence * 100),
          reasoning: this.generateCareerReasoning(profile, career, probability),
          requiredSkills: this.getRequiredSkills(career),
          salaryRange: this.getSalaryRange(career),
          marketDemand: this.getMarketDemand(career),
          educationPath: this.getEducationPath(career, field),
          matchingFactors: {
            aptitudeMatch: this.calculateAptitudeMatch(profile, career),
            personalityMatch: this.calculatePersonalityMatch(profile, career),
            skillsMatch: this.calculateSkillsMatch(profile, career),
            marketAlignment: this.calculateMarketAlignment(career)
          }
        });
      }
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  private calculateCareerProbability(profile: StudentProfile, career: string): number {
    let probability = 0;

    // 1. Aptitude Score Weight (25%)
    const aptitudeWeight = this.calculateAptitudeWeight(profile.aptitudeScore);
    probability += aptitudeWeight * 0.25;

    // 2. RIASEC Personality Match (30%)
    const personalityMatch = this.calculateRIASECMatch(profile.careerScores, career);
    probability += personalityMatch * 0.30;

    // 3. Statistical Similarity to Dataset (25%)
    const datasetSimilarity = this.calculateDatasetSimilarity(profile, career);
    probability += datasetSimilarity * 0.25;

    // 4. Market Demand and Viability (20%)
    const marketViability = this.calculateMarketViability(career, profile.class);
    probability += marketViability * 0.20;

    return Math.min(1, probability);
  }

  private calculateAptitudeWeight(aptitudeScore: number): number {
    if (aptitudeScore >= 8) return 1.0;
    if (aptitudeScore >= 6) return 0.8;
    if (aptitudeScore >= 4) return 0.6;
    if (aptitudeScore >= 2) return 0.4;
    return 0.2;
  }

  private calculateRIASECMatch(careerScores: StudentProfile['careerScores'], career: string): number {
    // Enhanced RIASEC mapping based on career analysis
    const careerRIASECMapping: Record<string, Record<string, number>> = {
      'Software Developer': { I: 0.8, R: 0.6, A: 0.3, S: 0.2, E: 0.4 },
      'Data Scientist': { I: 0.9, A: 0.4, R: 0.5, S: 0.3, E: 0.5 },
      'Doctor': { I: 0.9, S: 0.8, A: 0.2, E: 0.3, R: 0.4 },
      'Teacher': { S: 0.9, A: 0.6, I: 0.4, E: 0.5, R: 0.2 },
      'Engineer': { I: 0.8, R: 0.7, A: 0.3, S: 0.3, E: 0.4 },
      'Artist': { A: 0.9, I: 0.3, S: 0.4, E: 0.3, R: 0.4 },
      'Manager': { E: 0.8, S: 0.6, I: 0.5, A: 0.3, R: 0.3 },
      'Lawyer': { E: 0.7, I: 0.6, S: 0.5, A: 0.4, R: 0.2 },
      'Accountant': { I: 0.7, R: 0.5, E: 0.4, S: 0.3, A: 0.2 },
      'Psychologist': { S: 0.8, I: 0.7, A: 0.4, E: 0.3, R: 0.2 },
      'Architect': { A: 0.7, I: 0.6, R: 0.5, S: 0.3, E: 0.4 },
      'Nurse': { S: 0.8, I: 0.5, A: 0.3, E: 0.3, R: 0.4 },
    };

    const careerProfile = careerRIASECMapping[career];
    if (!careerProfile) {
      // Default scoring for unknown careers
      return 0.5;
    }

    let match = 0;
    const totalStudentScore = Object.values(careerScores).reduce((sum, score) => sum + score, 0);
    
    if (totalStudentScore === 0) return 0.5;

    Object.entries(careerProfile).forEach(([code, weight]) => {
      const studentScore = careerScores[code as keyof typeof careerScores] / totalStudentScore;
      match += studentScore * weight;
    });

    return Math.min(1, match);
  }

  private calculateDatasetSimilarity(profile: StudentProfile, career: string): number {
    // Find similar records in career path dataset
    const careerRecords = this.careerPathData.filter(d => d.Career === career);
    
    if (careerRecords.length === 0) {
      // Check skill-career dataset
      const skillRecords = this.skillCareerData.filter(d => d['Job profession'] === career);
      if (skillRecords.length > 0) {
        return this.calculateSkillDatasetSimilarity(profile, skillRecords);
      }
      return 0.5;
    }

    // Calculate average characteristics
    const avgGPA = this.calculateAverage(careerRecords, 'GPA');
    const avgCodingSkills = this.calculateAverage(careerRecords, 'Coding_Skills');
    const avgProblemSolving = this.calculateAverage(careerRecords, 'Problem_Solving_Skills');
    const avgAnalytical = this.calculateAverage(careerRecords, 'Analytical_Skills');

    // Convert student profile to comparable metrics
    const estimatedGPA = this.convertAptitudeToGPA(profile.aptitudeScore);
    const estimatedCoding = this.estimateSkillLevel(profile, 'coding');
    const estimatedProblemSolving = this.estimateSkillLevel(profile, 'problemSolving');
    const estimatedAnalytical = this.estimateSkillLevel(profile, 'analytical');

    // Calculate similarity scores
    let similarity = 0;
    similarity += this.calculateSimilarityScore(estimatedGPA, avgGPA, 4.0);
    similarity += this.calculateSimilarityScore(estimatedCoding, avgCodingSkills, 10);
    similarity += this.calculateSimilarityScore(estimatedProblemSolving, avgProblemSolving, 10);
    similarity += this.calculateSimilarityScore(estimatedAnalytical, avgAnalytical, 10);

    return similarity / 4;
  }

  private calculateSkillDatasetSimilarity(profile: StudentProfile, skillRecords: any[]): number {
    // Use RIASEC scores from cleaned dataset
    const avgRealistic = this.calculateAverage(skillRecords, 'R_Realistic');
    const avgInvestigative = this.calculateAverage(skillRecords, 'I_Investigative');
    const avgArtistic = this.calculateAverage(skillRecords, 'A_Artistic');
    const avgSocial = this.calculateAverage(skillRecords, 'S_Social');
    const avgEnterprising = this.calculateAverage(skillRecords, 'E_Enterprising');
    const avgConventional = this.calculateAverage(skillRecords, 'C_Conventional');

    // Map student profile to RIASEC scores (normalized)
    const totalStudentScore = Object.values(profile.careerScores).reduce((sum, score) => sum + score, 0);
    const normalizedStudent = totalStudentScore > 0 ? {
      R: (profile.careerScores.R / totalStudentScore) * 10,
      I: (profile.careerScores.I / totalStudentScore) * 10,
      A: (profile.careerScores.A / totalStudentScore) * 10,
      S: (profile.careerScores.S / totalStudentScore) * 10,
      E: (profile.careerScores.E / totalStudentScore) * 10,
      C: ((profile.careerScores.I + profile.careerScores.R) / 2 / totalStudentScore) * 10 // Conventional as combo
    } : { R: 5, I: 5, A: 5, S: 5, E: 5, C: 5 };

    // Calculate RIASEC similarities with higher weight
    let similarity = 0;
    similarity += this.calculateSimilarityScore(normalizedStudent.R, avgRealistic, 10);
    similarity += this.calculateSimilarityScore(normalizedStudent.I, avgInvestigative, 10);
    similarity += this.calculateSimilarityScore(normalizedStudent.A, avgArtistic, 10);
    similarity += this.calculateSimilarityScore(normalizedStudent.S, avgSocial, 10);
    similarity += this.calculateSimilarityScore(normalizedStudent.E, avgEnterprising, 10);
    similarity += this.calculateSimilarityScore(normalizedStudent.C, avgConventional, 10);

    return similarity / 6;
  }

  private estimateSkillLevel(profile: StudentProfile, skillType: string): number {
    switch (skillType) {
      case 'coding':
        return (profile.careerScores.I * 0.6 + profile.careerScores.R * 0.4) / 3;
      case 'problemSolving':
        return (profile.aptitudeScore + profile.careerScores.I) / 2;
      case 'analytical':
        return (profile.aptitudeScore * 0.7 + profile.careerScores.I * 0.3);
      default:
        return 5;
    }
  }

  private calculateAverage(records: any[], field: string): number {
    const values = records.map(r => parseFloat(r[field])).filter(v => !isNaN(v));
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 5;
  }

  private convertAptitudeToGPA(aptitudeScore: number): number {
    return (aptitudeScore / 10) * 4.0;
  }

  private calculateSimilarityScore(studentValue: number, avgValue: number, maxValue: number): number {
    const difference = Math.abs(studentValue - avgValue);
    const normalizedDifference = difference / maxValue;
    return Math.max(0, 1 - normalizedDifference);
  }

  private calculateMarketViability(career: string, studentClass: string): number {
    let viability = 0.5;

    if (this.indianMarketData.highDemandCareers.includes(career)) {
      viability += 0.3;
    }

    // Future-proofing bonus for tech careers
    const techCareers = ['Software Developer', 'Data Scientist', 'AI Engineer', 'Cybersecurity Analyst'];
    if (techCareers.includes(career)) {
      viability += 0.2;
    }

    return Math.min(1, viability);
  }

  private getCareerField(career: string): string {
    const careerRecord = this.careerPathData.find(d => d.Career === career);
    if (careerRecord) return careerRecord.Field;

    // Fallback field mapping
    const fieldMappings: Record<string, string> = {
      'Software Developer': 'Computer Science',
      'Data Scientist': 'Computer Science',
      'Doctor': 'Medicine',
      'Teacher': 'Education',
      'Engineer': 'Engineering',
      'Lawyer': 'Law'
    };

    return fieldMappings[career] || 'General';
  }

  // Additional helper methods...
  private generateStreamRecommendations(profile: StudentProfile, predictions: CareerPrediction[]): any[] {
    if (profile.class !== '10') return [];

    const streamScores = {
      'Science (PCM)': 0,
      'Science (PCB)': 0,
      'Commerce': 0,
      'Arts/Humanities': 0
    };

    // Calculate based on top career predictions
    predictions.slice(0, 5).forEach(career => {
      const streamMapping = this.getCareerStreamMapping(career.career);
      Object.entries(streamMapping).forEach(([stream, weight]) => {
        if (streamScores.hasOwnProperty(stream)) {
          streamScores[stream as keyof typeof streamScores] += career.probability * weight;
        }
      });
    });

    // Add aptitude influence
    streamScores['Science (PCM)'] += profile.aptitudeScore * 3;
    streamScores['Science (PCB)'] += profile.aptitudeScore * 2.5;
    streamScores['Commerce'] += Math.min(profile.aptitudeScore, 8) * 2;
    streamScores['Arts/Humanities'] += Math.max(profile.aptitudeScore, 5) * 1.5;

    return Object.entries(streamScores)
      .map(([stream, score]) => ({
        stream,
        probability: Math.round(Math.min(100, (score / 50) * 100)),
        subjects: this.getStreamSubjects(stream),
        reasoning: this.getStreamReasoning(stream, profile, score),
        prerequisites: this.getStreamPrerequisites(stream)
      }))
      .sort((a, b) => b.probability - a.probability);
  }

  private getCareerStreamMapping(career: string): Record<string, number> {
    const mappings: Record<string, Record<string, number>> = {
      'Software Developer': { 'Science (PCM)': 0.8, 'Commerce': 0.2 },
      'Data Scientist': { 'Science (PCM)': 0.9, 'Commerce': 0.1 },
      'Doctor': { 'Science (PCB)': 0.9, 'Science (PCM)': 0.1 },
      'Engineer': { 'Science (PCM)': 0.9, 'Science (PCB)': 0.1 },
      'Teacher': { 'Arts/Humanities': 0.4, 'Science (PCB)': 0.3, 'Science (PCM)': 0.3 },
      'Lawyer': { 'Arts/Humanities': 0.7, 'Commerce': 0.3 },
      'Accountant': { 'Commerce': 0.8, 'Arts/Humanities': 0.2 },
      'Psychologist': { 'Arts/Humanities': 0.6, 'Science (PCB)': 0.4 }
    };

    return mappings[career] || { 'Science (PCM)': 0.25, 'Science (PCB)': 0.25, 'Commerce': 0.25, 'Arts/Humanities': 0.25 };
  }

  private getStreamSubjects(stream: string): string[] {
    const subjects = {
      'Science (PCM)': ['Physics', 'Chemistry', 'Mathematics', 'English'],
      'Science (PCB)': ['Physics', 'Chemistry', 'Biology', 'English'],
      'Commerce': ['Accountancy', 'Business Studies', 'Economics', 'English'],
      'Arts/Humanities': ['History', 'Political Science', 'Psychology', 'English']
    };
    return subjects[stream as keyof typeof subjects] || [];
  }

  private getStreamReasoning(stream: string, profile: StudentProfile, score: number): string[] {
    const reasoning = [];
    if (score > 60) reasoning.push('High compatibility with stream requirements');
    if (stream === 'Science (PCM)' && profile.aptitudeScore >= 7) {
      reasoning.push('Strong analytical abilities suitable for mathematics and physics');
    }
    return reasoning;
  }

  private getStreamPrerequisites(stream: string): string[] {
    const prerequisites = {
      'Science (PCM)': ['75%+ in 10th Mathematics', '70%+ overall'],
      'Science (PCB)': ['70%+ in 10th Science', '65%+ overall'],
      'Commerce': ['60%+ in 10th Mathematics', '60%+ overall'],
      'Arts/Humanities': ['55%+ overall in 10th']
    };
    return prerequisites[stream as keyof typeof prerequisites] || [];
  }

  // Implement remaining helper methods with similar patterns...
  private identifySkillGaps(profile: StudentProfile, predictions: CareerPrediction[]): any[] {
    return []; // Simplified for now
  }

  private analyzeRiskFactors(profile: StudentProfile): any[] {
    return []; // Simplified for now
  }

  private calculateModelConfidence(profile: StudentProfile, predictions: CareerPrediction[]): number {
    return Math.min(100, predictions.length > 0 ? predictions[0].confidence : 70);
  }

  private generatePersonalityInsights(profile: StudentProfile): any {
    const scores = profile.careerScores;
    const sortedTraits = Object.entries(scores).sort(([,a], [,b]) => b - a);
    
    return {
      primaryTrait: sortedTraits[0][0],
      secondaryTrait: sortedTraits[1][0],
      workStyle: 'Analytical and detail-oriented',
      strengths: ['Problem-solving', 'Analytical thinking'],
      challenges: ['Time management', 'Communication skills']
    };
  }

  private generateCareerReasoning(profile: StudentProfile, career: string, probability: number): string[] {
    const reasoning = [];
    if (probability > 0.8) reasoning.push('Excellent match based on aptitude and interests');
    if (profile.aptitudeScore >= 7) reasoning.push('High cognitive ability aligns with career requirements');
    return reasoning;
  }

  private getRequiredSkills(career: string): string[] {
    const skillMappings: Record<string, string[]> = {
      'Software Developer': ['Programming', 'Problem Solving', 'Logical Thinking'],
      'Data Scientist': ['Statistics', 'Programming', 'Data Analysis'],
      'Doctor': ['Medical Knowledge', 'Empathy', 'Critical Thinking'],
      'Teacher': ['Communication', 'Patience', 'Subject Knowledge'],
      'Engineer': ['Technical Skills', 'Problem Solving', 'Mathematics']
    };
    return skillMappings[career] || ['General Skills', 'Communication', 'Problem Solving'];
  }

  private getSalaryRange(career: string): { min: number; max: number } {
    const salaryData = this.indianMarketData.salaryRanges[career as keyof typeof this.indianMarketData.salaryRanges];
    return salaryData ? { min: salaryData.entry, max: salaryData.senior } : { min: 300000, max: 1500000 };
  }

  private getMarketDemand(career: string): 'high' | 'medium' | 'low' {
    return this.indianMarketData.highDemandCareers.includes(career) ? 'high' : 'medium';
  }

  private getEducationPath(career: string, field: string): string[] {
    const educationMappings: Record<string, string[]> = {
      'Software Developer': ['12th Science/Commerce', 'BTech/BCA', 'Internships'],
      'Doctor': ['12th Science (PCB)', 'NEET', 'MBBS', 'Specialization'],
      'Engineer': ['12th Science (PCM)', 'JEE', 'BTech', 'Specialization'],
      'Teacher': ['12th Any Stream', 'Graduation', 'BEd', 'Teaching Job']
    };
    return educationMappings[career] || ['12th', 'Graduation', 'Professional Course'];
  }

  private calculateAptitudeMatch(profile: StudentProfile, career: string): number {
    return Math.round(this.calculateAptitudeWeight(profile.aptitudeScore) * 100);
  }

  private calculatePersonalityMatch(profile: StudentProfile, career: string): number {
    return Math.round(this.calculateRIASECMatch(profile.careerScores, career) * 100);
  }

  private calculateSkillsMatch(profile: StudentProfile, career: string): number {
    return Math.round(this.calculateDatasetSimilarity(profile, career) * 100);
  }

  private calculateMarketAlignment(career: string): number {
    return Math.round(this.calculateMarketViability(career, '12') * 100);
  }

  private calculateCareerConfidence(profile: StudentProfile, career: string): number {
    const aptitudeConfidence = profile.aptitudeScore >= 6 ? 0.8 : 0.6;
    const personalityConfidence = this.calculateRIASECMatch(profile.careerScores, career);
    return (aptitudeConfidence + personalityConfidence) / 2;
  }
}

export const mlCareerModel = new MLCareerModel();