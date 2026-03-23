import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: user?.name || '', dob: '', city: '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/onboarding', form);
      updateUser(res.data.user);
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-8">
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-blue-900' : s < step ? 'w-4 bg-blue-400' : 'w-4 bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Welcome to PassportSeva! 👋</h1>
              <p className="text-gray-500 text-sm mt-2">Let's set up your profile first</p>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="As per Aadhar Card" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-800 transition">Continue →</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Basic Information</h1>
              <p className="text-gray-500 text-sm mt-2">We need this for your application</p>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Your current city" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-blue-900 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-800 transition">Continue →</button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">You're all set! 🎉</h1>
              <p className="text-gray-500 text-sm mt-2">Here's what to expect</p>
            </div>
            <div className="space-y-3 mb-8">
              {[
                { icon: '⏱️', title: '15–20 minutes', desc: 'Time to complete the application' },
                { icon: '📄', title: 'Documents needed', desc: 'Aadhar, Photo, Address proof' },
                { icon: '📅', title: 'Appointment', desc: 'Book at any Passport Seva Kendra' },
                { icon: '✅', title: 'Track status', desc: 'Real-time updates on your dashboard' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleComplete} disabled={loading} className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-green-700 transition disabled:opacity-50">
              {loading ? 'Setting up...' : '🚀 Start My Application'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Onboarding;