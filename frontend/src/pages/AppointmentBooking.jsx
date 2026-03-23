import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const LOCATIONS = [
  { name: 'Passport Seva Kendra — New Delhi', address: 'Bhikaji Cama Place, New Delhi', slots: true },
  { name: 'Passport Seva Kendra — Mumbai', address: 'Nariman Point, Mumbai', slots: true },
  { name: 'Passport Seva Kendra — Bangalore', address: 'Ulsoor Road, Bangalore', slots: true },
  { name: 'Passport Seva Kendra — Chennai', address: 'Anna Salai, Chennai', slots: true },
  { name: 'Passport Seva Kendra — Hyderabad', address: 'Begumpet, Hyderabad', slots: true },
  { name: 'Passport Seva Kendra — Kolkata', address: 'Salt Lake, Kolkata', slots: false },
];

const TIME_SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'];

function getAvailableDates() {
  const dates = [];
  const start = new Date();
  start.setDate(start.getDate() + 1);
  for (let i = 0; dates.length < 16; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d.getDay() !== 0) dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const AppointmentBooking = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const dates = getAvailableDates();

  const formatDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  const handleBook = async () => {
    if (!selectedLocation || !selectedDate || !selectedTime) { setError('Please select all options.'); return; }
    setBooking(true); setError('');
    try {
      await axios.post(`/applications/${appId}/submit`);
      await axios.post('/appointments', { application_id: appId, appointment_date: selectedDate, appointment_time: selectedTime, location: selectedLocation });
      navigate(`/apply/${appId}/confirmation`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-xs text-gray-400 font-mono">Application #{appId}</p>
          <h1 className="text-xl font-bold text-gray-800 mt-1">Book Appointment</h1>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">⚠️ {error}</div>}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">📍 Select Location</h3>
          <div className="space-y-2">
            {LOCATIONS.map((loc) => (
              <label key={loc.name} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${!loc.slots ? 'opacity-40 cursor-not-allowed' : selectedLocation === loc.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                <input type="radio" name="location" value={loc.name} disabled={!loc.slots} checked={selectedLocation === loc.name} onChange={() => setSelectedLocation(loc.name)} className="mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{loc.name}</p>
                  <p className="text-xs text-gray-400">{loc.address}</p>
                </div>
                {!loc.slots && <span className="text-xs text-red-400">No slots</span>}
              </label>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">📅 Select Date</h3>
          <div className="grid grid-cols-4 gap-2">
            {dates.map((date) => (
              <button key={date} onClick={() => setSelectedDate(date)} className={`p-2 rounded-lg text-xs text-center border transition ${selectedDate === date ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-200 hover:border-blue-400 text-gray-700'}`}>
                {formatDate(date)}
              </button>
            ))}
          </div>
        </div>
        {selectedDate && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">🕐 Select Time Slot</h3>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => (
                <button key={time} onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg text-xs border transition ${selectedTime === time ? 'bg-blue-900 text-white border-blue-900' : 'border-gray-200 hover:border-blue-400 text-gray-700'}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
        {selectedLocation && selectedDate && selectedTime && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-green-800 mb-2">✅ Booking Summary</p>
            <p className="text-xs text-green-700">📍 {selectedLocation}</p>
            <p className="text-xs text-green-700">📅 {formatDate(selectedDate)}</p>
            <p className="text-xs text-green-700">🕐 {selectedTime}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={() => navigate(`/apply/${appId}/documents`)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">← Back</button>
          <button onClick={handleBook} disabled={booking || !selectedLocation || !selectedDate || !selectedTime} className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-40">
            {booking ? '⏳ Booking...' : '✅ Confirm Appointment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;