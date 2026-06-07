import { useState, useRef } from 'react';
import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

export default function PersonalInfoForm() {
  const { resume, setResume, setSaving, flashSaved } = useResume();
  const [saving, setLocalSaving] = useState(false);
  const fileRef = useRef();

  const handle = (e) => {
    const { name, value } = e.target;
    setResume(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setResume(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    setLocalSaving(true);
    setSaving(true);
    try {
      const fd = new FormData();
      const fields = ['full_name','email','phone','address','linkedin','github','portfolio','summary','template'];
      fields.forEach(f => fd.append(f, resume[f] || ''));
      if (resume.photo instanceof File) fd.append('photo', resume.photo);

      let res;
      if (resume.id) {
        res = await api.patch(`/resume/${resume.id}/`, fd);
      } else {
        res = await api.post('/resume/', fd);
      }
      setResume(prev => ({ ...prev, ...res.data, photoPreview: prev.photoPreview }));
      flashSaved();
    } catch (err) {
      alert('Save failed. Is Django running?');
      console.error(err);
    } finally {
      setLocalSaving(false);
      setSaving(false);
    }
  };

  const photo = resume.photoPreview || (resume.photo && typeof resume.photo === 'string' ? `http://127.0.0.1:8000${resume.photo}` : null);

  return (
    <div>
      <div className="section-header">
        <h2>👤 Personal Information</h2>
        <p>Start here — this appears at the top of your resume.</p>
      </div>

      {/* Photo */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        <div
          style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--border)',
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem',
          }}
        >
          {photo
            ? <img src={photo} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '👤'}
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => fileRef.current.click()}>
            📷 Upload Photo
          </button>
          <p className="text-sm text-muted mt-1">Optional. JPG or PNG.</p>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
        </div>
      </div>

      <div className="card">
        <div className="form-grid">
          <div className="field">
            <label>Full Name *</label>
            <input name="full_name" value={resume.full_name} onChange={handle} placeholder="Sisira K" />
          </div>
          <div className="field">
            <label>Email *</label>
            <input name="email" type="email" value={resume.email} onChange={handle} placeholder="sisira@email.com" />
          </div>
          <div className="field">
            <label>Phone</label>
            <input name="phone" value={resume.phone} onChange={handle} placeholder="+91 9876543210" />
          </div>
          <div className="field">
            <label>Address</label>
            <input name="address" value={resume.address} onChange={handle} placeholder="Thrissur, Kerala, India" />
          </div>
          <div className="field">
            <label>LinkedIn URL</label>
            <input name="linkedin" value={resume.linkedin} onChange={handle} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div className="field">
            <label>GitHub URL</label>
            <input name="github" value={resume.github} onChange={handle} placeholder="https://github.com/yourusername" />
          </div>
          <div className="field">
            <label>Portfolio / Website</label>
            <input name="portfolio" value={resume.portfolio} onChange={handle} placeholder="https://yourportfolio.com" />
          </div>
          <div className="field span-2">
            <label>Professional Summary</label>
            <textarea
              name="summary"
              value={resume.summary}
              onChange={handle}
              rows={4}
              placeholder="Full Stack Developer with 1+ year experience in Django and React..."
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? '⏳ Saving…' : resume.id ? '💾 Save Changes' : '🚀 Create Resume'}
        </button>
        {resume.id && <span className="text-sm text-muted" style={{ alignSelf: 'center' }}>ID: {resume.id}</span>}
      </div>
    </div>
  );
}
