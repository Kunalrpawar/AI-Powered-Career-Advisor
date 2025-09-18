import React, { useState } from 'react';
import { Calendar, GraduationCap, FileText, Clock, MapPin, Users, Star, AlertCircle, ExternalLink, Eye, EyeOff } from 'lucide-react';

type ActiveTab = 'exams' | 'admissions' | 'events';

type ExamItem = {
  id: string;
  name: string;
  date: string;
  registrationDeadline: string;
  subjects: string[];
  eligibility: string;
  examMode: 'Online' | 'Offline' | 'Both';
  status: 'Ongoing' | 'Registration Open' | 'Coming Soon';
  applyLink: string;
  roadmap: RoadmapStep[];
};

type RoadmapStep = {
  id: string;
  title: string;
  description: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
};

type AdmissionItem = {
  id: string;
  collegeName: string;
  course: string;
  deadline: string;
  fees: string;
  seats: number;
  location: string;
  rating: number;
  status: 'Open' | 'Closing Soon' | 'Merit List Out';
  applyLink: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  type: 'Workshop' | 'Seminar' | 'Fair' | 'Competition';
  description: string;
  organizer: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  registrationRequired: boolean;
};

const currentExams: ExamItem[] = [
  {
    id: 'e1',
    name: 'JEE Main 2025 Session 1',
    date: '2025-01-22 to 2025-01-31',
    registrationDeadline: '2025-01-15',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    eligibility: '12th Pass with PCM',
    examMode: 'Online',
    status: 'Registration Open',
    applyLink: 'https://jeemain.nta.nic.in',
    roadmap: [
      { id: 'r1', title: 'Registration', description: 'Apply Online & Pay Fees', isCurrent: true },
      { id: 'r2', title: 'JEE Main Exam', description: 'Appear for JEE Main 2025', isCurrent: false },
      { id: 'r3', title: 'Result Declaration', description: 'JEE Main Results & All India Rank', isCurrent: false },
      { id: 'r4', title: 'JEE Advanced', description: 'Eligible for JEE Advanced', isCurrent: false },
      { id: 'r5', title: 'JoSAA Counselling', description: 'Choice Filling & Seat Allotment', isCurrent: false },
      { id: 'r6', title: 'Admission', description: 'IIT/NIT/IIIT Admission', isCurrent: false }
    ]
  },
  {
    id: 'e2',
    name: 'NEET UG 2025',
    date: '2025-05-05',
    registrationDeadline: '2025-03-15',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    eligibility: '12th Pass with PCB',
    examMode: 'Offline',
    status: 'Coming Soon',
    applyLink: 'https://neet.nta.nic.in',
    roadmap: [
      { id: 'n1', title: 'Registration', description: 'Online Application & Document Upload', isCurrent: false },
      { id: 'n2', title: 'Admit Card', description: 'Download NEET Admit Card', isCurrent: false },
      { id: 'n3', title: 'NEET Exam', description: 'Pen & Paper Based Test', isCurrent: false },
      { id: 'n4', title: 'Answer Key', description: 'Provisional Answer Key Release', isCurrent: false },
      { id: 'n5', title: 'Result', description: 'NEET Result & All India Rank', isCurrent: false },
      { id: 'n6', title: 'Counselling', description: 'MCC Counselling & State Counselling', isCurrent: false },
      { id: 'n7', title: 'Medical Admission', description: 'MBBS/BDS/AYUSH Admission', isCurrent: false }
    ]
  },
  {
    id: 'e3',
    name: 'CLAT 2025',
    date: '2025-12-01',
    registrationDeadline: '2025-10-15',
    subjects: ['English', 'Legal Reasoning', 'Logical Reasoning', 'Quantitative Techniques', 'Current Affairs'],
    eligibility: '12th Pass (Any Stream)',
    examMode: 'Online',
    status: 'Coming Soon',
    applyLink: 'https://consortiumofnlus.ac.in',
    roadmap: [
      { id: 'c1', title: 'Registration', description: 'CLAT Online Application', isCurrent: false },
      { id: 'c2', title: 'Admit Card', description: 'Download CLAT Admit Card', isCurrent: false },
      { id: 'c3', title: 'CLAT Exam', description: 'Computer Based Test', isCurrent: false },
      { id: 'c4', title: 'Answer Key', description: 'Provisional Answer Key', isCurrent: false },
      { id: 'c5', title: 'Result', description: 'CLAT Result & Merit List', isCurrent: false },
      { id: 'c6', title: 'Counselling', description: 'Choice Filling & Seat Allocation', isCurrent: false },
      { id: 'c7', title: 'Law Admission', description: 'NLU Law College Admission', isCurrent: false }
    ]
  },
  {
    id: 'e4',
    name: 'CAT 2025',
    date: '2025-11-24',
    registrationDeadline: '2025-09-15',
    subjects: ['Verbal Ability', 'Data Interpretation', 'Quantitative Ability'],
    eligibility: 'Bachelor\'s Degree',
    examMode: 'Online',
    status: 'Coming Soon',
    applyLink: 'https://iimcat.ac.in',
    roadmap: [
      { id: 'cat1', title: 'Registration', description: 'CAT Online Registration', isCurrent: false },
      { id: 'cat2', title: 'Admit Card', description: 'Download CAT Admit Card', isCurrent: false },
      { id: 'cat3', title: 'CAT Exam', description: 'Computer Adaptive Test', isCurrent: false },
      { id: 'cat4', title: 'Answer Key', description: 'Response Sheet & Answer Key', isCurrent: false },
      { id: 'cat5', title: 'Result', description: 'CAT Result & Percentile', isCurrent: false },
      { id: 'cat6', title: 'IIM Applications', description: 'Apply to IIMs & Other B-Schools', isCurrent: false },
      { id: 'cat7', title: 'PI/WAT', description: 'Personal Interview & Written Test', isCurrent: false },
      { id: 'cat8', title: 'MBA Admission', description: 'Final Admission to MBA Programs', isCurrent: false }
    ]
  }
];

const collegeAdmissions: AdmissionItem[] = [
  {
    id: 'a1',
    collegeName: 'Delhi University',
    course: 'B.A. (Hons.) Economics',
    deadline: '2025-07-15',
    fees: '₹15,000/year',
    seats: 54,
    location: 'New Delhi',
    rating: 4.8,
    status: 'Open',
    applyLink: 'https://admission.uod.ac.in'
  },
  {
    id: 'a2',
    collegeName: 'Jamia Millia Islamia',
    course: 'B.Tech Computer Science',
    deadline: '2025-06-30',
    fees: '₹45,000/year',
    seats: 120,
    location: 'New Delhi',
    rating: 4.5,
    status: 'Closing Soon',
    applyLink: 'https://jmicoe.in'
  },
  {
    id: 'a3',
    collegeName: 'Banaras Hindu University',
    course: 'B.Sc. Mathematics',
    deadline: '2025-07-20',
    fees: '₹12,000/year',
    seats: 80,
    location: 'Varanasi, UP',
    rating: 4.6,
    status: 'Open',
    applyLink: 'https://bhuonline.in'
  },
  {
    id: 'a4',
    collegeName: 'Aligarh Muslim University',
    course: 'MBBS',
    deadline: '2025-06-25',
    fees: '₹75,000/year',
    seats: 150,
    location: 'Aligarh, UP',
    rating: 4.7,
    status: 'Merit List Out',
    applyLink: 'https://amucontrollerexams.com'
  }
];

const futureEvents: EventItem[] = [
  {
    id: 'ev1',
    title: 'National Career Guidance Summit 2025',
    date: '2025-03-15',
    type: 'Seminar',
    description: 'Comprehensive career guidance session for students exploring various career paths',
    organizer: 'Ministry of Education',
    mode: 'Hybrid',
    registrationRequired: true
  },
  {
    id: 'ev2',
    title: 'Tech Innovation Workshop',
    date: '2025-02-20',
    type: 'Workshop',
    description: 'Hands-on workshop on latest technology trends and innovation in IT sector',
    organizer: 'IEEE Student Chapter',
    mode: 'Online',
    registrationRequired: true
  },
  {
    id: 'ev3',
    title: 'Medical Colleges Admission Fair',
    date: '2025-04-10',
    type: 'Fair',
    description: 'Meet representatives from top medical colleges across India',
    organizer: 'Medical Education Consortium',
    mode: 'Offline',
    registrationRequired: false
  },
  {
    id: 'ev4',
    title: 'National Science Olympiad',
    date: '2025-05-25',
    type: 'Competition',
    description: 'Inter-school science competition for Class 11 and 12 students',
    organizer: 'Science Education Foundation',
    mode: 'Offline',
    registrationRequired: true
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Ongoing':
    case 'Open':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Registration Open':
    case 'Closing Soon':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'Coming Soon':
    case 'Merit List Out':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'Workshop':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Seminar':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Fair':
      return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'Competition':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

// Roadmap Visualization Component
const RoadmapVisualization: React.FC<{ roadmap: RoadmapStep[]; examName: string }> = ({ roadmap, examName }) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
        🛣️ {examName} Selection Roadmap
      </h4>
      
      <div className="relative">
        {/* Background Road Pattern */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 rounded-full"></div>
        
        {/* Roadmap Steps */}
        <div className="space-y-6">
          {roadmap.map((step, index) => {
            const isLast = index === roadmap.length - 1;
            const isEven = index % 2 === 0;
            
            return (
              <div key={step.id} className={`relative flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Connecting Line */}
                {!isLast && (
                  <div className={`absolute ${isEven ? 'left-8' : 'right-8'} top-12 w-1 h-6 bg-gradient-to-b from-blue-300 to-purple-300`}></div>
                )}
                
                {/* Step Circle */}
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                  step.isCurrent 
                    ? 'bg-gradient-to-br from-orange-400 to-red-500 border-orange-300 shadow-lg scale-110' 
                    : step.isCompleted 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-300'
                    : 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-300'
                }`}>
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                
                {/* Curved Road Segment */}
                <div className={`absolute ${isEven ? 'left-4' : 'right-4'} top-8`}>
                  <svg width="60" height="30" viewBox="0 0 60 30" className="text-blue-300">
                    <path
                      d={isEven ? "M 0 15 Q 30 0 60 15" : "M 60 15 Q 30 0 0 15"}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="opacity-30"
                    />
                  </svg>
                </div>
                
                {/* Step Content */}
                <div className={`${isEven ? 'ml-6' : 'mr-6'} flex-1`}>
                  <div className={`p-4 rounded-xl shadow-md border-2 transition-all duration-300 hover:shadow-lg ${
                    step.isCurrent
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                      : step.isCompleted
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <h5 className={`font-bold text-sm mb-1 ${
                      step.isCurrent
                        ? 'text-orange-800 dark:text-orange-300'
                        : step.isCompleted
                        ? 'text-green-800 dark:text-green-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {step.title}
                    </h5>
                    <p className={`text-xs ${
                      step.isCurrent
                        ? 'text-orange-600 dark:text-orange-400'
                        : step.isCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                    
                    {step.isCurrent && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                          🎯 Current Step
                        </span>
                      </div>
                    )}
                    
                    {step.isCompleted && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                          ✅ Completed
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Goal Icon */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-sm shadow-lg">
            <span>🎓</span>
            <span>GOAL ACHIEVED!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('exams');
  const [expandedRoadmaps, setExpandedRoadmaps] = useState<Record<string, boolean>>({});

  const toggleRoadmap = (examId: string) => {
    setExpandedRoadmaps(prev => ({
      ...prev,
      [examId]: !prev[examId]
    }));
  };

  const tabButtons = [
    {
      id: 'exams' as ActiveTab,
      label: 'Current Exams',
      icon: FileText,
      color: 'from-red-500 to-pink-500',
      description: 'Ongoing and upcoming entrance exams'
    },
    {
      id: 'admissions' as ActiveTab,
      label: 'College Admissions',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      description: 'Current admission processes'
    },
    {
      id: 'events' as ActiveTab,
      label: 'Future Events',
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      description: 'Upcoming events and workshops'
    }
  ];

  const renderExamsContent = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {currentExams.map((exam) => (
          <div key={exam.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{exam.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(exam.status)}`}>
                    {exam.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exam Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{exam.date}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration Deadline</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-red-500" />
                    {exam.registrationDeadline}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Exam Mode</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{exam.examMode}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {exam.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Eligibility</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{exam.eligibility}</p>
              </div>
              
              {/* Apply Button and Visualize Roadmap Button */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={exam.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Apply Now
                  </a>
                  
                  <button
                    onClick={() => toggleRoadmap(exam.id)}
                    className={`inline-flex items-center px-6 py-3 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      expandedRoadmaps[exam.id]
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
                    }`}
                  >
                    {expandedRoadmaps[exam.id] ? (
                      <><EyeOff className="w-4 h-4 mr-2" />Hide Roadmap</>
                    ) : (
                      <><Eye className="w-4 h-4 mr-2" />Visualize Roadmap</>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Roadmap Visualization - Expandable */}
            {expandedRoadmaps[exam.id] && (
              <div className="px-6 pb-6 animate-in slide-in-from-top duration-500">
                <RoadmapVisualization roadmap={exam.roadmap} examName={exam.name} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdmissionsContent = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {collegeAdmissions.map((admission) => (
          <div key={admission.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{admission.collegeName}</h3>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mb-2">{admission.course}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(admission.status)}`}>
                  {admission.status}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(admission.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({admission.rating})</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Application Deadline</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
                  {admission.deadline}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Fees</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{admission.fees}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Seats</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{admission.seats}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
              <p className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-green-500" />
                {admission.location}
              </p>
            </div>
            
            {/* Apply Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={admission.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEventsContent = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {futureEvents.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Event Date</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">{event.description}</p>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Organizer</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-blue-500" />
                  {event.organizer}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Mode</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{event.mode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registration</p>
                <p className={`font-medium ${event.registrationRequired ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                  {event.registrationRequired ? 'Required' : 'Not Required'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Timeline Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Stay updated with current opportunities and upcoming events</p>
        </div>

        {/* Interactive Tab Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {tabButtons.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))`
                    : undefined
                }}
                className={`flex-1 p-6 rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? `border-transparent shadow-lg transform scale-105 bg-gradient-to-br ${tab.color}`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md bg-white dark:bg-gray-800'
                }`}
              >
                <div className="text-center">
                  <Icon className={`w-8 h-8 mx-auto mb-3 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                  <h3 className={`text-lg font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {tab.label}
                  </h3>
                  <p className={`text-sm ${isActive ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeTab === 'exams' && renderExamsContent()}
          {activeTab === 'admissions' && renderAdmissionsContent()}
          {activeTab === 'events' && renderEventsContent()}
        </div>
      </div>
    </div>
  );
};

export default TimelineTracker;


