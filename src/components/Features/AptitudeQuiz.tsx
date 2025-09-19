import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Results from './Results';
import { badgeService } from '../../services/badgeService';
import BadgeNotification from '../UI/BadgeNotification';

type Question = {
  id: number;
  question: string;
  options: string[];
  correct?: number; // For Section A only
};

type CareerCategory = {
  code: 'I' | 'A' | 'S' | 'E' | 'R';
  name: string;
  description: string;
  careers: string[];
};

const CAREER_CATEGORIES: CareerCategory[] = [
  {
    code: 'I',
    name: 'Investigative (Thinkers)',
    description: 'Science, Medicine, Research, Engineering',
    careers: ['Scientist', 'Doctor', 'Engineer', 'Researcher', 'Data Scientist', 'Psychologist']
  },
  {
    code: 'A',
    name: 'Artistic (Creators)',
    description: 'Arts, Media, Design, Literature',
    careers: ['Artist', 'Designer', 'Writer', 'Actor', 'Musician', 'Architect']
  },
  {
    code: 'S',
    name: 'Social (Helpers)',
    description: 'Teaching, Healthcare, Social Work',
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker', 'Therapist', 'Coach']
  },
  {
    code: 'E',
    name: 'Enterprising (Leaders)',
    description: 'Business, Politics, Law, Management',
    careers: ['Businessman', 'Politician', 'Lawyer', 'Manager', 'Entrepreneur', 'Sales Manager']
  },
  {
    code: 'R',
    name: 'Realistic (Doers)',
    description: 'Army, Sports, Technical trades',
    careers: ['Army Officer', 'Sportsman', 'Technician', 'Mechanic', 'Pilot', 'Chef']
  }
];

const QUESTIONS: Question[] = [
  // Section A: Cognitive Aptitude (Q1-10)
  {
    id: 1,
    question: "A train runs 60 km in 1.5 hours. What is its average speed?",
    options: ["30 km/hr", "40 km/hr", "45 km/hr", "50 km/hr"],
    correct: 1 // 40 km/hr
  },
  {
    id: 2,
    question: "If all roses are flowers and some flowers are lilies, which statement is true?",
    options: [
      "All lilies are roses",
      "Some lilies are not flowers", 
      "All roses are lilies",
      "Some flowers are roses"
    ],
    correct: 3 // Some flowers are roses
  },
  {
    id: 3,
    question: "Find the missing number: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "34"],
    correct: 1 // 30
  },
  {
    id: 4,
    question: "Which is the odd one out?",
    options: ["Tiger", "Lion", "Leopard", "Whale"],
    correct: 3 // Whale
  },
  {
    id: 5,
    question: "Simplify: (25 ÷ 5) × (8 – 3)",
    options: ["20", "15", "25", "30"],
    correct: 2 // 25
  },
  {
    id: 6,
    question: "Ravi is older than Sita. Sita is older than Amit. Who is the youngest?",
    options: ["Ravi", "Sita", "Amit", "Cannot be determined"],
    correct: 2 // Amit
  },
  {
    id: 7,
    question: "What comes next? A, C, F, J, O, ?",
    options: ["S", "T", "U", "V"],
    correct: 2 // U
  },
  {
    id: 8,
    question: "If CLOCK is written as DMPDL, how is WATCH written?",
    options: ["XBUDI", "XBVTI", "XBVUJ", "YBVTI"],
    correct: 2 // XBVUJ
  },
  {
    id: 9,
    question: "A shopkeeper buys a pen for ₹20 and sells it for ₹25. What is the profit percentage?",
    options: ["20%", "25%", "30%", "15%"],
    correct: 1 // 25%
  },
  {
    id: 10,
    question: "Which shape completes the series? ▲, ■, ●, ▲, ■, ?",
    options: ["▲", "■", "●", "◆"],
    correct: 2 // ●
  },

  // Section B: Interests & Preferences (Q11-20)
  {
    id: 11,
    question: "Which of these activities do you enjoy the most?",
    options: [
      "Solving puzzles or coding", // I
      "Drawing, painting, acting", // A
      "Helping others with problems", // S
      "Leading a team or organizing events", // E
      "Repairing gadgets/tools" // R
    ]
  },
  {
    id: 12,
    question: "Which school subject excites you the most?",
    options: [
      "Math/Science", // I
      "Arts/History/Literature", // A
      "Biology", // S
      "Commerce/Business Studies", // E
      "Sports/Physical Education" // R
    ]
  },
  {
    id: 13,
    question: "You are happiest when…",
    options: [
      "You solve a tough problem", // I
      "You create something new", // A
      "You help a friend", // S
      "You take charge of a group", // E
      "You play sports" // R
    ]
  },
  {
    id: 14,
    question: "If you could attend a free workshop, what would you choose?",
    options: [
      "Robotics and AI", // I
      "Creative Writing", // A
      "Health Awareness", // S
      "Startup Skills", // E
      "Sports Training" // R
    ]
  },
  {
    id: 15,
    question: "What do you enjoy more?",
    options: [
      "Experiments and projects", // I
      "Performances/art shows", // A
      "Helping juniors study", // S
      "Leading school events", // E
      "Fixing machines/cycles" // R
    ]
  },
  {
    id: 16,
    question: "Which career seems most exciting to you?",
    options: [
      "Scientist/Doctor", // I
      "Artist/Designer", // A
      "Teacher/Counselor", // S
      "Businessman/Politician", // E
      "Engineer/Army Officer" // R
    ]
  },
  {
    id: 17,
    question: "How do you like spending your free time?",
    options: [
      "Solving riddles/puzzles", // I
      "Drawing/music", // A
      "Volunteering/helping", // S
      "Networking with people", // E
      "Sports/outdoor games" // R
    ]
  },
  {
    id: 18,
    question: "Which newspaper section do you read first?",
    options: [
      "Science & Tech", // I
      "Arts & Culture", // A
      "Health/Education", // S
      "Business/Politics", // E
      "Sports" // R
    ]
  },
  {
    id: 19,
    question: "What type of movies inspire you the most?",
    options: [
      "Scientific/Tech", // I
      "Creative/Drama", // A
      "Social Message", // S
      "Leadership/Politics", // E
      "Action/Adventure" // R
    ]
  },
  {
    id: 20,
    question: "If given ₹10,000, what would you spend it on?",
    options: [
      "Science kit/computer", // I
      "Art supplies/camera", // A
      "Charity/help others", // S
      "Investment/startup", // E
      "Sports equipment" // R
    ]
  },

  // Section C: Personality & Work Style (Q21-30)
  {
    id: 21,
    question: "In a group project, you usually…",
    options: [
      "Do detailed research and analysis", // I
      "Come up with creative ideas", // A
      "Support the group by helping others", // S
      "Take charge and lead the group", // E
      "Handle practical tasks and execution" // R
    ]
  },
  {
    id: 22,
    question: "You prefer working…",
    options: [
      "Alone, with focus", // I
      "In a team, sharing ideas", // A
      "With people, interacting a lot", // S
      "With tools, machines, or outdoors" // R (4 options only)
    ]
  },
  {
    id: 23,
    question: "When solving a problem, you…",
    options: [
      "Use logic and facts", // I
      "Think creatively", // A
      "Ask for opinions from others", // S
      "Take quick practical action" // R (4 options only)
    ]
  },
  {
    id: 24,
    question: "Your friends would describe you as…",
    options: [
      "Disciplined and hardworking", // I
      "Creative thinker", // A
      "Caring and helpful", // S
      "Leader", // E
      "Adventurous and active" // R
    ]
  },
  {
    id: 25,
    question: "When given a tough task, you…",
    options: [
      "Break it into logical steps", // I
      "Look for a new/unique solution", // A
      "Ask for help or support others", // S
      "Take initiative and get it done", // E
      "Keep trying until you succeed" // R
    ]
  },
  {
    id: 26,
    question: "You feel more confident when…",
    options: [
      "You understand concepts deeply", // I
      "You express creativity", // A
      "You help someone in need", // S
      "You make decisions and lead", // E
      "You complete physical or technical work" // R
    ]
  },
  {
    id: 27,
    question: "In class discussions, you usually…",
    options: [
      "Give logical explanations", // I
      "Share innovative ideas", // A
      "Support others' points", // S
      "Try to convince people of your view", // E
      "Stay practical and to the point" // R
    ]
  },
  {
    id: 28,
    question: "What motivates you most?",
    options: [
      "Knowledge and learning", // I
      "Creativity and innovation", // A
      "Helping others and teamwork", // S
      "Leadership and achievement", // E
      "Action and challenges" // R
    ]
  },
  {
    id: 29,
    question: "You get frustrated when…",
    options: [
      "Things are illogical", // I
      "You cannot express yourself", // A
      "People fight or are ignored", // S
      "You don't have control", // E
      "Work is slow and boring" // R
    ]
  },
  {
    id: 30,
    question: "You feel happiest when…",
    options: [
      "You solve a complex problem", // I
      "You create something new", // A
      "You help or support others", // S
      "You achieve leadership goals", // E
      "You do practical, outdoor, or active tasks" // R
    ]
  },

  // Section D: Career Values & Motivation (Q31-40)
  {
    id: 31,
    question: "What matters most to you in a career?",
    options: [
      "Innovation & creativity", // I
      "Helping society & making an impact", // A
      "High salary & financial security", // S
      "Respect, power, and leadership", // E
      "Stability & work-life balance" // R
    ]
  },
  {
    id: 32,
    question: "Which role would you prefer in a group?",
    options: [
      "Researcher", // I
      "Creative designer", // A
      "Supportive guide", // S
      "Leader", // E
      "Executor of tasks" // R
    ]
  },
  {
    id: 33,
    question: "If you could choose one award, which would you prefer?",
    options: [
      "Best Scientist/Innovator", // I
      "Best Artist/Performer", // A
      "Social Worker of the Year", // S
      "Entrepreneur of the Year", // E
      "Best Sportsman/Practical Achiever" // R
    ]
  },
  {
    id: 34,
    question: "What motivates you most in life?",
    options: [
      "Gaining knowledge", // I
      "Expressing creativity", // A
      "Helping people", // S
      "Achieving power/success", // E
      "Overcoming challenges" // R
    ]
  },
  {
    id: 35,
    question: "If your teacher praises you, what would make you most proud?",
    options: [
      "You are intelligent", // I
      "You are creative", // A
      "You are kind and helpful", // S
      "You are a good leader", // E
      "You are hardworking and disciplined" // R
    ]
  },
  {
    id: 36,
    question: "What kind of job environment would you enjoy?",
    options: [
      "Research labs/offices", // I
      "Creative studios/stages", // A
      "Hospitals/schools/community", // S
      "Business centers/meetings", // E
      "Outdoors, workshops, or technical sites" // R
    ]
  },
  {
    id: 37,
    question: "What do you think is the biggest success in life?",
    options: [
      "Inventing something new", // I
      "Creating something inspiring", // A
      "Making a difference to others", // S
      "Becoming rich and powerful", // E
      "Living a disciplined and stable life" // R
    ]
  },
  {
    id: 38,
    question: "If you face failure, what do you do?",
    options: [
      "Learn and try logically again", // I
      "Try a new creative approach", // A
      "Take support from others", // S
      "Push harder and lead again", // E
      "Work harder and stay strong" // R
    ]
  },
  {
    id: 39,
    question: "What excites you most about the future?",
    options: [
      "Discovering/learning new things", // I
      "Creating art or new ideas", // A
      "Helping society grow", // S
      "Leading big projects/businesses", // E
      "Facing challenges and action" // R
    ]
  },
  {
    id: 40,
    question: "If you could choose one career path right now, what would you pick?",
    options: [
      "Scientist/Doctor/Engineer", // I
      "Artist/Writer/Actor", // A
      "Teacher/Counselor/Nurse", // S
      "Businessman/Politician/Lawyer", // E
      "Army Officer/Sportsman/Technician" // R
    ]
  }
];

const AptitudeQuiz: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<'start' | 'section' | 'results'>('start');
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(40).fill(-1));
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
  const [studentClass, setStudentClass] = useState<'10' | '12' | ''>('');
  const [badgeNotification, setBadgeNotification] = useState<{badge: any, isVisible: boolean}>({badge: null, isVisible: false});
  const [results, setResults] = useState<any>(null);
  const [hasTriggeredAptitudeBadge, setHasTriggeredAptitudeBadge] = useState(false);
  const quizTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timeRemaining > 0 && currentPage === 'section') {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      setCurrentPage('results');
    }
  }, [timeRemaining, currentPage]);

  // Scroll to top when section or page changes
  useEffect(() => {
    if (quizTopRef.current) {
      quizTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage, currentSection]);

  // Trigger aptitude badge when quiz is completed
  const triggerAptitudeBadge = async () => {
    if (hasTriggeredAptitudeBadge) return;
    
    console.log('🎯 Triggering aptitude badge...');
    try {
      const result = await badgeService.triggerAptitudeBadge();
      console.log('🎯 Badge service result:', result);
      if (result?.isNewBadge && result.badge) {
        console.log('🎉 New badge earned! Showing notification:', result.badge);
        setBadgeNotification({ badge: result.badge, isVisible: true });
        setHasTriggeredAptitudeBadge(true);
      } else {
        console.log('🔔 No new badge or badge already earned');
      }
    } catch (error) {
      console.error('❌ Failed to trigger aptitude badge:', error);
    }
  };

  const calculateResults = () => {
    // Section A: Cognitive Aptitude (Q1-10)
    let aptitudeScore = 0;
    for (let i = 0; i < 10; i++) {
      if (answers[i] === QUESTIONS[i].correct) {
        aptitudeScore++;
      }
    }

    // Sections B, C, D: Career Preferences (Q11-40)
    const careerScores = { I: 0, A: 0, S: 0, E: 0, R: 0 };
    
    for (let i = 10; i < 40; i++) {
      const answerIndex = answers[i];
      if (answerIndex !== -1) {
        // Map answer index to career category
        const categories = ['I', 'A', 'S', 'E', 'R'];
        const question = QUESTIONS[i];
        
        // Handle questions with different number of options
        if (question.options.length === 4) {
          // Questions 22, 23 map differently
          if (i === 21) { // Q22: working preferences
            const mapping = ['I', 'A', 'S', 'R'];
            if (mapping[answerIndex]) {
              careerScores[mapping[answerIndex] as keyof typeof careerScores]++;
            }
          } else if (i === 22) { // Q23: problem solving
            const mapping = ['I', 'A', 'S', 'R'];
            if (mapping[answerIndex]) {
              careerScores[mapping[answerIndex] as keyof typeof careerScores]++;
            }
          }
        } else {
          // 5-option questions map directly to I, A, S, E, R
          if (categories[answerIndex]) {
            careerScores[categories[answerIndex] as keyof typeof careerScores]++;
          }
        }
      }
    }

    return { aptitudeScore, careerScores };
  };

  const getTopCareerMatches = (careerScores: { I: number; A: number; S: number; E: number; R: number }) => {
    const sortedScores = Object.entries(careerScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
    
    return sortedScores.map(([code]) => 
      CAREER_CATEGORIES.find(cat => cat.code === code)!
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAptitudeLevel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Above Average";
    if (score >= 4) return "Average";
    return "Below Average";
  };

  const getSectionName = (sectionIndex: number) => {
    const sections = [
      "Section A: Cognitive Aptitude",
      "Section B: Interests & Preferences", 
      "Section C: Personality & Work Style",
      "Section D: Career Values & Motivation"
    ];
    return sections[sectionIndex];
  };

  const getSectionQuestions = (sectionIndex: number) => {
    const ranges = [[0, 10], [10, 20], [20, 30], [30, 40]];
    const [start, end] = ranges[sectionIndex];
    return QUESTIONS.slice(start, end);
  };

  const getSectionAnswers = (sectionIndex: number) => {
    const ranges = [[0, 10], [10, 20], [20, 30], [30, 40]];
    const [start, end] = ranges[sectionIndex];
    return answers.slice(start, end);
  };

  const getStreamRecommendations = (topMatches: CareerCategory[]) => {
    const streamMap = {
      'I': {
        stream: 'Science (PCM/PCB)',
        subjects: ['Physics', 'Chemistry', 'Mathematics/Biology'],
        courses: ['Engineering', 'Medicine', 'Research', 'Data Science']
      },
      'A': {
        stream: 'Arts/Humanities',
        subjects: ['Literature', 'History', 'Psychology', 'Fine Arts'],
        courses: ['Fine Arts', 'Media Studies', 'Literature', 'Design']
      },
      'S': {
        stream: 'Science (PCB) / Arts',
        subjects: ['Biology', 'Psychology', 'Sociology'],
        courses: ['Medicine', 'Psychology', 'Social Work', 'Education']
      },
      'E': {
        stream: 'Commerce / Arts',
        subjects: ['Business Studies', 'Economics', 'Political Science'],
        courses: ['Business Management', 'Law', 'Economics', 'Political Science']
      },
      'R': {
        stream: 'Science (PCM) / Commerce',
        subjects: ['Physics', 'Mathematics', 'Physical Education'],
        courses: ['Engineering', 'Sports Science', 'Technical Trades']
      }
    };
    
    return topMatches.map(match => streamMap[match.code]).filter(Boolean);
  };

  const submitSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
      // Scrolling is now handled by useEffect
    } else {
      setCurrentPage('results');
      // Trigger aptitude badge when quiz is completed
      triggerAptitudeBadge();
    }
  };

  // Add scroll to top when returning to start page
  const handleRetakeQuiz = () => {
    setCurrentPage('start');
    setCurrentSection(0);
    setAnswers(new Array(40).fill(-1));
    setTimeRemaining(30 * 60);
    setStudentClass('');
    // Scrolling is now handled by useEffect
  };

  const isSectionComplete = (sectionIndex: number) => {
    const sectionAnswers = getSectionAnswers(sectionIndex);
    return sectionAnswers.every(answer => answer !== -1);
  };

  const calculatedResults = currentPage === 'results' ? calculateResults() : null;
  const topMatches = calculatedResults ? getTopCareerMatches(calculatedResults.careerScores) : [];
  const streamRecommendations = topMatches.length > 0 ? getStreamRecommendations(topMatches) : [];

  // Start Page
  if (currentPage === 'start') {
    return (
      <div ref={quizTopRef} className="w-full mx-auto p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
                Career Discovery
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-3 font-medium">
                Unlock Your Future Potential
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Advanced Assessment for Class 10 & 12 Students
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">25-30 Minutes</h3>
                <p className="text-gray-600 dark:text-gray-300">Quick & Comprehensive</p>
              </div>
              
              <div className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">40 Questions</h3>
                <p className="text-gray-600 dark:text-gray-300">Scientifically Designed</p>
              </div>
              
              <div className="group p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Instant Results</h3>
                <p className="text-gray-600 dark:text-gray-300">Personalized Guidance</p>
              </div>
            </div>

            {/* Assessment Sections */}
            <div className="mb-12 p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white">Assessment Modules</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">A</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Cognitive Aptitude</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Logic & Reasoning</p>
                  <span className="text-xs text-blue-600 dark:text-blue-400 mt-2 font-medium">10 Questions</span>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700">
                  <div className="w-12 h-12 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">B</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Interests & Preferences</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">What You Love</p>
                  <span className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">10 Questions</span>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700">
                  <div className="w-12 h-12 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">C</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Personality & Work Style</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">How You Work</p>
                  <span className="text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium">10 Questions</span>
                </div>
                
                <div className="flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl border border-orange-200 dark:border-orange-700">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">D</div>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Career Values</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">What Matters Most</p>
                  <span className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-medium">10 Questions</span>
                </div>
              </div>
            </div>

            {/* Class Selection */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Select Your Current Grade</h3>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setStudentClass('10')}
                  className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    studentClass === '10'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/25'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">10</span>
                    </div>
                    <span>Class 10th</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setStudentClass('12')}
                  className={`group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    studentClass === '12'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/25'
                      : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">12</span>
                    </div>
                    <span>Class 12th</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Start Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrentPage('section');
                  setCurrentSection(0);
                }}
                disabled={!studentClass}
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white text-xl font-bold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl shadow-blue-500/25 disabled:shadow-none"
              >
                <div className="flex items-center space-x-3">
                  <span>Begin Assessment</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Section Page
  if (currentPage === 'section') {
    const sectionQuestions = getSectionQuestions(currentSection);
    const sectionAnswers = getSectionAnswers(currentSection);
    const sectionColors = ['blue', 'green', 'purple', 'orange'];
    const currentColor = sectionColors[currentSection];

    return (
      <div ref={quizTopRef} className="w-full mx-auto p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-8">
              <div className={`px-6 py-3 bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 text-white rounded-2xl text-lg font-bold shadow-lg`}>
                Section {String.fromCharCode(65 + currentSection)}
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-6">
              {getSectionName(currentSection)}
            </h2>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8 shadow-inner">
              <div 
                className={`bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-600 h-3 rounded-full transition-all duration-500 shadow-lg`}
                style={{ width: `${((currentSection + 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8 mb-12">
            {sectionQuestions.map((question, index) => {
              const globalIndex = currentSection * 10 + index;
              return (
                <div key={question.id} className="p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    <span className={`text-${currentColor}-600 dark:text-${currentColor}-400 mr-3`}>Q{index + 1}.</span>
                    {question.question}
                  </h3>
                  
                  <div className="grid gap-4">
                    {question.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => {
                          const newAnswers = [...answers];
                          newAnswers[globalIndex] = optionIndex;
                          setAnswers(newAnswers);
                        }}
                        className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                          answers[globalIndex] === optionIndex
                            ? `border-${currentColor}-500 bg-gradient-to-r from-${currentColor}-50 to-${currentColor}-100 dark:from-${currentColor}-900/30 dark:to-${currentColor}-800/30 text-${currentColor}-700 dark:text-${currentColor}-300 shadow-lg shadow-${currentColor}-500/25`
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl font-bold text-lg flex items-center justify-center transition-all duration-300 ${
                            answers[globalIndex] === optionIndex
                              ? `bg-${currentColor}-500 text-white`
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                          }`}>
                            {String.fromCharCode(97 + optionIndex)}
                          </div>
                          <span className="text-lg font-medium">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              {[0, 1, 2, 3].map((sectionIndex) => (
                <div
                  key={sectionIndex}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    sectionIndex < currentSection
                      ? 'bg-green-500 shadow-lg shadow-green-500/25'
                      : sectionIndex === currentSection
                      ? `bg-${currentColor}-500 shadow-lg shadow-${currentColor}-500/25`
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                {sectionAnswers.filter(a => a !== -1).length} of {sectionQuestions.length} completed
              </span>
            </div>
            
            <button
              onClick={submitSection}
              disabled={!isSectionComplete(currentSection)}
              className={`group px-8 py-4 bg-gradient-to-r from-${currentColor}-600 to-${currentColor}-700 text-white text-lg font-bold rounded-2xl hover:from-${currentColor}-700 hover:to-${currentColor}-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-xl shadow-${currentColor}-500/25 disabled:shadow-none`}
            >
              <div className="flex items-center space-x-2">
                <span>{currentSection === 3 ? 'View Results' : 'Next Section'}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results Page
  if (currentPage === 'results' && calculatedResults) {
    return (
      <>
        <Results
          studentClass={studentClass as '10' | '12'}
          aptitudeScore={calculatedResults.aptitudeScore}
          careerScores={calculatedResults.careerScores}
          onRetakeQuiz={handleRetakeQuiz}
          onBadgeEarned={(badge) => {
            setBadgeNotification({ badge, isVisible: true });
          }}
        />
        
        <BadgeNotification
          badge={badgeNotification.badge}
          isVisible={badgeNotification.isVisible}
          onClose={() => setBadgeNotification({badge: null, isVisible: false})}
        />
      </>
    );
  }

  return null; // This should never be reached

};

export default AptitudeQuiz;