import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, AlertTriangle, User, GraduationCap, Code2, Plus, X, ArrowRight, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { HeadlineManager } from './HeadlineManager';

export const ResumeReview = ({ initialProfile, onConfirm, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: initialProfile?.personal?.fullName || '',
      email: initialProfile?.personal?.email || '',
      phone: initialProfile?.personal?.phone || '',
      location: initialProfile?.personal?.location || '',
      bio: initialProfile?.personal?.bio || '',
      degree: initialProfile?.education?.degree || 'B.Tech / B.E.',
      branch: initialProfile?.education?.branch || 'Computer Science & Engineering',
      college: initialProfile?.education?.college || '',
      gradYear: initialProfile?.education?.gradYear || '2026',
      cgpa: initialProfile?.education?.cgpa || ''
    }
  });

  const [headlineData, setHeadlineData] = useState({
    text: initialProfile?.personal?.headline || '',
    source: initialProfile?.personal?.headlineSource || 'auto'
  });

  const [skillsList, setSkillsList] = useState(initialProfile?.skills?.technical || []);
  const [skillInput, setSkillInput] = useState('');

  const [toolsList, setToolsList] = useState(
    initialProfile?.skills?.tools && initialProfile.skills.tools.length > 0
      ? initialProfile.skills.tools
      : ['Git & GitHub', 'VS Code', 'Vite', 'Postman']
  );
  const [toolInput, setToolInput] = useState('');

  const [softSkillsList, setSoftSkillsList] = useState(initialProfile?.skills?.soft || ['Problem Solving', 'Teamwork & Collaboration']);
  const [softInput, setSoftInput] = useState('');

  const [projectsList, setProjectsList] = useState(initialProfile?.projects || []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !skillsList.includes(skillInput.trim())) {
      setSkillsList([...skillsList, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAddTool = (e) => {
    e.preventDefault();
    if (toolInput.trim() && !toolsList.includes(toolInput.trim())) {
      setToolsList([...toolsList, toolInput.trim()]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (toolToRemove) => {
    setToolsList(toolsList.filter(t => t !== toolToRemove));
  };

  const handleAddSoftSkill = (e) => {
    e.preventDefault();
    if (softInput.trim() && !softSkillsList.includes(softInput.trim())) {
      setSoftSkillsList([...softSkillsList, softInput.trim()]);
      setSoftInput('');
    }
  };

  const handleRemoveSoftSkill = (softToRemove) => {
    setSoftSkillsList(softSkillsList.filter(s => s !== softToRemove));
  };

  const onSubmitForm = (formData) => {
    const updatedProfile = {
      ...initialProfile,
      personal: {
        ...initialProfile.personal,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        headline: headlineData.text,
        headlineSource: headlineData.source,
        bio: formData.bio
      },
      education: {
        ...initialProfile.education,
        degree: formData.degree,
        branch: formData.branch,
        college: formData.college,
        gradYear: formData.gradYear,
        cgpa: formData.cgpa
      },
      skills: {
        ...initialProfile.skills,
        technical: skillsList,
        tools: toolsList,
        soft: softSkillsList
      },
      projects: projectsList
    };

    onConfirm(updatedProfile);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Banner */}
      <Card glass style={{ padding: '1.5rem', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} /> Review Extracted Resume Profile
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              We parsed your resume locally. Please review and adjust any information before confirming your profile.
            </p>
          </div>
          <Badge variant="success" icon={ShieldCheck}>100% Parsed Locally</Badge>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmitForm)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Personal Information */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--color-primary)' }} />
              Personal Information
            </h3>
            {initialProfile?.confidenceFlags?.personal ? (
              <Badge variant="success" icon={CheckCircle}>✓ Detected</Badge>
            ) : (
              <Badge variant="warning" icon={AlertTriangle}>⚠ Please Verify</Badge>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <Input
              label="Full Name"
              {...register('fullName', { required: 'Name is required' })}
              error={errors.fullName?.message}
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
            <Input
              label="Phone Number"
              {...register('phone')}
            />
            <Input
              label="Location"
              {...register('location', { required: 'Location is required' })}
            />
          </div>

          {/* Dynamic Professional Headline Manager */}
          <HeadlineManager
            headline={headlineData.text}
            headlineSource={headlineData.source}
            onSaveHeadline={(newText, source) => setHeadlineData({ text: newText, source })}
            currentProfile={{
              ...initialProfile,
              skills: { ...initialProfile?.skills, technical: skillsList, tools: toolsList },
              personal: { ...initialProfile?.personal, bio: initialProfile?.personal?.bio }
            }}
          />

          <div className="form-group">
            <label htmlFor="review-career-objective" className="form-label">
              Career Objective / Summary / Bio
            </label>
            <textarea
              id="review-career-objective"
              className="textarea"
              rows={4}
              {...register('bio')}
              placeholder="e.g. Seeking an entry-level position as a Software Developer..."
            />
          </div>
        </Card>

        {/* Section 2: Academic Background */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} style={{ color: 'var(--color-primary)' }} />
              Education & Academics
            </h3>
            {initialProfile?.confidenceFlags?.education ? (
              <Badge variant="success" icon={CheckCircle}>✓ Detected</Badge>
            ) : (
              <Badge variant="warning" icon={AlertTriangle}>⚠ Please Verify</Badge>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <Input label="Degree" {...register('degree')} />
            <Input label="Branch / Specialization" {...register('branch')} />
            <Input label="College / University" {...register('college')} />
            <Input label="Graduation Year" {...register('gradYear')} />
            <Input label="CGPA / Percentage" {...register('cgpa')} />
          </div>
        </Card>

        {/* Section 3: Extracted Technical Skills */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 size={20} style={{ color: 'var(--color-primary)' }} />
              Extracted Technical Skills
            </h3>
            <Badge variant="success" icon={CheckCircle}>{skillsList.length} Technical Skills Extracted</Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '500px' }}>
            <input
              type="text"
              className="input"
              placeholder="Add skill..."
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
            />
            <Button type="button" variant="secondary" icon={Plus} onClick={handleAddSkill}>
              Add
            </Button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skillsList.map((skill, sIdx) => (
              <span key={sIdx} className="badge badge-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                {skill}
                <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => handleRemoveSkill(skill)} />
              </span>
            ))}
          </div>
        </Card>

        {/* Section 4: Extracted Developer Tools & Platforms */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={20} style={{ color: 'var(--color-primary)' }} />
              Extracted Developer Tools & Platforms
            </h3>
            <Badge variant="info" icon={CheckCircle}>{toolsList.length} Tools Extracted</Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '500px' }}>
            <input
              type="text"
              className="input"
              placeholder="Add developer tool e.g. Git, VS Code, Docker, Postman..."
              value={toolInput}
              onChange={e => setToolInput(e.target.value)}
            />
            <Button type="button" variant="secondary" icon={Plus} onClick={handleAddTool}>
              Add Tool
            </Button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {toolsList.map((tool, tIdx) => (
              <span key={tIdx} className="badge badge-info" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                {tool}
                <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => handleRemoveTool(tool)} />
              </span>
            ))}
          </div>
        </Card>

        {/* Section 5: Extracted Soft & Professional Skills */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
              Extracted Soft & Professional Skills
            </h3>
            <Badge variant="success" icon={CheckCircle}>{softSkillsList.length} Soft Skills Extracted</Badge>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '500px' }}>
            <input
              type="text"
              className="input"
              placeholder="Add soft skill e.g. Communication, Problem Solving..."
              value={softInput}
              onChange={e => setSoftInput(e.target.value)}
            />
            <Button type="button" variant="secondary" icon={Plus} onClick={handleAddSoftSkill}>
              Add
            </Button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {softSkillsList.map((soft, sfIdx) => (
              <span key={sfIdx} className="badge badge-success" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                {soft}
                <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => handleRemoveSoftSkill(soft)} />
              </span>
            ))}
          </div>
        </Card>

        {/* Section 6: Experience Level Detection */}
        <Card style={{ backgroundColor: 'var(--color-success-bg)', border: '1px solid var(--color-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                CANDIDATE EXPERIENCE LEVEL
              </span>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-success)' }}>
                {initialProfile?.fresherStatus?.experienceLevel || 'Fresher (0 years)'}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {initialProfile?.fresherStatus?.confidenceNote}
              </p>
            </div>

            <Badge variant="success" icon={CheckCircle}>✓ Detected</Badge>
          </div>
        </Card>

        {/* Confirm Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel Upload
          </Button>

          <Button type="submit" variant="primary" size="lg" icon={ArrowRight}>
            Confirm & Create Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
