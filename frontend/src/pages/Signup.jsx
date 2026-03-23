import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'As per Aadhar Card' },
    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '10-digit mobile' },
    { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
    { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: 'Re-enter password' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">📋</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Create Account</h1>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input type={field.type} required value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-800 transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-blue-700 font-medium hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;