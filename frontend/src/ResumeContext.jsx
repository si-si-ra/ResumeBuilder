import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const ResumeContext = createContext(null);

export const emptyResume = {
  id: null,
  full_name: '', email: '', phone: '', address: '',
  linkedin: '', github: '', portfolio: '', summary: '',
  photo: null, template: 'classic',
  experiences: [], educations: [], projects: [], skills: [], certifications: [],
};

export function ResumeProvider({ children }) {
  const [resume, setResume]       = useState(emptyResume);
  const [darkMode, setDarkMode]   = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    let cancelled = false;
    const loadResume = async () => {
      try {
        const response = await api.get('/resume/');
        if (cancelled) return;
        setResume(response.data || emptyResume);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
      }
    };

    loadResume();
    return () => { cancelled = true; };
  }, []);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ResumeContext.Provider value={{
      resume, setResume,
      darkMode, setDarkMode,
      activeSection, setActiveSection,
      saving, setSaving,
      saved, setSaved, flashSaved,
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export const useResume = () => useContext(ResumeContext);
