import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeProvider, useResume } from './ResumeContext';
import Sidebar     from './components/Sidebar';
import FormPanel   from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import './styles/App.css';

function ResumeBuilder() {
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

function AppRoutes() {
  const token = localStorage.getItem('access_token');

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/resume" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/resume" /> : <Register />} />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={token ? <Navigate to="/resume" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <AppRoutes />
      </ResumeProvider>
    </BrowserRouter>
  );
}
