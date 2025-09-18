import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { 
  id: string; 
  name: string; 
  email: string;
  age?: number;
  gender?: string;
  classStd?: string;
  academicInterests?: string[];
  badges?: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
    category: string;
  }>;
  completedTasks?: Array<{
    taskId: string;
    taskName: string;
    completedAt: string;
  }>;
  metadata?: {
    avatar?: string;
    dreams?: string;
  };
  profileStats?: {
    totalAptitudeTests?: number;
    totalChatSessions?: number;
    totalCollegeViews?: number;
    totalResourcesViewed?: number;
    totalScholarshipsApplied?: number;
    totalMentorSessions?: number;
    totalCareerMappings?: number;
    profileCompleteness?: number;
    lastActiveAt?: string;
    joinedAt?: string;
  };
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    privacy?: {
      profileVisibility?: string;
      shareProgress?: boolean;
    };
    dashboard?: {
      preferredView?: string;
      showRecommendations?: boolean;
    };
  };
  recentActivity?: {
    lastAptitudeTest?: string;
    lastChatSession?: string;
    lastCollegeView?: string;
    lastResourceAccess?: string;
    lastMentorSession?: string;
    lastCareerMapping?: string;
  };
} | null;

interface AuthContextValue {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, additionalData?: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } catch (_) {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const t = await res.text();
        let errorMessage = 'Login failed';
        
        try {
          const j = JSON.parse(t);
          errorMessage = j.error || 'Login failed';
        } catch (parseError) {
          // If we can't parse JSON, try to extract meaningful info from text
          if (t.includes('Invalid credentials')) {
            errorMessage = 'Invalid credentials';
          } else if (t.includes('User not found')) {
            errorMessage = 'User not found';
          } else if (t.includes('Database not connected')) {
            errorMessage = 'Database connection error';
          } else if (res.status === 500) {
            errorMessage = 'Server error';
          } else if (res.status === 401) {
            errorMessage = 'Invalid credentials';
          } else {
            errorMessage = `Login failed (${res.status})`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      console.error('Login request error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error; // Re-throw the error so it can be handled by the component
    }
  };

  const register = async (name: string, email: string, password: string, additionalData?: any) => {
    console.log('Making registration request with:', { name, email, ...additionalData });
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...additionalData }),
      });
      console.log('Registration response status:', res.status);
      
      if (!res.ok) {
        const t = await res.text();
        console.error('Registration failed with response:', t);
        let errorMessage = 'Registration failed';
        
        try {
          const j = JSON.parse(t);
          errorMessage = j.error || 'Registration failed';
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          // If we can't parse JSON, try to extract meaningful info from text
          if (t.includes('Database not connected')) {
            errorMessage = 'Database connection error. Please try again later.';
          } else if (t.includes('Email already registered')) {
            errorMessage = 'This email is already registered. Please try logging in instead.';
          } else if (t.includes('validation')) {
            errorMessage = 'Please check all required fields are filled correctly.';
          } else if (res.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (res.status === 400) {
            errorMessage = 'Please fill in all required fields correctly.';
          } else {
            errorMessage = `Registration failed (${res.status}). Please try again.`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const responseData = await res.json();
      console.log('Registration successful:', responseData);
      return responseData;
    } catch (error) {
      console.error('Registration request error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error; // Re-throw the error so it can be handled by the component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout, loading }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


