import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user ? '/dashboard' : '/')}>
        <span className="text-2xl">🛂</span>
        <span className="font-bold text-lg tracking-wide">PassportSeva</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-blue-200 text-sm hidden md:block">{user.name || 'User'}</span>
            <button onClick={() => navigate('/dashboard')} className="text-white hover:text-blue-200 transition text-sm">Dashboard</button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="text-white hover:text-blue-200 transition text-sm">Login</button>
            <button onClick={() => navigate('/signup')} className="bg-white text-blue-900 px-4 py-1.5 rounded-lg font-medium text-sm hover:bg-blue-50 transition">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;