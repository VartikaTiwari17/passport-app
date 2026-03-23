import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Confirmation = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get(`/applications/${appId}`), axios.get('/appointments')])
      .then(([appRes, aptRes]) => {
        setApp(appRes.data.application);
        const apt = aptRes.data.appointments.find(a => a.application_id === appId);
        setAppointment(apt);
      }).catch(console.error).finally(() => setLoading(false));
  }, [appId]);

  const handleDownload = () => {
    const content = [
      '================================================',
      '          PASSPORT APPLICATION RECEIPT',
      '================================================',
      `Application ID : ${appId}`,
      `Status         : Submitted`,
      `Submitted On   : ${new Date().toLocaleString('en-IN')}`,
      '',
      '--- APPLICANT DETAILS ---',
      `Name   : ${app?.personal_info?.firstName || ''} ${app?.personal_info?.lastName || ''}`,
      `Mobile : ${app?.personal_info?.phone || ''}`,
      `Email  : ${app?.personal_info?.email || ''}`,
      '',
      ...(appointment ? ['--- APPOINTMENT ---', `Location : ${appointment.location}`, `Date     : ${appointment.appointment_date}`, `Time     : ${appointment.appointment_time}`, ''] : []),
      '================================================',
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `passport_receipt_${appId}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl animate-spin mb-3">⏳</div><p className="text-gray-500">Loading...</p></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Application Submitted!</h1>
          <p className="text-gray-500 text-sm mt-2">Your passport application has been successfully submitted.</p>
        </div>
        <div className="bg-blue-900 text-white rounded-2xl p-6 mb-4 text-center">
          <p className="text-blue-300 text-xs mb-1 uppercase tracking-widest">Application ID</p>
          <p className="text-3xl font-mono font-bold tracking-widest">{appId}</p>
          <button onClick={() => navigator.clipboard.writeText(appId).then(() => alert('Copied!'))} className="mt-2 text-blue-300 hover:text-white text-xs underline">📋 Copy ID</button>
        </div>
        {appointment && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">📅 Your Appointment</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-gray-800 font-medium text-right">{appointment.location}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="text-gray-800">{appointment.appointment_date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="text-gray-800">{appointment.appointment_time}</span></div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <button onClick={handleDownload} className="w-full bg-blue-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-blue-800 transition">📥 Download Receipt</button>
          <button onClick={() => navigate('/dashboard')} className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition">← Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;