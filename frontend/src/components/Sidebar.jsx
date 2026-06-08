import { useNavigate } from 'react-router-dom';
import { useResume } from '../ResumeContext';
import './Sidebar.css';

const NAV = [
  { id: 'personal',       icon: '👤', label: 'Personal Info' },
  { id: 'experience',     icon: '💼', label: 'Experience' },
  { id: 'education',      icon: '🎓', label: 'Education' },
  { id: 'projects',       icon: '🚀', label: 'Projects' },
  { id: 'skills',         icon: '⚡', label: 'Skills' },
  { id: 'certifications', icon: '🏅', label: 'Certifications' },
  { id: 'template',       icon: '🎨', label: 'Templates' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { activeSection, setActiveSection, darkMode, setDarkMode, resume, saved } = useResume();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Redirect to login
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">📄</span>
        <span className="brand-name">ResumeBuilder</span>
      </div>

      {resume.id && (
        <div className="resume-id-badge">
          Resume #{resume.id}
          {saved && <span className="saved-pill">✓ Saved</span>}
        </div>
      )}

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="dark-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
