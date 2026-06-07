const API = 'http://127.0.0.1:8000';

export default function MinimalTemplate({ resume }) {
  const photo = resume.photoPreview
    || (resume.photo && typeof resume.photo === 'string' ? `${API}${resume.photo}` : null);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 11.5, color: '#111', padding: '36px 44px', lineHeight: 1.65 }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 300, letterSpacing: '-1px', color: '#000', margin: 0 }}>
            {resume.full_name || 'Your Name'}
          </h1>
          <div style={{ marginTop: 8, color: '#666', fontSize: 11, display: 'flex', flexWrap: 'wrap', gap: '2px 20px' }}>
            {resume.email    && <span>{resume.email}</span>}
            {resume.phone    && <span>{resume.phone}</span>}
            {resume.address  && <span>{resume.address}</span>}
            {resume.linkedin && <span>{resume.linkedin.replace('https://', '')}</span>}
            {resume.github   && <span>{resume.github.replace('https://', '')}</span>}
          </div>
        </div>
        {photo && (
          <img src={photo} alt="profile"
            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
        )}
      </div>

      <div style={{ height: 1, background: '#000', marginBottom: 24 }} />

      {resume.summary && (
        <MinSection title="Profile">
          <p style={{ color: '#444', maxWidth: 480 }}>{resume.summary}</p>
        </MinSection>
      )}

      {resume.experiences.length > 0 && (
        <MinSection title="Experience">
          {resume.experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 700 }}>{exp.job_title}</span>
                  <span style={{ color: '#555' }}> · {exp.company}</span>
                  {exp.location && <span style={{ color: '#888' }}>, {exp.location}</span>}
                </div>
                <span style={{ fontSize: 10.5, color: '#888', whiteSpace: 'nowrap' }}>{exp.start_date} – {exp.end_date || 'Present'}</span>
              </div>
              {exp.description && <div style={{ marginTop: 4, color: '#444', whiteSpace: 'pre-line', fontSize: 11 }}>{exp.description}</div>}
            </div>
          ))}
        </MinSection>
      )}

      {resume.educations.length > 0 && (
        <MinSection title="Education">
          {resume.educations.map(edu => (
            <div key={edu.id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}</span>
                <span style={{ color: '#555' }}> · {edu.college}</span>
                {edu.cgpa && <span style={{ color: '#888' }}> · {edu.cgpa}</span>}
              </div>
              <span style={{ fontSize: 10.5, color: '#888' }}>{edu.year}</span>
            </div>
          ))}
        </MinSection>
      )}

      {resume.projects.length > 0 && (
        <MinSection title="Projects">
          {resume.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: 12 }}>
              <span style={{ fontWeight: 700 }}>{proj.title}</span>
              {proj.technologies && <span style={{ color: '#666' }}> — {proj.technologies}</span>}
              {proj.description && <div style={{ color: '#444', fontSize: 11, marginTop: 2 }}>{proj.description}</div>}
            </div>
          ))}
        </MinSection>
      )}

      {resume.skills.length > 0 && (
        <MinSection title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px' }}>
            {resume.skills.map(s => (
              <span key={s.id} style={{ fontSize: 11 }}>{s.name}</span>
            ))}
          </div>
        </MinSection>
      )}

      {resume.certifications.length > 0 && (
        <MinSection title="Certifications">
          {resume.certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: 5 }}>
              <span style={{ fontWeight: 600 }}>{cert.title}</span>
              <span style={{ color: '#666' }}> · {cert.issuer} · {cert.year}</span>
            </div>
          ))}
        </MinSection>
      )}
    </div>
  );
}

function MinSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#999', marginBottom: 10 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
