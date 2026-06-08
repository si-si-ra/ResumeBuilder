import { useState } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const blank = { degree: '', college: '', year: '', cgpa: '', order: 0 };

export default function EducationForm() {
  const { resume, setResume } = useResume();
  const [form, setForm]       = useState(blank);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!resume.id) return (
    <div className="section-header">
      <h2>🎓 Education</h2>
      <p style={{ color: 'var(--warning)', marginTop: 12 }}>⚠️ Please save Personal Info first.</p>
    </div>
  );

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.degree || !form.college) return alert('Degree and college are required.');
    setSaving(true);
    try {
      if (editId) {
        const res = await api.put(`/education/${editId}/`, { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, educations: prev.educations.map(e => e.id === editId ? res.data : e) }));
      } else {
        const res = await api.post('/education/', { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, educations: [...prev.educations, res.data] }));
      }
      setForm(blank); setEditId(null); setShowForm(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleEdit = (edu) => { setForm({ ...edu }); setEditId(edu.id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/education/${id}/`);
    setResume(prev => ({ ...prev, educations: prev.educations.filter(e => e.id !== id) }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>🎓 Education</h2>
        <p>Add your degrees and courses. Most recent first.</p>
      </div>

      {resume.educations.map(edu => (
        <div className="entry-card" key={edu.id}>
          <div className="entry-card-header">
            <div>
              <div className="entry-card-title">{edu.degree}</div>
              <div className="entry-card-sub">{edu.college} · {edu.year}{edu.cgpa ? ` · ${edu.cgpa}` : ''}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleEdit(edu)}>Edit</button>
              <button className="btn btn-danger"    style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleDelete(edu.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{editId ? 'Edit Education' : 'Add Education'}</h3>
          <div className="form-grid">
            <div className="field span-2">
              <label>Degree / Course *</label>
              <input name="degree" value={form.degree} onChange={handle} placeholder="Enter degree or course name" />
            </div>
            <div className="field span-2">
              <label>College / University *</label>
              <input name="college" value={form.college} onChange={handle} placeholder="Enter college or university name" />
            </div>
            <div className="field">
              <label>Year *</label>
              <input name="year" value={form.year} onChange={handle} placeholder="e.g., 2021 – 2024" />
            </div>
            <div className="field">
              <label>CGPA / Score</label>
              <input name="cgpa" value={form.cgpa} onChange={handle} placeholder="e.g., 8.5 / 10" />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳ Saving…' : '💾 Save'}</button>
            <button className="btn btn-secondary" onClick={() => { setForm(blank); setEditId(null); setShowForm(false); }}>Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="add-entry-btn" onClick={() => setShowForm(true)}>+ Add Education</button>
      )}
    </div>
  );
}
