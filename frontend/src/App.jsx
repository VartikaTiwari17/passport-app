import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import DocumentUpload from './pages/DocumentUpload';
import AppointmentBooking from './pages/AppointmentBooking';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/apply/:appId" element={<PrivateRoute><ApplicationForm /></PrivateRoute>} />
          <Route path="/apply/:appId/documents" element={<PrivateRoute><DocumentUpload /></PrivateRoute>} />
          <Route path="/apply/:appId/appointment" element={<PrivateRoute><AppointmentBooking /></PrivateRoute>} />
          <Route path="/apply/:appId/confirmation" element={<PrivateRoute><Confirmation /></PrivateRoute>} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;