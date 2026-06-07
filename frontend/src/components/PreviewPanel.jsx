import { useRef } from 'react';
import { useResume } from '../ResumeContext';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate  from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import './PreviewPanel.css';

const TEMPLATE_MAP = {
  classic: ClassicTemplate,
  modern:  ModernTemplate,
  minimal: MinimalTemplate,
};

export default function PreviewPanel() {
  const { resume } = useResume();
  const printRef = useRef();

  const handleDownload = async () => {
    const { default: html2pdf } = await import('html2pdf.js');
    const el = printRef.current;
    const opt = {
      margin:      [10, 10, 10, 10],
      filename:    `${resume.full_name || 'resume'}.pdf`,
      image:       { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(el).save();
  };

  const Template = TEMPLATE_MAP[resume.template] || ClassicTemplate;

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <span className="preview-title">
          👁 Live Preview
          <span className="template-badge">{resume.template}</span>
        </span>
        <button className="btn btn-success download-btn" onClick={handleDownload}>
          ⬇ Download PDF
        </button>
      </div>

      <div className="preview-scroll">
        <div className="preview-paper" ref={printRef}>
          <Template resume={resume} />
        </div>
      </div>
    </div>
  );
}
