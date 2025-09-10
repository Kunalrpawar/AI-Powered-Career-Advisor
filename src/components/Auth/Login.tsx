import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm rounded-xl shadow p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">{loading ? 'Logging in...' : 'Login'}</button>
        <p className="text-sm text-gray-600">No account? <button type="button" className="text-blue-600" onClick={onSwitchToRegister}>Register</button></p>
      </form>
    </div>
  );
};

export default Login;


