import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const DOCS = [
  { key: 'photo', label: 'Passport Photo', icon: '📸', desc: 'Recent passport size photo — white background', accept: 'image/jpeg,image/png', required: true },
  { key: 'aadhar', label: 'Aadhar Card', icon: '🪪', desc: 'Both front & back — PDF or image', accept: 'image/jpeg,image/png,application/pdf', required: true },
  { key: 'address_proof', label: 'Address Proof', icon: '🏠', desc: 'Utility bill, bank statement, or Voter ID', accept: 'image/jpeg,image/png,application/pdf', required: true },
];

const DocumentUpload = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState({});
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`/applications/${appId}`)
      .then(res => { if (res.data.application.documents) setUploaded(res.data.application.documents); })
      .catch(console.error);
  }, [appId]);

  const handleFileChange = async (docKey, file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, [docKey]: 'File too large. Max 5MB.' })); return; }
    setErrors(p => ({ ...p, [docKey]: '' }));
    setUploading(p => ({ ...p, [docKey]: true }));
    const formData = new FormData();
    formData.append(docKey, file);
    try {
      const res = await axios.post(`/applications/${appId}/documents`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploaded(res.data.documents);
    } catch { setErrors(p => ({ ...p, [docKey]: 'Upload failed. Try again.' })); }
    finally { setUploading(p => ({ ...p, [docKey]: false })); }
  };

  const allUploaded = DOCS.filter(d => d.required).every(d => uploaded[d.key]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-xs text-gray-400 font-mono">Application #{appId}</p>
          <h1 className="text-xl font-bold text-gray-800 mt-1">Upload Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Upload clear scans or photos</p>
        </div>
        <div className="space-y-4 mb-6">
          {DOCS.map((doc) => (
            <div key={doc.key} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{doc.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{doc.label}</h3>
                    {doc.required && <span className="text-red-500 text-xs">*Required</span>}
                    {uploaded[doc.key] && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ Uploaded</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{doc.desc}</p>
                  {errors[doc.key] && <p className="text-xs text-red-600 mb-2">⚠️ {errors[doc.key]}</p>}
                  <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition ${uploaded[doc.key] ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-900 text-white hover:bg-blue-800'}`}>
                    {uploading[doc.key] ? '⏳ Uploading...' : uploaded[doc.key] ? '🔄 Change File' : '📤 Choose File'}
                    <input type="file" accept={doc.accept} className="hidden" disabled={uploading[doc.key]} onChange={e => handleFileChange(doc.key, e.target.files[0])} />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-600">Upload Progress</span>
            <span className="font-bold text-blue-900">{Object.keys(uploaded).length} / {DOCS.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div className="h-2 bg-blue-900 rounded-full transition-all" style={{ width: `${(Object.keys(uploaded).length / DOCS.length) * 100}%` }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate(`/apply/${appId}`)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">← Back</button>
          <button onClick={() => navigate(`/apply/${appId}/appointment`)} disabled={!allUploaded} className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition disabled:opacity-40">Book Appointment →</button>
        </div>
        {!allUploaded && <p className="text-center text-xs text-red-500 mt-2">Upload all required documents to continue</p>}
      </div>
    </div>
  );
};

export default DocumentUpload;