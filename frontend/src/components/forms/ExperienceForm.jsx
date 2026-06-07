import { useState } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const blank = { job_title: '', company: '', location: '', start_date: '', end_date: '', description: '', order: 0 };

export default function ExperienceForm() {
  const { resume, setResume } = useResume();
  const [form, setForm]     = useState(blank);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!resume.id) return (
    <div className="section-header">
      <h2>💼 Experience</h2>
      <p style={{ color: 'var(--warning)', marginTop: 12 }}>
        ⚠️ Please save Personal Info first to create your resume.
      </p>
    </div>
  );

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.job_title || !form.company) return alert('Job title and company are required.');
    setSaving(true);
    try {
      if (editId) {
        const res = await api.put(`/experience/${editId}/`, { ...form, resume: resume.id });
        setResume(prev => ({
          ...prev,
          experiences: prev.experiences.map(e => e.id === editId ? res.data : e),
        }));
      } else {
        const res = await api.post('/experience/', { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, experiences: [...prev.experiences, res.data] }));
      }
      setForm(blank); setEditId(null); setShowForm(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleEdit = (exp) => {
    setForm({ ...exp });
    setEditId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return;
    await api.delete(`/experience/${id}/`);
    setResume(prev => ({ ...prev, experiences: prev.experiences.filter(e => e.id !== id) }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>💼 Work Experience</h2>
        <p>Add your internships and jobs. Most recent first.</p>
      </div>

      {resume.experiences.map(exp => (
        <div className="entry-card" key={exp.id}>
          <div className="entry-card-header">
            <div>
              <div className="entry-card-title">{exp.job_title}</div>
              <div className="entry-card-sub">{exp.company}{exp.location ? ` · ${exp.location}` : ''} · {exp.start_date} – {exp.end_date || 'Present'}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleEdit(exp)}>Edit</button>
              <button className="btn btn-danger"    style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
          {exp.description && <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{exp.description}</p>}
        </div>
      ))}

      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
            {editId ? 'Edit Experience' : 'Add Experience'}
          </h3>
          <div className="form-grid">
            <div className="field">
              <label>Job Title *</label>
              <input name="job_title" value={form.job_title} onChange={handle} placeholder="Junior Django Developer" />
            </div>
            <div className="field">
              <label>Company *</label>
              <input name="company" value={form.company} onChange={handle} placeholder="Techlyra Info Systems" />
            </div>
            <div className="field">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handle} placeholder="Thrissur, Kerala" />
            </div>
            <div className="field" />
            <div className="field">
              <label>Start Date</label>
              <input name="start_date" value={form.start_date} onChange={handle} placeholder="Oct 2025" />
            </div>
            <div className="field">
              <label>End Date</label>
              <input name="end_date" value={form.end_date} onChange={handle} placeholder="Present" />
            </div>
            <div className="field span-2">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handle} rows={3}
                placeholder="• Built REST APIs using Django REST Framework&#10;• Developed React components for LyraERP dashboard" />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳ Saving…' : '💾 Save'}</button>
            <button className="btn btn-secondary" onClick={() => { setForm(blank); setEditId(null); setShowForm(false); }}>Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="add-entry-btn" onClick={() => setShowForm(true)}>
          + Add Experience
        </button>
      )}
    </div>
  );
}
