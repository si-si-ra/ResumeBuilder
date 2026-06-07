import { useEffect } from 'react';
import { ResumeProvider, useResume } from './ResumeContext';
import Sidebar     from './components/Sidebar';
import FormPanel   from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import './styles/App.css';

function Inner() {
  const { darkMode } = useResume();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <FormPanel />
        <PreviewPanel />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <Inner />
    </ResumeProvider>
  );
}
