import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { User, Code, GraduationCap, Briefcase, FolderGit2, Award, Link2, ExternalLink, Plus, X, Save, CheckCircle2 } from 'lucide-react';

export const ResumeReview = ({
  profile,
  onUpdate,
  onSave
}) => {
  const [newSkill, setNewSkill] = useState('');

  if (!profile) return null;

  const { personal, skills = [], education = [], experience = [], projects = [], certifications = [], links = [] } = profile;

  const handlePersonalChange = (field, value) => {
    onUpdate({
      ...profile,
      personal: { ...personal, [field]: value }
    });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill && newSkill.trim() && !skills.includes(newSkill.trim())) {
      onUpdate({
        ...profile,
        skills: [...skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    onUpdate({
      ...profile,
      skills: skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
      {/* Review Header Banner */}
      <Card style={{ backgroundColor: 'var(--color-surface)' }}>
        <div>
          <Badge variant="success" icon={CheckCircle2} style={{ marginBottom: 'var(--spacing-xs)' }}>Extraction Complete</Badge>
          <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Resume Analyzed Successfully</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Review and edit the extracted candidate details and embedded document hyperlinks below, then click the Save & Submit button at the bottom to view your profile.
          </p>
        </div>
      </Card>

      {/* 1. Personal Information Section */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
          <User size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>Personal & Contact Information</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Candidate Name</label>
            <input
              type="text"
              value={personal.name || ''}
              onChange={(e) => handlePersonalChange('name', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              value={personal.email || ''}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
            <input
              type="text"
              value={personal.phone || ''}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Location</label>
            <input
              type="text"
              value={personal.location || ''}
              placeholder="e.g. Bengaluru, India"
              onChange={(e) => handlePersonalChange('location', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>LinkedIn URL</label>
            <input
              type="text"
              value={personal.linkedin || ''}
              placeholder="https://linkedin.com/in/..."
              onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>GitHub URL</label>
            <input
              type="text"
              value={personal.github || ''}
              placeholder="https://github.com/..."
              onChange={(e) => handlePersonalChange('github', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </Card>

      {/* 2. Embedded Document Hyperlinks Metadata Section */}
      {links.length > 0 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
            <Link2 size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Extracted Document Hyperlinks ({links.length})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
            {links.map((link, idx) => (
              <div key={idx} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--font-size-xs)', color: 'var(--color-text)' }}>{link.label}</span>
                  <Badge variant={link.source === 'embedded_hyperlink' ? 'success' : 'ghost'} style={{ fontSize: '10px' }}>
                    {link.source === 'embedded_hyperlink' ? 'Metadata Hyperlink (1.0)' : 'Regex Fallback'}
                  </Badge>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-primary)',
                    wordBreak: 'break-all',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600
                  }}
                >
                  {link.url} <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. Skills Section */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
          <Code size={20} style={{ color: 'var(--color-success)' }} />
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>Extracted Skills ({skills.length})</h3>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
          {skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600
              }}
            >
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>

        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 'var(--spacing-sm)', maxWidth: '360px' }}>
          <input
            type="text"
            placeholder="Add a new skill (e.g. Docker)..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="submit" variant="secondary" size="sm" icon={Plus}>
            Add
          </Button>
        </form>
      </Card>

      {/* 4. Education Section */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
          <GraduationCap size={20} style={{ color: 'var(--color-info)' }} />
          <h3 style={{ fontSize: 'var(--font-size-md)' }}>Education Background ({education.length})</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {education.map((edu, idx) => (
            <div key={edu.id || idx} style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{edu.degree}</div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>
                {edu.institution} • {edu.year} {edu.score ? `| Score: ${edu.score}` : ''}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Experience & Projects Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
            <Briefcase size={20} style={{ color: 'var(--color-warning)' }} />
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Experience & Internships ({experience.length})</h3>
          </div>

          {experience.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{exp.role}</div>
                  <div style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-xs)', fontWeight: 600, marginTop: '2px' }}>{exp.company} • {exp.duration}</div>
                  {exp.description && (
                    <div style={{ marginTop: 'var(--spacing-xs)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      {(Array.isArray(exp.description) ? exp.description : String(exp.description).split(' • ')).map((bullet, bIdx) => (
                        <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '2px' }}>
                          <span style={{ color: 'var(--color-primary)' }}>•</span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No work experience entries detected.</p>
          )}
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
            <FolderGit2 size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Key Projects ({projects.length})</h3>
          </div>

          {projects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{proj.title}</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>{proj.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)' }}>No project entries detected.</p>
          )}
        </Card>
      </div>

      {/* 6. Certifications Section */}
      {certifications.length > 0 && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-xs)' }}>
            <Award size={20} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ fontSize: 'var(--font-size-md)' }}>Certifications & Achievements ({certifications.length})</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--spacing-sm)' }}>
            {certifications.map((cert, idx) => (
              <div key={cert.id || idx} style={{ padding: 'var(--spacing-sm)', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{cert.name}</div>
                <div style={{ color: 'var(--color-text-subtle)', fontSize: 'var(--font-size-xs)', marginTop: '2px' }}>{cert.organization}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Single Prominent Save & Submit Button */}
      <Card style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
        <Button variant="primary" size="lg" icon={Save} onClick={onSave} style={{ width: '100%', maxWidth: '360px', margin: '0 auto' }}>
          Save & Submit Profile
        </Button>
      </Card>
    </div>
  );
};
