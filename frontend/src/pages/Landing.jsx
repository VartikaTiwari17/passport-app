import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛂</span>
          <span className="font-bold text-lg">PassportSeva</span>
        </div>
        <div className="flex gap-3">
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium text-sm">My Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="border border-white text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">Login</button>
              <button onClick={() => navigate('/signup')} className="bg-white text-blue-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition">Get Started</button>
            </>
          )}
        </div>
      </nav>

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="bg-blue-700 text-blue-200 text-xs px-3 py-1 rounded-full font-medium mb-6 inline-block">🇮🇳 Government of India — Passport Services</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Apply for your Passport<br />from the comfort of home</h1>
          <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">Simple, guided, step-by-step passport application. No confusion. No long queues.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(user ? '/dashboard' : '/signup')} className="bg-white text-blue-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition">Start Application →</button>
            <button onClick={() => navigate('/login')} className="border border-blue-300 text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-blue-800 transition">Track Status</button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Why PassportSeva?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '📋', title: 'Step-by-step Forms', desc: 'Guided form filling with clear instructions.' },
            { icon: '💾', title: 'Auto-save Progress', desc: 'Your work is saved every second.' },
            { icon: '📅', title: 'Easy Appointment', desc: 'Book your PSK appointment in under 2 minutes.' },
          ].map((f, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-blue-900 text-blue-200 text-center py-8 text-sm">
        <p className="font-medium text-white mb-1">PassportSeva</p>
        <p>Anshumat Foundation (Section 8 Non-Profit Company) | © 2025</p>
      </footer>
    </div>
  );
};

export default Landing;