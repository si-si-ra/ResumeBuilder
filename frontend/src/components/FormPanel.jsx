import { useResume } from '../ResumeContext';
import PersonalInfoForm   from './forms/PersonalInfoForm';
import ExperienceForm     from './forms/ExperienceForm';
import EducationForm      from './forms/EducationForm';
import ProjectForm        from './forms/ProjectForm';
import SkillForm          from './forms/SkillForm';
import CertificationForm  from './forms/CertificationForm';
import TemplateSelector   from './forms/TemplateSelector';
import '../styles/FormPanel.css';

const SECTION_MAP = {
  personal:       PersonalInfoForm,
  experience:     ExperienceForm,
  education:      EducationForm,
  projects:       ProjectForm,
  skills:         SkillForm,
  certifications: CertificationForm,
  template:       TemplateSelector,
};

export default function FormPanel() {
  const { activeSection } = useResume();
  const Component = SECTION_MAP[activeSection] || PersonalInfoForm;

  return (
    <div className="form-panel">
      <div className="form-scroll">
        <Component />
      </div>
    </div>
  );
}
