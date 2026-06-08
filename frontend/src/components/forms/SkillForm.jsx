import { useState } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const CATEGORIES = [
  { value: 'technical', label: '💻 Technical' },
  { value: 'tool',      label: '🛠 Tools & Platforms' },
  { value: 'soft',      label: '🤝 Soft Skills' },
  { value: 'language',  label: '🗣 Languages' },
];

const SUGGESTIONS = {
  technical: ['Python', 'Django', 'Django REST Framework', 'React', 'JavaScript', 'HTML', 'CSS', 'SQL', 'PostgreSQL', 'MySQL', 'REST APIs', 'JWT', 'Bootstrap', 'Tailwind CSS'],
  tool:      ['Git', 'GitHub', 'VS Code', 'Postman', 'Docker', 'AWS', 'PythonAnywhere', 'Linux', 'Vite', 'npm'],
  soft:      ['Problem Solving', 'Team Collaboration', 'Communication', 'Time Management', 'Self-Learning'],
  language:  ['English', 'Malayalam', 'Hindi'],
};

export default function SkillForm() {
  const { resume, setResume } = useResume();
  const [input, setInput]   = useState('');
  const [category, setCat]  = useState('technical');
  const [saving, setSaving] = useState(false);

  if (!resume.id) return (
    <div className="section-header">
      <h2>⚡ Skills</h2>
      <p style={{ color: 'var(--warning)', marginTop: 12 }}>⚠️ Please save Personal Info first.</p>
    </div>
  );

  const addSkill = async (name) => {
    if (!name.trim()) return;
    if (resume.skills.find(s => s.name.toLowerCase() === name.toLowerCase())) return;
    setSaving(true);
    try {
      const res = await api.post('/skill/', { name: name.trim(), category, resume: resume.id });
      setResume(prev => ({ ...prev, skills: [...prev.skills, res.data] }));
      setInput('');
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(input); }
  };

  const deleteSkill = async (id) => {
    await api.delete(`/skill/${id}/`);
    setResume(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const byCategory = (cat) => resume.skills.filter(s => s.category === cat);

  return (
    <div>
      <div className="section-header">
        <h2>⚡ Skills</h2>
        <p>Add skills as tags. Press Enter or comma to add.</p>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Category</label>
            <select value={category} onChange={e => setCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Skill Name</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter a skill"
                style={{ flex: 1 }}
              />
              <button className="btn btn-primary" onClick={() => addSkill(input)} disabled={saving || !input.trim()}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 14 }}>
          <p className="text-sm text-muted" style={{ marginBottom: 8 }}>Quick add:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTIONS[category]
              .filter(s => !resume.skills.find(sk => sk.name.toLowerCase() === s.toLowerCase()))
              .map(s => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  style={{
                    padding: '3px 10px', borderRadius: 99, fontSize: '.78rem', fontWeight: 600,
                    background: 'var(--primary-light)', color: 'var(--primary)',
                    border: '1px solid var(--primary)', cursor: 'pointer',
                  }}
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Display by category */}
      {CATEGORIES.map(cat => {
        const skills = byCategory(cat.value);
        if (!skills.length) return null;
        return (
          <div className="card" key={cat.value} style={{ marginBottom: 12 }}>
            <p className="text-sm text-muted" style={{ marginBottom: 10, fontWeight: 700 }}>{cat.label}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map(s => (
                <span
                  key={s.id}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 99, fontSize: '.85rem', fontWeight: 600,
                    background: 'var(--primary)', color: '#fff',
                  }}
                >
                  {s.name}
                  <button
                    onClick={() => deleteSkill(s.id)}
                    style={{ background: 'none', color: 'rgba(255,255,255,.7)', fontSize: '.8rem', lineHeight: 1, padding: '0 2px' }}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
