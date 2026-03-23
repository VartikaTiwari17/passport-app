import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProgressBar from '../components/ProgressBar';

const STEPS = ['Personal Info', 'Address', 'Family Details', 'Emergency Contact'];

const STEP_CONFIG = {
  1: {
    title: 'Personal Information', subtitle: 'Basic details as per your official documents',
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'As per Aadhar', required: true },
      { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'As per Aadhar', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'date', required: true },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { key: 'placeOfBirth', label: 'Place of Birth', type: 'text', placeholder: 'City, State', required: true },
      { key: 'phone', label: 'Mobile Number', type: 'tel', placeholder: '10-digit number', required: true },
      { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', required: true },
      { key: 'aadhar', label: 'Aadhar Number', type: 'text', placeholder: 'XXXX XXXX XXXX', required: true },
    ]
  },
  2: {
    title: 'Address Details', subtitle: 'Your current residential address',
    fields: [
      { key: 'houseNo', label: 'House / Flat No.', type: 'text', placeholder: 'e.g. 42, Block A', required: true },
      { key: 'street', label: 'Street / Colony', type: 'text', placeholder: 'Street name', required: true },
      { key: 'city', label: 'City', type: 'text', placeholder: 'City name', required: true },
      { key: 'state', label: 'State', type: 'text', placeholder: 'State name', required: true },
      { key: 'pincode', label: 'PIN Code', type: 'text', placeholder: '6-digit PIN', required: true },
      { key: 'country', label: 'Country', type: 'text', placeholder: 'India', required: false },
    ]
  },
  3: {
    title: 'Family Details', subtitle: 'Parent and spouse information',
    fields: [
      { key: 'fatherName', label: "Father's Full Name", type: 'text', placeholder: 'Full name', required: true },
      { key: 'fatherNationality', label: "Father's Nationality", type: 'text', placeholder: 'Indian', required: false },
      { key: 'motherName', label: "Mother's Full Name", type: 'text', placeholder: 'Full name', required: true },
      { key: 'motherNationality', label: "Mother's Nationality", type: 'text', placeholder: 'Indian', required: false },
      { key: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
      { key: 'spouseName', label: "Spouse's Name (if married)", type: 'text', placeholder: 'Leave blank if N/A', required: false },
    ]
  },
  4: {
    title: 'Emergency Contact', subtitle: 'Person to contact in case of emergency',
    fields: [
      { key: 'emergencyName', label: 'Contact Person Name', type: 'text', placeholder: 'Full name', required: true },
      { key: 'emergencyRelation', label: 'Relationship', type: 'select', options: ['Parent', 'Spouse', 'Sibling', 'Friend', 'Other'], required: true },
      { key: 'emergencyPhone', label: 'Phone Number', type: 'tel', placeholder: '10-digit number', required: true },
      { key: 'emergencyEmail', label: 'Email Address', type: 'email', placeholder: 'contact@email.com', required: false },
      { key: 'emergencyAddress', label: 'Address', type: 'textarea', placeholder: 'Full address', required: false },
    ]
  }
};

const ApplicationForm = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ 1: {}, 2: {}, 3: {}, 4: {} });
  const [saveStatus, setSaveStatus] = useState('idle');
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    const loadApp = async () => {
      try {
        const res = await axios.get(`/applications/${appId}`);
        const app = res.data.application;
        setCurrentStep(app.current_step || 1);
        setFormData({ 1: app.personal_info || {}, 2: app.address_info || {}, 3: app.family_info || {}, 4: app.emergency_contact || {} });
      } catch { navigate('/dashboard'); }
      finally { setLoading(false); }
    };
    loadApp();
  }, [appId]);

  const triggerSave = (step, data) => {
    setSaveStatus('saving');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await axios.put(`/applications/${appId}`, { step, data });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch { setSaveStatus('error'); }
    }, 1500);
  };

  const handleChange = (key, value) => {
    const updated = { ...formData[currentStep], [key]: value };
    setFormData({ ...formData, [currentStep]: updated });
    triggerSave(currentStep, updated);
  };

  const handleNext = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    try {
      await axios.put(`/applications/${appId}`, { step: currentStep, data: formData[currentStep] });
      setSaveStatus('saved');
    } catch { setSaveStatus('error'); }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else navigate(`/apply/${appId}/documents`);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate('/dashboard');
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center"><div className="text-4xl animate-spin mb-3">⏳</div><p className="text-gray-500">Loading...</p></div>
    </div>
  );

  const step = STEP_CONFIG[currentStep];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <p className="text-xs text-gray-400 font-mono">Application #{appId}</p>
          <h1 className="text-xl font-bold text-gray-800 mt-1">{step.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{step.subtitle}</p>
        </div>
        <ProgressBar currentStep={currentStep} totalSteps={4} steps={STEPS} />
        <div className="flex justify-end items-center gap-1 mb-4 min-h-5">
          {saveStatus === 'saving' && <span className="text-xs text-yellow-600">⏳ Saving...</span>}
          {saveStatus === 'saved' && <span className="text-xs text-green-600">✅ Saved at {new Date().toLocaleTimeString()}</span>}
          {saveStatus === 'error' && <span className="text-xs text-red-500">⚠️ Save failed</span>}
          {saveStatus === 'idle' && <span className="text-xs text-gray-400">💾 Auto-save enabled</span>}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="space-y-5">
            {step.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select value={formData[currentStep][field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">-- Select --</option>
                    {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea value={formData[currentStep][field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                ) : (
                  <input type={field.type} value={formData[currentStep][field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleBack} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">← Back</button>
          <button onClick={handleNext} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition">
            {currentStep < 4 ? 'Save & Continue →' : 'Proceed to Documents →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;