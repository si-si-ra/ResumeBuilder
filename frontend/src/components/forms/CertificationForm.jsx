import { useState } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const blank = { title: '', issuer: '', year: '', link: '', order: 0 };

export default function CertificationForm() {
  const { resume, setResume } = useResume();
  const [form, setForm]       = useState(blank);
  const [editId, setEditId]   = useState(null);
  const [saving, setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!resume.id) return (
    <div className="section-header">
      <h2>🏅 Certifications</h2>
      <p style={{ color: 'var(--warning)', marginTop: 12 }}>⚠️ Please save Personal Info first.</p>
    </div>
  );

  const handle = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    if (!form.title) return alert('Title required.');
    setSaving(true);
    try {
      if (editId) {
        const res = await api.put(`/certification/${editId}/`, { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, certifications: prev.certifications.map(c => c.id === editId ? res.data : c) }));
      } else {
        const res = await api.post('/certification/', { ...form, resume: resume.id });
        setResume(prev => ({ ...prev, certifications: [...prev.certifications, res.data] }));
      }
      setForm(blank); setEditId(null); setShowForm(false);
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const handleEdit = (cert) => { setForm({ ...cert }); setEditId(cert.id); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    await api.delete(`/certification/${id}/`);
    setResume(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  return (
    <div>
      <div className="section-header">
        <h2>🏅 Certifications</h2>
        <p>Add courses, bootcamps, and certifications.</p>
      </div>

      {resume.certifications.map(cert => (
        <div className="entry-card" key={cert.id}>
          <div className="entry-card-header">
            <div>
              <div className="entry-card-title">{cert.title}</div>
              <div className="entry-card-sub">{cert.issuer} · {cert.year}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleEdit(cert)}>Edit</button>
              <button className="btn btn-danger"    style={{ padding: '5px 12px', fontSize: '.8rem' }} onClick={() => handleDelete(cert.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>{editId ? 'Edit Certification' : 'Add Certification'}</h3>
          <div className="form-grid">
            <div className="field span-2">
              <label>Certificate Title *</label>
              <input name="title" value={form.title} onChange={handle} placeholder="Python for Everybody" />
            </div>
            <div className="field">
              <label>Issuer / Platform</label>
              <input name="issuer" value={form.issuer} onChange={handle} placeholder="Coursera / Udemy / NPTEL" />
            </div>
            <div className="field">
              <label>Year</label>
              <input name="year" value={form.year} onChange={handle} placeholder="2024" />
            </div>
            <div className="field span-2">
              <label>Certificate Link</label>
              <input name="link" value={form.link} onChange={handle} placeholder="https://coursera.org/certificate/..." />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? '⏳ Saving…' : '💾 Save'}</button>
            <button className="btn btn-secondary" onClick={() => { setForm(blank); setEditId(null); setShowForm(false); }}>Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className="add-entry-btn" onClick={() => setShowForm(true)}>+ Add Certification</button>
      )}
    </div>
  );
}
