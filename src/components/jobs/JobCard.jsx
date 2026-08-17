import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Bookmark, BookmarkCheck, ExternalLink, CheckCircle2, Building2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { FitScoreBadge } from './FitScoreBadge';
import { CompanyLogo } from './CompanyLogo';
import { useProfile } from '../../context/ProfileContext';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { calculateFresherFitScore } from '../../utils/jobMatcher';

export const JobCard = ({ job, onApply }) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  const saved = isJobSaved(job.id);
  const fitData = calculateFresherFitScore(profile, job);

  return (
    <Card hover className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <CompanyLogo companyName={job.company} logoUrl={job.companyLogo} size={52} />

          <div>
            <h3
              onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
              style={{
                fontSize: '1.125rem',
                cursor: 'pointer',
                color: 'var(--text-main)',
                transition: 'color var(--transition-fast)',
                lineHeight: '1.3'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-main)'}
            >
              {job.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, marginTop: '2px' }}>
              {job.company}
            </p>
          </div>
        </div>

        {/* Bookmark Save Button */}
        <button
          onClick={() => toggleSaveJob(job)}
          className="btn btn-secondary btn-icon"
          style={{
            borderRadius: 'var(--radius-full)',
            color: saved ? 'var(--color-warning)' : 'var(--text-subtle)',
            backgroundColor: saved ? 'var(--color-warning-bg)' : undefined,
            flexShrink: 0
          }}
          title={saved ? 'Remove from Saved Jobs' : 'Save Job to Shortlist'}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Badges & Fit Score Pill */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <FitScoreBadge fitData={fitData} />

        {job.isFresherFriendly && (
          <Badge variant="success" icon={CheckCircle2}>Fresher Friendly</Badge>
        )}

        {job.jobType && <Badge variant="primary">{job.jobType}</Badge>}
        {job.workMode && <Badge variant="info">{job.workMode}</Badge>}
      </div>

      {/* Details Meta Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.5rem 0.75rem',
        fontSize: '0.8125rem',
        color: 'var(--text-muted)',
        marginBottom: '1rem',
        padding: '0.75rem 0.875rem',
        backgroundColor: 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Job Location">
          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
          <span>{job.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Salary Information">
          <DollarSign size={14} style={{ color: job.salary === 'Salary not disclosed' ? 'var(--text-subtle)' : 'var(--color-success)' }} />
          <span style={{ fontStyle: job.salary === 'Salary not disclosed' ? 'italic' : 'normal' }}>
            {job.salary}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Experience Level">
          <Briefcase size={14} style={{ color: 'var(--text-subtle)' }} />
          <span>{job.experienceLevel}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} title="Posted Date">
          <Calendar size={14} style={{ color: 'var(--text-subtle)' }} />
          <span>Posted {job.postedDate}</span>
        </div>
      </div>

      {/* Description Snippet */}
      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        marginBottom: '1.25rem',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {job.description}
      </p>

      {/* Skills Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem', marginTop: 'auto' }}>
        {(job.skills || []).slice(0, 5).map((skill, sIdx) => (
          <span key={sIdx} style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            backgroundColor: 'var(--bg-app)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)'
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* Footer Action Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <Button
          variant="secondary"
          size="sm"
          style={{ flex: 1 }}
          onClick={() => navigate(`/jobs/${job.id}`, { state: { job } })}
        >
          Job Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={ExternalLink}
          style={{ flex: 1 }}
          onClick={() => {
            if (onApply) onApply(job);
            else window.open(job.applyUrl, '_blank');
          }}
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
};
