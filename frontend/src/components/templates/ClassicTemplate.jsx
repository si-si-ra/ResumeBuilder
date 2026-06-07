const API = 'http://127.0.0.1:8000';

export default function ClassicTemplate({ resume }) {
  const photo = resume.photoPreview
    || (resume.photo && typeof resume.photo === 'string' ? `${API}${resume.photo}` : null);

  const techSkills = resume.skills.filter(s => s.category === 'technical');
  const toolSkills = resume.skills.filter(s => s.category === 'tool');
  const softSkills = resume.skills.filter(s => s.category === 'soft');
  const langSkills = resume.skills.filter(s => s.category === 'language');

  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 12, color: '#1a1a1a', padding: '28px 32px', lineHeight: 1.5 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, borderBottom: '2.5px solid #1a1a1a', paddingBottom: 16, marginBottom: 18 }}>
        {photo && (
          <img src={photo} alt="profile"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #ddd' }} />
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>{resume.full_name || 'Your Name'}</h1>
          <div style={{ marginTop: 6, color: '#444', fontSize: 11, display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
            {resume.email    && <span>✉ {resume.email}</span>}
            {resume.phone    && <span>📞 {resume.phone}</span>}
            {resume.address  && <span>📍 {resume.address}</span>}
            {resume.linkedin && <span>in {resume.linkedin.replace('https://linkedin.com/in/', '')}</span>}
            {resume.github   && <span>⌥ {resume.github.replace('https://github.com/', '')}</span>}
            {resume.portfolio && <span>🌐 {resume.portfolio.replace('https://', '')}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <Section title="Professional Summary">
          <p style={{ color: '#333', fontStyle: 'italic' }}>{resume.summary}</p>
        </Section>
      )}

      {/* Experience */}
      {resume.experiences.length > 0 && (
        <Section title="Work Experience">
          {resume.experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{exp.job_title}</strong>
                <span style={{ fontSize: 11, color: '#666' }}>{exp.start_date} – {exp.end_date || 'Present'}</span>
              </div>
              <div style={{ color: '#555', fontSize: 11 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
              {exp.description && (
                <div style={{ marginTop: 4, color: '#333', whiteSpace: 'pre-line', fontSize: 11.5 }}>{exp.description}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {resume.educations.length > 0 && (
        <Section title="Education">
          {resume.educations.map(edu => (
            <div key={edu.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: 13 }}>{edu.degree}</strong>
                <span style={{ fontSize: 11, color: '#666' }}>{edu.year}</span>
              </div>
              <div style={{ color: '#555', fontSize: 11.5 }}>
                {edu.college}{edu.cgpa ? ` · ${edu.cgpa}` : ''}
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <Section title="Projects">
          {resume.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong style={{ fontSize: 13 }}>{proj.title}</strong>
                {proj.link && <span style={{ fontSize: 10, color: '#4f46e5' }}>{proj.link}</span>}
              </div>
              {proj.technologies && (
                <div style={{ fontSize: 10.5, color: '#555', fontStyle: 'italic' }}>{proj.technologies}</div>
              )}
              {proj.description && (
                <div style={{ marginTop: 3, fontSize: 11.5, color: '#333' }}>{proj.description}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          {techSkills.length > 0 && <SkillRow label="Technical" skills={techSkills} />}
          {toolSkills.length > 0 && <SkillRow label="Tools" skills={toolSkills} />}
          {softSkills.length > 0 && <SkillRow label="Soft Skills" skills={softSkills} />}
          {langSkills.length > 0 && <SkillRow label="Languages" skills={langSkills} />}
        </Section>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <Section title="Certifications">
          {resume.certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: 6 }}>
              <strong style={{ fontSize: 12 }}>{cert.title}</strong>
              <span style={{ color: '#555', fontSize: 11 }}> · {cert.issuer} · {cert.year}</span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h2 style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '1px solid #aaa', paddingBottom: 4, marginBottom: 10, color: '#111' }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function SkillRow({ label, skills }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 5, alignItems: 'flex-start' }}>
      <span style={{ fontWeight: 700, fontSize: 11, minWidth: 80, color: '#555', paddingTop: 1 }}>{label}:</span>
      <span style={{ fontSize: 11.5, color: '#333' }}>{skills.map(s => s.name).join(' · ')}</span>
    </div>
  );
}
