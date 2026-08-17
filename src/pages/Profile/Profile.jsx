import React, { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import {
  User,
  GraduationCap,
  Briefcase,
  Code2,
  CheckCircle2,
  Plus,
  X,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Award
} from 'lucide-react';
import { HeadlineManager } from '../../components/resume/HeadlineManager';

export const Profile = () => {
  const {
    profile,
    completeness,
    updatePersonal,
    updateEducation,
    updatePreferences,
    addSkill,
    removeSkill
  } = useProfile();

  const [activeTab, setActiveTab] = useState('personal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [personalForm, setPersonalForm] = useState(profile.personal);
  const [educationForm, setEducationForm] = useState(profile.education);
  const [preferencesForm, setPreferencesForm] = useState(profile.preferences);

  // Skill Input State
  const [techInput, setTechInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const triggerSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePersonal = (e) => {
    e.preventDefault();
    updatePersonal(personalForm);
    triggerSaveNotification();
  };

  const handleSaveEducation = (e) => {
    e.preventDefault();
    updateEducation(educationForm);
    triggerSaveNotification();
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    updatePreferences(preferencesForm);
    triggerSaveNotification();
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (roleInput.trim() && !preferencesForm.preferredRoles.includes(roleInput.trim())) {
      const updated = [...preferencesForm.preferredRoles, roleInput.trim()];
      setPreferencesForm(prev => ({ ...prev, preferredRoles: updated }));
      updatePreferences({ preferredRoles: updated });
      setRoleInput('');
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    const updated = preferencesForm.preferredRoles.filter(r => r !== roleToRemove);
    setPreferencesForm(prev => ({ ...prev, preferredRoles: updated }));
    updatePreferences({ preferredRoles: updated });
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (locationInput.trim() && !preferencesForm.preferredLocations.includes(locationInput.trim())) {
      const updated = [...preferencesForm.preferredLocations, locationInput.trim()];
      setPreferencesForm(prev => ({ ...prev, preferredLocations: updated }));
      updatePreferences({ preferredLocations: updated });
      setLocationInput('');
    }
  };

  const handleRemoveLocation = (locToRemove) => {
    const updated = preferencesForm.preferredLocations.filter(l => l !== locToRemove);
    setPreferencesForm(prev => ({ ...prev, preferredLocations: updated }));
    updatePreferences({ preferredLocations: updated });
  };

  return (
    <div className="page-container fade-in">
      {/* Header Notification */}
      {saveSuccess && (
        <div style={{
          position: 'fixed',
          top: '85px',
          right: '24px',
          backgroundColor: 'var(--color-success)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Top Banner Card */}
      <Card glass style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={profile.personal.avatarUrl}
              alt={profile.personal.fullName}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: 'var(--radius-full)',
                objectFit: 'cover',
                border: '3px solid var(--color-primary)',
                boxShadow: 'var(--shadow-glow)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>{profile.personal.fullName}</h1>
                <Badge variant="primary" icon={Sparkles}>Fresher Candidate</Badge>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '0.5rem' }}>{profile.personal.headline}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {profile.personal.location}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><GraduationCap size={14} /> {profile.education.degree} ({profile.education.gradYear})</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Award size={14} /> CGPA: {profile.education.cgpa}</span>
              </div>
            </div>
          </div>

          {/* Profile Completeness Gauge */}
          <div style={{ minWidth: '220px', backgroundColor: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ fontWeight: 600 }}>Profile Completeness</span>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{completeness}%</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-app)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ width: `${completeness}%`, height: '100%', backgroundColor: 'var(--color-primary)', transition: 'width 0.5s ease' }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
              High completeness improves your <strong>Fresher Fit Score</strong> match accuracy!
            </p>
          </div>
        </div>
      </Card>

      {/* Profile Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        {[
          { id: 'personal', label: 'Personal Information', icon: User },
          { id: 'education', label: 'Education & Academics', icon: GraduationCap },
          { id: 'preferences', label: 'Career Preferences', icon: Briefcase },
          { id: 'skills', label: 'Skills & Tech Stack', icon: Code2 }
        ].map(tab => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <IconComp size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'personal' && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Personal Information</h3>
          <form onSubmit={handleSavePersonal}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <Input
                label="Full Name"
                icon={User}
                value={personalForm.fullName}
                onChange={e => setPersonalForm({ ...personalForm, fullName: e.target.value })}
                required
              />
              <Input
                label="Email Address"
                icon={Mail}
                type="email"
                value={personalForm.email}
                onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                icon={Phone}
                value={personalForm.phone}
                onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
              />
              <Input
                label="Current Location"
                icon={MapPin}
                value={personalForm.location}
                onChange={e => setPersonalForm({ ...personalForm, location: e.target.value })}
                required
              />
            </div>

            <HeadlineManager
              headline={personalForm.headline}
              headlineSource={personalForm.headlineSource || 'auto'}
              onSaveHeadline={(newText, source) => {
                const updated = { ...personalForm, headline: newText, headlineSource: source };
                setPersonalForm(updated);
                updatePersonal(updated);
              }}
              currentProfile={profile}
            />

            <div className="form-group">
              <label className="form-label">Career Objective</label>
              <textarea
                className="textarea"
                rows={4}
                value={personalForm.bio}
                onChange={e => setPersonalForm({ ...personalForm, bio: e.target.value })}
                placeholder="Briefly describe your career goals, technical interests, and projects..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary">Save Personal Details</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 2: Education & Academics */}
      {activeTab === 'education' && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Education & Academic Background</h3>
          <form onSubmit={handleSaveEducation}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Degree</label>
                <select
                  className="select"
                  value={educationForm.degree}
                  onChange={e => setEducationForm({ ...educationForm, degree: e.target.value })}
                >
                  <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                  <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                  <option value="Diploma in Engineering">Diploma in Engineering</option>
                </select>
              </div>

              <Input
                label="Branch / Major"
                value={educationForm.branch}
                onChange={e => setEducationForm({ ...educationForm, branch: e.target.value })}
                placeholder="Computer Science, IT, AI & ML, ECE..."
              />

              <Input
                label="College / University Name"
                value={educationForm.college}
                onChange={e => setEducationForm({ ...educationForm, college: e.target.value })}
              />

              <Input
                label="Graduation Year"
                value={educationForm.gradYear}
                onChange={e => setEducationForm({ ...educationForm, gradYear: e.target.value })}
                placeholder="2025 or 2026"
              />

              <Input
                label="CGPA or Percentage"
                value={educationForm.cgpa}
                onChange={e => setEducationForm({ ...educationForm, cgpa: e.target.value })}
                placeholder="8.5 / 10 or 85%"
              />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Academic Honors & Achievements</label>
              <textarea
                className="textarea"
                rows={3}
                value={educationForm.achievements}
                onChange={e => setEducationForm({ ...educationForm, achievements: e.target.value })}
                placeholder="Dean's list, Hackathons, Olympiad awards, paper publications..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary">Save Education Details</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: Career Preferences */}
      {activeTab === 'preferences' && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Career & Job Preferences</h3>
          <form onSubmit={handleSavePreferences}>
            {/* Preferred Roles Tag Adder */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Preferred Job Roles</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Add role e.g. React Developer, Frontend Trainee..."
                  value={roleInput}
                  onChange={e => setRoleInput(e.target.value)}
                />
                <Button type="button" variant="secondary" icon={Plus} onClick={handleAddRole}>Add</Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {preferencesForm.preferredRoles.map((role, rIdx) => (
                  <span key={rIdx} className="badge badge-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
                    {role}
                    <X size={14} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveRole(role)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Preferred Locations Tag Adder */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Preferred Job Locations</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Add city e.g. Bengaluru, Remote, Hyderabad..."
                  value={locationInput}
                  onChange={e => setLocationInput(e.target.value)}
                />
                <Button type="button" variant="secondary" icon={Plus} onClick={handleAddLocation}>Add</Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {preferencesForm.preferredLocations.map((loc, lIdx) => (
                  <span key={lIdx} className="badge badge-info" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
                    {loc}
                    <X size={14} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveLocation(loc)} />
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                <select
                  className="select"
                  value={preferencesForm.workMode}
                  onChange={e => setPreferencesForm({ ...preferencesForm, workMode: e.target.value })}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <Input
                label="Expected Starting Salary"
                value={preferencesForm.minSalary}
                onChange={e => setPreferencesForm({ ...preferencesForm, minSalary: e.target.value })}
                placeholder="₹4,50,000 / year"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button type="submit" variant="primary">Save Preferences</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 4: Skills & Tech Stack */}
      {activeTab === 'skills' && (
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Skills & Technical Inventory</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            The <strong>Fresher Fit Score</strong> compares these skills directly against job requirement descriptions!
          </p>

          {/* Technical Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Technical Languages & Frameworks</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', maxWidth: '500px' }}>
              <input
                type="text"
                className="input"
                placeholder="Add skill e.g. React.js, Python, TypeScript..."
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('technical', techInput);
                    setTechInput('');
                  }
                }}
              />
              <Button
                type="button"
                variant="primary"
                icon={Plus}
                onClick={() => {
                  addSkill('technical', techInput);
                  setTechInput('');
                }}
              >
                Add Skill
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.skills.technical || []).map((skill, sIdx) => (
                <span key={sIdx} className="badge badge-primary" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                  {skill}
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => removeSkill('technical', skill)} />
                </span>
              ))}
            </div>
          </div>

          {/* Developer Tools */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Developer Tools & Platforms</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', maxWidth: '500px' }}>
              <input
                type="text"
                className="input"
                placeholder="Add tool e.g. Git, VS Code, Docker, Figma..."
                value={toolInput}
                onChange={e => setToolInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('tools', toolInput);
                    setToolInput('');
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                icon={Plus}
                onClick={() => {
                  addSkill('tools', toolInput);
                  setToolInput('');
                }}
              >
                Add Tool
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.skills.tools || []).map((tool, tIdx) => (
                <span key={tIdx} className="badge badge-info" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                  {tool}
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => removeSkill('tools', tool)} />
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Soft Skills & Aptitude</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', maxWidth: '500px' }}>
              <input
                type="text"
                className="input"
                placeholder="Add soft skill e.g. Problem Solving, Communication..."
                value={softInput}
                onChange={e => setSoftInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill('soft', softInput);
                    setSoftInput('');
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                icon={Plus}
                onClick={() => {
                  addSkill('soft', softInput);
                  setSoftInput('');
                }}
              >
                Add
              </Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(profile.skills.soft || []).map((soft, sfIdx) => (
                <span key={sfIdx} className="badge badge-success" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                  {soft}
                  <X size={14} style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => removeSkill('soft', soft)} />
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
