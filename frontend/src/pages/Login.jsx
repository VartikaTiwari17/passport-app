import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      if (data.user.onboarding_completed) navigate('/dashboard');
      else navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'hire-me@anshumat.org', password: 'HireMe@2025!' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🛂</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Login to continue your passport application</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-blue-700 font-semibold mb-1">🔑 Demo Login</p>
            <p className="text-xs text-blue-600">Email: hire-me@anshumat.org</p>
            <p className="text-xs text-blue-600">Password: HireMe@2025!</p>
            <button onClick={fillDemo} className="text-xs text-blue-800 underline mt-2 font-medium">Auto-fill →</button>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Don't have an account? <Link to="/signup" className="text-blue-700 font-medium hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;