import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  Star,
  Download,
  Bell,
  AlertCircle,
  Info
} from 'lucide-react';

// Types
interface Scholarship {
  id: string;
  name: string;
  provider: string;
  state: string;
  category: string;
  eligibility: string[];
  amount: string;
  description: string;
  applicationDeadline: string;
  applicationStart: string;
  documentsRequired: string[];
  benefits: string[];
  applicationUrl: string;
  status: 'Active' | 'Coming Soon' | 'Closed';
  featured: boolean;
  type: 'Merit-based' | 'Need-based' | 'Minority' | 'Sports' | 'General';
  educationLevel: string[];
  gender: 'All' | 'Female' | 'Male';
}

// Mock scholarship data for Indian states
const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'Maharashtra State Merit Scholarship',
    provider: 'Government of Maharashtra',
    state: 'Maharashtra',
    category: 'Merit-based',
    eligibility: ['12th pass with 85% marks', 'Family income < ₹8 lakh', 'Maharashtra domicile'],
    amount: '₹50,000 per year',
    description: 'Merit-based scholarship for outstanding students pursuing higher education in Maharashtra.',
    applicationDeadline: '2024-07-31',
    applicationStart: '2024-06-01',
    documentsRequired: ['Mark sheets', 'Income certificate', 'Domicile certificate', 'Bank details'],
    benefits: ['Tuition fee waiver', 'Monthly stipend', 'Book allowance'],
    applicationUrl: 'https://mahadbt.maharashtra.gov.in',
    status: 'Active',
    featured: true,
    type: 'Merit-based',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    gender: 'All'
  },
  {
    id: '2',
    name: 'Rajiv Gandhi Scholarship for Academic Excellence',
    provider: 'Government of Rajasthan',
    state: 'Rajasthan',
    category: 'Merit-based',
    eligibility: ['Top 10% in state board exams', 'Rajasthan resident', 'Enrolled in recognized institution'],
    amount: '₹5,000 - ₹25,000',
    description: 'Supporting meritorious students from Rajasthan for pursuing undergraduate and postgraduate courses.',
    applicationDeadline: '2024-08-15',
    applicationStart: '2024-07-01',
    documentsRequired: ['Academic transcripts', 'Caste certificate (if applicable)', 'Income proof', 'Admission letter'],
    benefits: ['Financial assistance', 'Academic recognition', 'Career guidance'],
    applicationUrl: 'https://sje.rajasthan.gov.in',
    status: 'Active',
    featured: false,
    type: 'Merit-based',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    gender: 'All'
  },
  {
    id: '3',
    name: 'Kanyashree Prakalpa (Girl Child Scholarship)',
    provider: 'Government of West Bengal',
    state: 'West Bengal',
    category: 'Girl Child Education',
    eligibility: ['Female students', 'West Bengal resident', 'Age 13-18 years', 'Enrolled in school/college'],
    amount: '₹750 - ₹25,000',
    description: 'Comprehensive scheme to improve the status and wellbeing of girls through education and empowerment.',
    applicationDeadline: '2024-09-30',
    applicationStart: '2024-08-01',
    documentsRequired: ['Birth certificate', 'School enrollment certificate', 'Bank account details', 'Address proof'],
    benefits: ['Annual scholarship', 'One-time grant', 'Conditional cash transfer'],
    applicationUrl: 'https://kanyashree.wb.gov.in',
    status: 'Active',
    featured: true,
    type: 'Need-based',
    educationLevel: ['Secondary', 'Higher Secondary', 'Undergraduate'],
    gender: 'Female'
  },
  {
    id: '4',
    name: 'Tamil Nadu Professional Courses Scholarship',
    provider: 'Government of Tamil Nadu',
    state: 'Tamil Nadu',
    category: 'Professional Education',
    eligibility: ['Tamil Nadu domicile', 'Admitted to professional courses', 'Family income < ₹2.5 lakh'],
    amount: 'Full tuition fee',
    description: 'Complete fee reimbursement for students pursuing professional courses like Engineering, Medicine, etc.',
    applicationDeadline: '2024-10-15',
    applicationStart: '2024-09-01',
    documentsRequired: ['Admission receipt', 'Fee structure', 'Income certificate', 'Community certificate'],
    benefits: ['Full fee reimbursement', 'No bond requirement', 'Timely payment'],
    applicationUrl: 'https://tnscholarship.gov.in',
    status: 'Coming Soon',
    featured: false,
    type: 'Need-based',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    gender: 'All'
  },
  {
    id: '5',
    name: 'Karnataka Minority Scholarship',
    provider: 'Government of Karnataka',
    state: 'Karnataka',
    category: 'Minority Community',
    eligibility: ['Minority community student', 'Karnataka resident', 'Family income < ₹2 lakh'],
    amount: '₹1,200 - ₹10,000',
    description: 'Financial assistance for students from minority communities to pursue higher education.',
    applicationDeadline: '2024-06-30',
    applicationStart: '2024-05-01',
    documentsRequired: ['Minority certificate', 'Income certificate', 'Academic certificates', 'Bank details'],
    benefits: ['Maintenance allowance', 'Reader allowance', 'Book grant'],
    applicationUrl: 'https://scholarships.gov.in',
    status: 'Closed',
    featured: false,
    type: 'Minority',
    educationLevel: ['Undergraduate', 'Postgraduate', 'Diploma'],
    gender: 'All'
  },
  {
    id: '6',
    name: 'Dr. A.P.J. Abdul Kalam Scholarship',
    provider: 'Government of Odisha',
    state: 'Odisha',
    category: 'Technical Education',
    eligibility: ['Engineering/Medical students', 'Odisha domicile', 'Merit-based selection'],
    amount: '₹15,000 - ₹40,000',
    description: 'Encouraging excellence in technical and medical education among students of Odisha.',
    applicationDeadline: '2024-08-31',
    applicationStart: '2024-07-15',
    documentsRequired: ['JEE/NEET scorecard', 'Admission letter', 'Domicile certificate', 'Academic records'],
    benefits: ['Annual scholarship', 'Laptop/tablet', 'Internship opportunities'],
    applicationUrl: 'https://odishascholarship.gov.in',
    status: 'Active',
    featured: true,
    type: 'Merit-based',
    educationLevel: ['Undergraduate'],
    gender: 'All'
  }
];

const Scholarships: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [scholarships] = useState<Scholarship[]>(mockScholarships);

  // Get unique values for filters
  const states = ['All', ...Array.from(new Set(scholarships.map(s => s.state)))];
  const categories = ['All', ...Array.from(new Set(scholarships.map(s => s.category)))];
  const statuses = ['All', 'Active', 'Coming Soon', 'Closed'];

  // Filter scholarships
  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = searchQuery === '' || 
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = selectedState === 'All' || scholarship.state === selectedState;
    const matchesCategory = selectedCategory === 'All' || scholarship.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || scholarship.status === selectedStatus;
    
    return matchesSearch && matchesState && matchesCategory && matchesStatus;
  });

  // Get active scholarships count
  const activeScholarshipsCount = scholarships.filter(s => s.status === 'Active').length;
  const closingDeadlines = scholarships
    .filter(s => s.status === 'Active')
    .sort((a, b) => new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Scholarship Directory</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover state government scholarships and financial aid opportunities
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Scholarships</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{activeScholarshipsCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">States Covered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{states.length - 1}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{categories.length - 1}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Deadlines Alert */}
        {closingDeadlines.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 dark:text-orange-200 mb-2">Upcoming Deadlines</h3>
                <div className="space-y-1">
                  {closingDeadlines.map(scholarship => (
                    <p key={scholarship.id} className="text-sm text-orange-800 dark:text-orange-300">
                      <strong>{scholarship.name}</strong> - Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scholarships..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* State Filter */}
            <div>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category === 'All' ? 'All Categories' : category}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="space-y-6">
          {/* Featured Scholarships */}
          {filteredScholarships.some(s => s.featured) && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Featured Scholarships
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredScholarships.filter(s => s.featured).map(scholarship => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} featured />
                ))}
              </div>
            </div>
          )}

          {/* All Scholarships */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              All Scholarships ({filteredScholarships.length})
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No scholarships found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Scholarship Card Component
const ScholarshipCard: React.FC<{ scholarship: Scholarship; featured?: boolean }> = ({ scholarship, featured = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'Coming Soon':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400';
      case 'Closed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400';
    }
  };

  const isDeadlineNear = () => {
    if (scholarship.status !== 'Active') return false;
    const deadline = new Date(scholarship.applicationDeadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft > 0;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow ${
      featured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {featured && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded-full font-medium">
                <Star className="w-3 h-3" />
                Featured
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(scholarship.status)}`}>
              {scholarship.status}
            </span>
            {isDeadlineNear() && (
              <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                <Clock className="w-3 h-3" />
                Deadline Soon
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {scholarship.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {scholarship.provider}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {scholarship.description}
      </p>

      {/* Key Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Amount:</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">{scholarship.amount}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">State:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{scholarship.state}</span>
        </div>

        {scholarship.status === 'Active' && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Deadline:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {new Date(scholarship.applicationDeadline).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Eligibility Criteria (First 2) */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Key Eligibility:</p>
        <div className="space-y-1">
          {scholarship.eligibility.slice(0, 2).map((criteria, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{criteria}</span>
            </div>
          ))}
          {scholarship.eligibility.length > 2 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              +{scholarship.eligibility.length - 2} more criteria
            </p>
          )}
        </div>
      </div>

      {/* Education Level Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {scholarship.educationLevel.slice(0, 2).map(level => (
          <span key={level} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
            {level}
          </span>
        ))}
        {scholarship.educationLevel.length > 2 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
            +{scholarship.educationLevel.length - 2} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => window.open(scholarship.applicationUrl, '_blank')}
          disabled={scholarship.status === 'Closed'}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            scholarship.status === 'Closed'
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          {scholarship.status === 'Closed' ? 'Application Closed' : 'Apply Now'}
        </button>
        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default Scholarships;