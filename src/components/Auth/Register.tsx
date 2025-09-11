import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Register: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      // After successful registration, switch to login screen
      onSwitchToLogin();
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white/80 backdrop-blur w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 space-y-5">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">HG</div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600">Join Hackgen Career OS to get started</p>
        </div>
        {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition" placeholder="Your name" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg px-3 py-2 outline-none transition" placeholder="••••••••" required />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60">{loading ? 'Creating account...' : 'Create account'}</button>
        <p className="text-sm text-gray-600 text-center">Have an account? <button type="button" className="text-blue-600 hover:text-blue-700 font-medium" onClick={onSwitchToLogin}>Sign in</button></p>
      </form>
    </div>
  );
};

export default Register;


