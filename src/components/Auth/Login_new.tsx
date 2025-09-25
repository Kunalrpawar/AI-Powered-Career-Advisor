import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ChevronLeft } from 'lucide-react';

const Login: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorDetails(null);
    setLoading(true);
    
    try {
      // Basic validation
      if (!email.trim()) {
        throw new Error('Email is required');
      }
      if (!password.trim()) {
        throw new Error('Password is required');
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one special character.'
        );
      }
      
      console.log('Attempting login with:', email);
      await login(email.trim().toLowerCase(), password);
      console.log('Login successful');
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMessage = err?.message || 'Login failed';
      let details = null;
      
      // Provide helpful error messages
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password';
        details = 'Please check your email and password and try again.';
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'Account not found';
        details = 'No account found with this email. Please register first.';
      } else if (errorMessage.includes('Database')) {
        errorMessage = 'Connection error';
        details = 'Unable to connect to our servers. Please try again later.';
      } else if (errorMessage.includes('Server error')) {
        errorMessage = 'Server temporarily unavailable';
        details = 'Our servers are experiencing issues. Please try again in a few minutes.';
      } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        errorMessage = 'Network connection error';
        details = 'Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      setErrorDetails(details);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onSwitchToRegister}
            className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
            Login
          </div>
        </div>

        <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              HG
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-center space-x-2 text-red-700">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  ⚠
                </div>
                <p className="font-medium">{error}</p>
              </div>
              {errorDetails && (
                <p className="text-sm text-red-600 mt-2">
                  {errorDetails}
                </p>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-500" 
                  placeholder="your.email@example.com" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  type="password" 
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-500" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            
            <p className="text-sm text-gray-600 text-center">
              No account?{' '}
              <button 
                type="button" 
                className="text-blue-600 hover:text-blue-700 font-medium" 
                onClick={onSwitchToRegister}
              >
                Create one
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;