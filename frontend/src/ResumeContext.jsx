import { createContext, useContext, useState } from 'react';

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
