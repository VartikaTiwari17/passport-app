import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

const statusConfig = {
  draft: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: '✏️' },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: '📤' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: '✅' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, aptRes] = await Promise.all([axios.get('/applications'), axios.get('/appointments')]);
        setApplications(appRes.data.applications);
        setAppointments(aptRes.data.appointments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const createNewApplication = async () => {
    setCreating(true);
    try {
      const res = await axios.post('/applications/new');
      navigate(`/apply/${res.data.application.application_id}`);
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center"><div className="text-4xl mb-4 animate-spin">⏳</div><p className="text-gray-500">Loading...</p></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Good day, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your passport applications</p>
          </div>
          <button onClick={createNewApplication} disabled={creating} className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50">
            {creating ? '⏳ Creating...' : '+ New Application'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: applications.length, icon: '📋', color: 'bg-purple-50' },
            { label: 'In Progress', value: applications.filter(a => a.status === 'draft').length, icon: '✏️', color: 'bg-yellow-50' },
            { label: 'Submitted', value: applications.filter(a => a.status === 'submitted').length, icon: '✅', color: 'bg-green-50' },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-xl border border-gray-100 p-4 text-center`}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">My Applications</h2>
            <span className="text-xs text-gray-400">{applications.length} total</span>
          </div>
          {applications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-medium text-gray-700 mb-2">No applications yet</p>
              <button onClick={createNewApplication} className="bg-blue-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition">Start First Application</button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {applications.map((app) => {
                const status = statusConfig[app.status] || statusConfig.draft;
                return (
                  <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{status.icon}</div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm font-mono">#{app.application_id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Saved: {new Date(app.last_saved).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {app.status === 'draft' && <p className="text-xs text-blue-600 mt-0.5">Step {app.current_step} of 4</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                      {app.status === 'draft' && (
                        <button onClick={() => navigate(`/apply/${app.application_id}`)} className="bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-800 transition">Continue →</button>
                      )}
                      {app.status === 'submitted' && (
                        <button onClick={() => navigate(`/apply/${app.application_id}/confirmation`)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition">View →</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {appointments.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100"><h2 className="font-bold text-gray-800">Upcoming Appointments</h2></div>
            <div className="divide-y divide-gray-50">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-5 flex items-start gap-4">
                  <span className="text-2xl">📅</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 text-sm">{apt.location}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(apt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })} at {apt.appointment_time}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">{apt.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;