import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, User, Mail, Lock, Heart, Eye, EyeOff } from 'lucide-react';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  gender: string;
  dreams: string;
  avatar: string;
  grade: string;
  interests: string[];
}

const Register: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    gender: '',
    dreams: '',
    avatar: '',
    grade: '',
    interests: []
  });
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const totalSteps = 7;

  const genderOptions = [
    { id: 'girl', label: 'Girl', emoji: '👧', bgColor: 'bg-pink-100', borderColor: 'border-pink-300' },
    { id: 'boy', label: 'Boy', emoji: '👦', bgColor: 'bg-blue-100', borderColor: 'border-blue-300' }
  ];

  const avatarOptions = [
    { id: 'avatar1', emoji: '👨‍💻', bgColor: 'bg-pink-100' },
    { id: 'avatar2', emoji: '👩‍🎓', bgColor: 'bg-orange-100' },
    { id: 'avatar3', emoji: '👨‍🎨', bgColor: 'bg-purple-100' },
    { id: 'avatar4', emoji: '👩‍🔬', bgColor: 'bg-blue-100' },
    { id: 'avatar5', emoji: '👨‍⚕️', bgColor: 'bg-gray-100' },
    { id: 'avatar6', emoji: '👩‍💼', bgColor: 'bg-pink-100' },
    { id: 'avatar7', emoji: '👨‍🏫', bgColor: 'bg-yellow-100' },
    { id: 'avatar8', emoji: '👩‍🎤', bgColor: 'bg-green-100' },
    { id: 'avatar9', emoji: '👨‍🚀', bgColor: 'bg-indigo-100' }
  ];

  const gradeOptions = [
    'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
    'Undergraduate', 'Postgraduate'
  ];

  const interestOptions = [
    'Drawing', 'Sports', 'Music', 'Reading books',
    'Photography', 'Singing', 'Dancing', 'Cooking',
    'Coding', 'Watching cartoons/anime'
  ];

  const updateRegistrationData = (field: keyof RegistrationData, value: any) => {
    setRegistrationData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setRegistrationData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return registrationData.name.trim() !== '';
      case 2: {
        return registrationData.email.trim() !== '' && 
               registrationData.password.trim() !== '';
      }
      case 3: return registrationData.gender !== '';
      case 4: return registrationData.dreams.trim() !== '';
      case 5: return registrationData.avatar !== '';
      case 6: return registrationData.grade !== '';
      case 7: return registrationData.interests.length > 0;
      default: return false;
    }
  };

  const onSubmit = async () => {
    setError(null);
    setErrorDetails(null);
    setLoading(true);
    
    try {
      // Validate required fields
      if (!registrationData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!registrationData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!registrationData.password.trim()) {
        throw new Error('Password is required');
      }
      if (!registrationData.gender) {
        throw new Error('Please select your gender');
      }
      if (!registrationData.dreams.trim()) {
        throw new Error('Please share your dreams/goals');
      }
      if (!registrationData.avatar) {
        throw new Error('Please select an avatar');
      }
      if (!registrationData.grade) {
        throw new Error('Please select your grade/education level');
      }
      if (registrationData.interests.length === 0) {
        throw new Error('Please select at least one interest');
      }
      
      // Map the new form data to the expected backend format
      const genderMapping: { [key: string]: string } = {
        'girl': 'female',
        'boy': 'male'
      };
      
      const registrationPayload = {
        gender: genderMapping[registrationData.gender] || registrationData.gender,
        classStd: registrationData.grade.includes('Grade') 
          ? registrationData.grade.replace('Grade ', '') 
          : registrationData.grade,
        academicInterests: registrationData.interests,
        avatar: registrationData.avatar,
        dreams: registrationData.dreams
      };
      
      console.log('Registration data being sent:', {
        name: registrationData.name.trim(),
        email: registrationData.email.trim().toLowerCase(),
        ...registrationPayload
      });
      
      await register(
        registrationData.name.trim(),
        registrationData.email.trim().toLowerCase(),
        registrationData.password,
        registrationPayload
      );
      
      // Show success message before switching to login
      setError('Registration successful! Please log in with your credentials.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Set main error message
      const errorMessage = err?.message || 'Registration failed';
      setError(errorMessage);
      
      // Set additional details if available
      if (err?.stack && process.env.NODE_ENV === 'development') {
        setErrorDetails(err.stack);
      }
      
      // Provide helpful suggestions based on error type
      if (errorMessage.includes('Email already registered')) {
        setErrorDetails('Try logging in instead, or use a different email address.');
      } else if (errorMessage.includes('Database')) {
        setErrorDetails('Our servers are experiencing issues. Please try again in a few minutes.');
      } else if (errorMessage.includes('validation')) {
        setErrorDetails('Please check that all fields are filled out correctly.');
      } else if (errorMessage.includes('Server error')) {
        setErrorDetails('Something went wrong on our end. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">What's your name?</h2>
              <p className="text-gray-600">Let's start with the basics</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => updateRegistrationData('name', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-yellow-500 focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-500"
                  placeholder="Enter your full name"
                  autoFocus
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Account Details</h2>
              <p className="text-gray-600">Create your secure account</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => updateRegistrationData('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-yellow-500 focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-500"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registrationData.password}
                    onChange={(e) => updateRegistrationData('password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-yellow-500 focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="space-y-1">
                  {/* Password requirements removed */}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">How should we know you?</h2>
              <p className="text-gray-600">Pick the gender you're most comfortable with</p>
              <p className="text-sm text-gray-500">we'll use it for your profile only</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateRegistrationData('gender', option.id)}
                  className={`p-6 rounded-3xl border-2 transition-all duration-200 hover:scale-105 ${
                    registrationData.gender === option.id
                      ? `${option.bgColor} ${option.borderColor} border-4 shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-5xl mb-3">{option.emoji}</div>
                  <div className="font-semibold text-lg text-gray-900">{option.label}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">What's your big dream?</h2>
              <p className="text-gray-600">Do you want to be a scientist, doctor, artist, or something else? We'll help you get closer!</p>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={registrationData.dreams}
                onChange={(e) => updateRegistrationData('dreams', e.target.value)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-yellow-500 focus:outline-none transition-colors text-center text-gray-900 bg-white placeholder-gray-500"
                placeholder="become an Doctor"
                autoFocus
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Pick Your Avatar</h2>
              <p className="text-gray-600">Choose a fun character and make your dashboard feel truly yours.</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => updateRegistrationData('avatar', avatar.id)}
                  className={`p-6 rounded-3xl border-2 transition-all duration-200 hover:scale-105 ${
                    registrationData.avatar === avatar.id
                      ? `${avatar.bgColor} border-yellow-400 border-4 shadow-lg`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-4xl">{avatar.emoji}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Choose your grade</h2>
              <p className="text-gray-600">Select your class to personalize your lessons</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {gradeOptions.map((grade) => (
                <button
                  key={grade}
                  onClick={() => updateRegistrationData('grade', grade)}
                  className={`p-4 rounded-2xl border-2 font-semibold text-lg transition-all duration-200 hover:scale-105 ${
                    registrationData.grade === grade
                      ? 'bg-yellow-100 border-yellow-400 text-gray-900 border-4 shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">What do you love doing?</h2>
              <p className="text-gray-600">We'll use your hobbies to make learning more fun and exciting.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-4 rounded-2xl border-2 font-medium transition-all duration-200 hover:scale-105 ${
                    registrationData.interests.includes(interest)
                      ? 'bg-purple-100 border-purple-400 text-purple-800 border-4 shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={currentStep === 1 ? onSwitchToLogin : prevStep}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
            {currentStep}/{totalSteps}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className={`mb-6 p-4 rounded-2xl border-2 ${
              error.includes('successful') 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className={`flex items-center space-x-2 ${
                error.includes('successful') 
                  ? 'text-green-700' 
                  : 'text-red-600'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  error.includes('successful') 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {error.includes('successful') ? '✓' : '⚠'}
                </div>
                <p className="font-medium">{error}</p>
              </div>
              {errorDetails && (
                <p className={`text-sm mt-2 ${
                  error.includes('successful') 
                    ? 'text-green-600' 
                    : 'text-red-500'
                }`}>
                  {errorDetails}
                </p>
              )}
            </div>
          )}

          {renderStep()}

          {/* Navigation */}
          <div className="mt-8 space-y-4">
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!canProceed() || loading}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            )}
            
            {currentStep === 1 && (
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  onClick={onSwitchToLogin}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i + 1 <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;


