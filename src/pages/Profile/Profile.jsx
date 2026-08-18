import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useProfile } from '../../context/ProfileContext';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useApplications, APPLICATION_STATUSES } from '../../context/ApplicationContext';
import {
  User, Mail, Phone, MapPin, Code, GraduationCap, Briefcase, FolderGit2,
  Award, Upload, Bookmark, Send, CheckCircle2, ShieldCheck, Trash2,
  Plus, X, Edit3, Save, ExternalLink, Activity, AlertCircle, LogOut
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const {
    profile,
    updatePersonal,
    updateSkills,
    updateEducation,
    updateExperience,
    updateProjects,
    updateCertifications,
    clearProfile,
    completeness
  } = useProfile();

  const { savedJobs, clearSavedJobs } = useSavedJobs();
  const { applications, updateApplicationStatus, removeApplication, clearApplications } = useApplications();

  // Edit Personal Info state
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState(profile.personal || {});

  // Add Skill state
  const [newSkill, setNewSkill] = useState('');

  // Add Education state
  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ degree: '', institution: '', year: '', score: '' });

  // Add Experience state
  const [showAddExp, setShowAddExp] = useState(false);
  const [expForm, setExpForm] = useState({ role: '', company: '', duration: '', description: '' });

  // Add Project state
  const [showAddProj, setShowAddProj] = useState(false);
  const [projForm, setProjForm] = useState({ title: '', techStack: '', description: '' });

  // Notification state
  const [notifyMessage, setNotifyMessage] = useState('');

  const showNotification = (msg) => {
    setNotifyMessage(msg);
    setTimeout(() => setNotifyMessage(''), 3000);
  };

  const personal = {
    name: profile.personal?.name || authUser?.name || '',
    email: profile.personal?.email || authUser?.email || '',
    phone: profile.personal?.phone || '',
    location: profile.personal?.location || ''
  };
  const skills = profile.skills || [];
  const education = profile.education || [];
  const experience = profile.experience || [];
  const projects = profile.projects || [];
  const certifications = profile.certifications || [];

  // Career Statistics derived from real local contexts
  const appliedCount = applications.filter(a => a.status === 'Applied').length;
  const interviewCount = applications.filter(a => a.status === 'Interview').length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  const handleSavePersonal = (e) => {
    e.preventDefault();
    updatePersonal(personalForm);
    setIsEditingPersonal(false);
    showNotification('Personal contact information updated successfully.');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      showNotification('Skill added to profile.');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    updateSkills(skills.filter(s => s !== skillToRemove));
    showNotification('Skill removed.');
  };

  const handleAddEducation = (e) => {
    e.preventDefault();
    if (eduForm.degree && eduForm.institution) {
      const newEdu = { ...eduForm, id: String(Date.now()) };
      updateEducation([...education, newEdu]);
      setEduForm({ degree: '', institution: '', year: '', score: '' });
      setShowAddEdu(false);
      showNotification('Education entry added.');
    }
  };

  const handleRemoveEducation = (id) => {
    updateEducation(education.filter(e => e.id !== id));
    showNotification('Education entry removed.');
  };

  const handleAddExperience = (e) => {
    e.preventDefault();
    if (expForm.role && expForm.company) {
      const newExp = { ...expForm, id: String(Date.now()) };
      updateExperience([...experience, newExp]);
      setExpForm({ role: '', company: '', duration: '', description: '' });
      setShowAddExp(false);
      showNotification('Experience entry added.');
    }
  };

  const handleRemoveExperience = (id) => {
    updateExperience(experience.filter(e => e.id !== id));
    showNotification('Experience entry removed.');
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (projForm.title) {
      const newProj = { ...projForm, id: String(Date.now()) };
      updateProjects([...projects, newProj]);
      setProjForm({ title: '', techStack: '', description: '' });
      setShowAddProj(false);
      showNotification('Project entry added.');
    }
  };

  const handleRemoveProject = (id) => {
    updateProjects(projects.filter(p => p.id !== id));
    showNotification('Project entry removed.');
  };

  const handleClearAllCareerData = () => {
    if (window.confirm('Are you sure you want to clear your local candidate profile, saved jobs, and application tracking data?')) {
      clearProfile();
      clearSavedJobs();
      clearApplications();
      showNotification('All local career data cleared.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of your candidate account?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <Container>
      <SectionHeader
        title="Candidate Career Workspace"
        subtitle="Manage your profile background, skills, saved jobs, and application tracking"
        action={
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" icon={Upload} onClick={() => navigate('/resume')}>
              Upload Resume
            </Button>
            <Button variant="secondary" size="sm" icon={Trash2} onClick={handleClearAllCareerData}>
              Clear Local Data
            </Button>
            <Button variant="secondary" size="sm" icon={LogOut} style={{ color: '#b91c1c', borderColor: '#fca5a5', backgroundColor: '#fee2e2' }} onClick={handleLogout}>
              Logout Account
            </Button>
          </div>
        }
      />

      {/* Toast Notification */}
      {notifyMessage && (
        <Card style={{ backgroundColor: 'var(--color-success-bg)', borderColor: 'var(--color-success)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={18} />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{notifyMessage}</span>
          </div>
        </Card>
      )}

      {/* Header Profile Summary */}
      <Card style={{ marginBottom: 'var(--spacing-lg)', border: '1px solid #c7d2fe' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--font-size-xl)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              {personal.name ? personal.name.charAt(0).toUpperCase() : <User size={34} />}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: '2px', color: 'var(--color-text)' }}>
                {personal.name || 'Candidate Profile'}
              </h2>
              <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                {skills.length > 0 ? `${skills.slice(0, 3).join(', ')} • Fresher Candidate` : 'Fresher Candidate Profile'}
              </p>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)', flexWrap: 'wrap', fontWeight: 500 }}>
                {personal.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={13} style={{ color: 'var(--color-primary)' }} /> {personal.email}</span>}
                {personal.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={13} style={{ color: 'var(--color-info)' }} /> {personal.phone}</span>}
                {personal.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} style={{ color: 'var(--color-success)' }} /> {personal.location}</span>}
              </div>
            </div>
          </div>

          {/* Profile Strength Progress Meter */}
          <div style={{ minWidth: '240px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', fontWeight: 700, marginBottom: '6px' }}>
              <span>Profile Strength</span>
              <span style={{ color: 'var(--color-primary)' }}>{completeness.percentage}%</span>
            </div>
            <div style={{ height: '10px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden', padding: '2px', border: '1px solid var(--color-border)' }}>
              <div style={{ width: `${completeness.percentage}%`, height: '100%', borderRadius: 'var(--radius-full)', background: 'var(--gradient-primary)', transition: 'width 0.4s ease' }} />
            </div>
            {completeness.missingFields.length > 0 && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                Add: {completeness.missingFields.slice(0, 2).join(', ')}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Real Career Overview Stats Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>{savedJobs.length}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>SAVED JOBS</span>
        </Card>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-info)', display: 'block' }}>{appliedCount}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>APPLIED</span>
        </Card>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-warning)', display: 'block' }}>{interviewCount}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>INTERVIEWS</span>
        </Card>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-success)', display: 'block' }}>{selectedCount}</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 600 }}>SELECTED</span>
        </Card>
      </div>

      {/* Main Grid: Profile Sections + Application Tracker */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {/* 1. Contact Info Section */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>Personal Contact & Social Links</h3>
              </div>
              <Button variant="secondary" size="sm" icon={Edit3} onClick={() => { setPersonalForm(personal); setIsEditingPersonal(!isEditingPersonal); }}>
                {isEditingPersonal ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            {isEditingPersonal ? (
              <form onSubmit={handleSavePersonal} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)' }}>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Name</label>
                  <input type="text" value={personalForm.name || ''} onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Email</label>
                  <input type="email" value={personalForm.email || ''} onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Phone</label>
                  <input type="text" value={personalForm.phone || ''} onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>Location</label>
                  <input type="text" value={personalForm.location || ''} onChange={(e) => setPersonalForm({ ...personalForm, location: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>LinkedIn URL</label>
                  <input type="text" value={personalForm.linkedin || ''} onChange={(e) => setPersonalForm({ ...personalForm, linkedin: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>GitHub URL</label>
                  <input type="text" value={personalForm.github || ''} onChange={(e) => setPersonalForm({ ...personalForm, github: e.target.value })} style={{ width: '100%' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: 'var(--spacing-xs)' }}>
                  <Button type="submit" variant="primary" icon={Save}>Save Changes</Button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                <div><span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: 'var(--font-size-xs)' }}>EMAIL</span>{personal.email || 'Not added'}</div>
                <div><span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: 'var(--font-size-xs)' }}>PHONE</span>{personal.phone || 'Not added'}</div>
                <div><span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: 'var(--font-size-xs)' }}>LOCATION</span>{personal.location || 'Not added'}</div>
                <div>
                  <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: 'var(--font-size-xs)' }}>LINKEDIN</span>
                  {personal.linkedin ? <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>View Profile <ExternalLink size={12} /></a> : 'Not added'}
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-subtle)', display: 'block', fontSize: 'var(--font-size-xs)' }}>GITHUB</span>
                  {personal.github ? <a href={personal.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>View GitHub <ExternalLink size={12} /></a> : 'Not added'}
                </div>
              </div>
            )}
          </Card>

          {/* 2. Skills Section */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Code size={18} style={{ color: 'var(--color-success)' }} />
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>Technical Skills ({skills.length})</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
              {skills.map((s, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>
                  {s}
                  <button onClick={() => handleRemoveSkill(s)} style={{ color: 'var(--color-primary)', cursor: 'pointer' }}><X size={12} /></button>
                </span>
              ))}
              {skills.length === 0 && <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No technical skills listed.</p>}
            </div>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 'var(--spacing-sm)', maxWidth: '360px' }}>
              <input type="text" placeholder="Add skill (e.g. Docker)..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} style={{ flex: 1 }} />
              <Button type="submit" variant="secondary" size="sm" icon={Plus}>Add</Button>
            </form>
          </Card>

          {/* 3. Education Section */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <GraduationCap size={18} style={{ color: 'var(--color-info)' }} />
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>Education Background ({education.length})</h3>
              </div>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAddEdu(!showAddEdu)}>Add Education</Button>
            </div>

            {showAddEdu && (
              <form onSubmit={handleAddEducation} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-sm)' }}>
                <input type="text" placeholder="Degree / Program *" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} required />
                <input type="text" placeholder="Institution Name *" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })} required />
                <input type="text" placeholder="Graduation Year (e.g. 2026)" value={eduForm.year} onChange={(e) => setEduForm({ ...eduForm, year: e.target.value })} />
                <input type="text" placeholder="CGPA / Score" value={eduForm.score} onChange={(e) => setEduForm({ ...eduForm, score: e.target.value })} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Button type="submit" variant="primary" size="sm">Save Entry</Button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-sm)' }}>{edu.degree}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>{edu.institution} • {edu.year} {edu.score ? `| ${edu.score}` : ''}</p>
                  </div>
                  <button onClick={() => handleRemoveEducation(edu.id)} style={{ color: 'var(--color-text-subtle)' }}><Trash2 size={14} /></button>
                </div>
              ))}
              {education.length === 0 && <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No education background entries.</p>}
            </div>
          </Card>

          {/* 4. Experience Section */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <Briefcase size={18} style={{ color: 'var(--color-warning)' }} />
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>Experience & Internships ({experience.length})</h3>
              </div>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAddExp(!showAddExp)}>Add Experience</Button>
            </div>

            {showAddExp && (
              <form onSubmit={handleAddExperience} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-sm)' }}>
                <input type="text" placeholder="Role / Position *" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })} required />
                <input type="text" placeholder="Company / Org *" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} required />
                <input type="text" placeholder="Duration (e.g. 2024)" value={expForm.duration} onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })} />
                <input type="text" placeholder="Short description" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} style={{ gridColumn: '1 / -1' }} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Button type="submit" variant="primary" size="sm">Save Entry</Button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text)' }}>{exp.role}</h4>
                      <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginTop: '2px' }}>
                        {exp.company} • {exp.duration}
                      </p>
                    </div>
                    <button onClick={() => handleRemoveExperience(exp.id)} style={{ color: 'var(--color-text-subtle)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                  {exp.description && (
                    <div style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {(Array.isArray(exp.description) ? exp.description : String(exp.description).split(' • ')).map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginTop: '2px' }}>
                          <span style={{ color: 'var(--color-primary)' }}>•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {experience.length === 0 && <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No work experience entries.</p>}
            </div>
          </Card>

          {/* 5. Key Projects Section */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <FolderGit2 size={18} style={{ color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: 'var(--font-size-md)' }}>Key Projects ({projects.length})</h3>
              </div>
              <Button variant="secondary" size="sm" icon={Plus} onClick={() => setShowAddProj(!showAddProj)}>Add Project</Button>
            </div>

            {showAddProj && (
              <form onSubmit={handleAddProject} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-sm)' }}>
                <input type="text" placeholder="Project Title *" value={projForm.title} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} required />
                <input type="text" placeholder="Tech Stack (e.g. React, Flask)" value={projForm.techStack} onChange={(e) => setProjForm({ ...projForm, techStack: e.target.value })} />
                <input type="text" placeholder="Project summary" value={projForm.description} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} style={{ gridColumn: '1 / -1' }} />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Button type="submit" variant="primary" size="sm">Save Entry</Button>
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-sm)' }}>{proj.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>{proj.description}</p>
                  </div>
                  <button onClick={() => handleRemoveProject(proj.id)} style={{ color: 'var(--color-text-subtle)' }}><Trash2 size={14} /></button>
                </div>
              ))}
              {projects.length === 0 && <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No key projects listed.</p>}
            </div>
          </Card>
        </div>

        {/* Sidebar: Real Local Application Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
              <Activity size={18} style={{ color: 'var(--color-primary)' }} />
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>Application Tracker ({applications.length})</h3>
            </div>

            {applications.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {applications.map((app) => (
                  <div key={app.jobId} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', marginBottom: '2px' }}>{app.title}</div>
                    <div style={{ color: 'var(--color-text-subtle)', fontSize: '11px', marginBottom: 'var(--spacing-xs)' }}>{app.company}</div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <select
                        value={app.status}
                        onChange={(e) => updateApplicationStatus(app.jobId, e.target.value)}
                        style={{ fontSize: '11px', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}
                      >
                        {APPLICATION_STATUSES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      <button onClick={() => removeApplication(app.jobId)} style={{ color: 'var(--color-text-subtle)' }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>
                No jobs marked as applied yet. Use "Mark as Applied" on job listings to track your applications locally.
              </p>
            )}
          </Card>

          {/* Privacy Notice */}
          <Card style={{ backgroundColor: 'var(--color-surface-elevated)' }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
              <span>Your career profile, saved jobs, and application tracking data are stored 100% locally in your browser on this device.</span>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
};
