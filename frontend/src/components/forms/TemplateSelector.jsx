import { useResume } from '../../ResumeContext';
import api from '../../api';
import '../../styles/FormPanel.css';

const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Clean, traditional layout. Best for conservative industries.',
    color: '#4f46e5',
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Two-column with colored sidebar. Great for tech roles.',
    color: '#0f172a',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Whitespace-heavy, typography-first. Elegant and simple.',
    color: '#374151',
  },
];

export default function TemplateSelector() {
  const { resume, setResume } = useResume();

  const handleSelect = async (tpl) => {
    setResume(prev => ({ ...prev, template: tpl }));
    if (resume.id) {
      try {
        await api.patch(`/resume/${resume.id}/`, { template: tpl });
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div>
      <div className="section-header">
        <h2>🎨 Resume Templates</h2>
        <p>Choose how your resume looks in the preview.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            onClick={() => handleSelect(tpl.id)}
            style={{
              border: `2px solid ${resume.template === tpl.id ? tpl.color : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: 18,
              cursor: 'pointer',
              background: resume.template === tpl.id ? 'var(--primary-light)' : 'var(--card-bg)',
              transition: 'all .2s',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{
              width: 48, height: 60, borderRadius: 6,
              background: tpl.color,
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>
              📄
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{tpl.name}</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text-muted)' }}>{tpl.desc}</div>
            </div>
            {resume.template === tpl.id && (
              <div style={{ marginLeft: 'auto', color: tpl.color, fontWeight: 800, fontSize: '1.2rem' }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
