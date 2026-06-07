import { useState } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const blank = { title: '', description: '', technologies: '', link: '', order: 0 };

export default function ProjectForm() {
  const { resume, setResume } = useResume();
  const [form, setForm]       = useState(blank);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!resume.id) return (
    <div className="section-header">
      <h2>🚀 Projects</h2>
      <p style={{ color: 'var(--warning)', marginTop: 12 }}>⚠️ Please save Personal Info first.</p>
    </div>
  );

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title) return alert('Project title is required.');
    setSaving(true);
    try {
      if (editId) {
        const res = await api.put(`/project/${editId}/`, { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, projects: prev.projects.map(p => p.id === editId ? res.data : p) }));
      } else {
        const res = await api.post('/project/', { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, projects: [...prev.projects, res.data] }));
      }
      setForm(blank); setEditId(null); setShowForm(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleEdit = (proj) => { setForm({ ...proj }); setEditId(proj.id); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/project/${id}/`);
    setResume(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>🚀 Projects</h2>
        <p>Showcase your portfolio projects.</p>
      </div>

      {resume.projects.map(proj => (
        <div className="entry-card" key={proj.id}>
          <div className="entry-card-header">
            <div>
              <div className="entry-card-title">{proj.title}</div>
              <div className="entry-card-sub">{proj.technologies}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleEdit(proj)}>Edit</button>
              <button className="btn btn-danger"    style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleDelete(proj.id)}>Delete</button>
            </div>
          </div>
          {proj.description && <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{proj.description}</p>}
        </div>
      ))}

      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{editId ? 'Edit Project' : 'Add Project'}</h3>
          <div className="form-grid">
            <div className="field span-2">
              <label>Project Title *</label>
              <input name="title" value={form.title} onChange={handle} placeholder="Task Manager App" />
            </div>
            <div className="field span-2">
              <label>Technologies Used</label>
              <input name="technologies" value={form.technologies} onChange={handle} placeholder="Django, React, PostgreSQL, Tailwind CSS" />
            </div>
            <div className="field span-2">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handle} rows={3}
                placeholder="Full-stack task management app with JWT auth, drag-and-drop kanban board, and REST API..." />
            </div>
            <div className="field span-2">
              <label>GitHub / Live Link</label>
              <input name="link" value={form.link} onChange={handle} placeholder="https://github.com/yourusername/project" />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳ Saving…' : '💾 Save'}</button>
            <button className="btn btn-secondary" onClick={() => { setForm(blank); setEditId(null); setShowForm(false); }}>Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="add-entry-btn" onClick={() => setShowForm(true)}>+ Add Project</button>
      )}
    </div>
  );
}
