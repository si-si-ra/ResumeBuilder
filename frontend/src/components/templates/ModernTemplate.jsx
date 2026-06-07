const API = 'http://127.0.0.1:8000';
const ACCENT = '#1e40af';

export default function ModernTemplate({ resume }) {
  const photo = resume.photoPreview
    || (resume.photo && typeof resume.photo === 'string' ? `${API}${resume.photo}` : null);

  const techSkills = resume.skills.filter(s => s.category === 'technical');
  const toolSkills = resume.skills.filter(s => s.category === 'tool');
  const softSkills = resume.skills.filter(s => s.category === 'soft');
  const langSkills = resume.skills.filter(s => s.category === 'language');

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 11.5, color: '#1a1a1a', display: 'flex', minHeight: '297mm' }}>

      {/* Sidebar */}
      <div style={{ width: 200, background: '#0f172a', color: '#e2e8f0', padding: '28px 18px', flexShrink: 0 }}>

        {photo && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img src={photo} alt="profile"
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #4f46e5' }} />
          </div>
        )}

        <h1 style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
          {resume.full_name || 'Your Name'}
        </h1>

        <div style={{ marginBottom: 20 }}>
          {resume.email    && <SideItem icon="✉"  text={resume.email} />}
          {resume.phone    && <SideItem icon="📞" text={resume.phone} />}
          {resume.address  && <SideItem icon="📍" text={resume.address} />}
          {resume.linkedin && <SideItem icon="in" text={resume.linkedin.replace('https://linkedin.com/in/', '')} />}
          {resume.github   && <SideItem icon="⌥" text={resume.github.replace('https://github.com/', '')} />}
        </div>

        {(techSkills.length > 0 || toolSkills.length > 0) && (
          <SideSection title="Technical Skills">
            {[...techSkills, ...toolSkills].map(s => (
              <div key={s.id} style={{ fontSize: 10.5, color: '#cbd5e1', marginBottom: 3 }}>• {s.name}</div>
            ))}
          </SideSection>
        )}

        {softSkills.length > 0 && (
          <SideSection title="Soft Skills">
            {softSkills.map(s => (
              <div key={s.id} style={{ fontSize: 10.5, color: '#cbd5e1', marginBottom: 3 }}>• {s.name}</div>
            ))}
          </SideSection>
        )}

        {langSkills.length > 0 && (
          <SideSection title="Languages">
            {langSkills.map(s => (
              <div key={s.id} style={{ fontSize: 10.5, color: '#cbd5e1', marginBottom: 3 }}>• {s.name}</div>
            ))}
          </SideSection>
        )}

        {resume.certifications.length > 0 && (
          <SideSection title="Certifications">
            {resume.certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#e2e8f0' }}>{cert.title}</div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>{cert.issuer} · {cert.year}</div>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '28px 24px' }}>

        {resume.summary && (
          <MainSection title="About Me" accent={ACCENT}>
            <p style={{ color: '#374151', lineHeight: 1.6 }}>{resume.summary}</p>
          </MainSection>
        )}

        {resume.experiences.length > 0 && (
          <MainSection title="Work Experience" accent={ACCENT}>
            {resume.experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 12.5, color: '#111' }}>{exp.job_title}</strong>
                  <span style={{ fontSize: 10.5, color: '#6b7280', whiteSpace: 'nowrap' }}>{exp.start_date} – {exp.end_date || 'Present'}</span>
                </div>
                <div style={{ color: ACCENT, fontWeight: 600, fontSize: 11 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.description && <div style={{ marginTop: 4, color: '#374151', whiteSpace: 'pre-line', fontSize: 11 }}>{exp.description}</div>}
              </div>
            ))}
          </MainSection>
        )}

        {resume.educations.length > 0 && (
          <MainSection title="Education" accent={ACCENT}>
            {resume.educations.map(edu => (
              <div key={edu.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 12.5 }}>{edu.degree}</strong>
                  <span style={{ fontSize: 10.5, color: '#6b7280' }}>{edu.year}</span>
                </div>
                <div style={{ color: '#555', fontSize: 11 }}>{edu.college}{edu.cgpa ? ` · ${edu.cgpa}` : ''}</div>
              </div>
            ))}
          </MainSection>
        )}

        {resume.projects.length > 0 && (
          <MainSection title="Projects" accent={ACCENT}>
            {resume.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `3px solid ${ACCENT}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 12.5 }}>{proj.title}</strong>
                </div>
                {proj.technologies && <div style={{ fontSize: 10.5, color: ACCENT, fontWeight: 600, marginTop: 1 }}>{proj.technologies}</div>}
                {proj.description && <div style={{ marginTop: 4, fontSize: 11, color: '#374151' }}>{proj.description}</div>}
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  );
}

function SideItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 5 }}>
      <span style={{ fontSize: 10, minWidth: 14 }}>{icon}</span>
      <span style={{ fontSize: 10, color: '#94a3b8', wordBreak: 'break-all' }}>{text}</span>
    </div>
  );
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#6366f1', marginBottom: 8, borderBottom: '1px solid #1e3a5f', paddingBottom: 4 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function MainSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: .8, color: accent, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ height: 2, width: 20, background: accent, display: 'inline-block' }} />
        {title}
      </h2>
      {children}
    </div>
  );
}
