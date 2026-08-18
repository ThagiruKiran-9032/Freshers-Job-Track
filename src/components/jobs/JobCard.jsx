import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MapPin, Calendar, Bookmark, BookmarkCheck, ExternalLink, Sparkles } from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext';

export const JobCard = ({
  job = {
    id: '1',
    title: 'Software Developer',
    company: 'Tech Company',
    location: 'Location not listed',
    experienceLevel: 'Entry Level',
    jobType: 'Full-time',
    skills: [],
    postedDate: 'Today',
    applicationUrl: null,
    source: 'The Muse'
  },
  onViewDetails
}) => {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(job.id);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'C');

  // Dynamic vibrant company avatar gradient
  const getGradient = (name = '') => {
    const gradients = [
      'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      'linear-gradient(135deg, #0284c7 0%, #3b82f6 100%)',
      'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      'linear-gradient(135deg, #db2777 0%, #e11d48 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash += name.charCodeAt(i);
    return gradients[Math.abs(hash) % gradients.length];
  };

  return (
    <Card hover style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
          {/* Logo Area (Company Initials Avatar Fallback) */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: getGradient(job.company),
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 'var(--font-size-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)'
          }}>
            {getInitial(job.company)}
          </div>

          <div>
            <h3
              onClick={() => onViewDetails && onViewDetails(job.id)}
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'var(--color-text)',
                lineHeight: '1.3'
              }}
            >
              {job.title}
            </h3>
            <p style={{ color: 'var(--color-primary)', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginTop: '2px' }}>
              {job.company}
            </p>
          </div>
        </div>

        <button
          onClick={() => toggleSaveJob(job)}
          style={{
            color: saved ? 'var(--color-warning)' : 'var(--color-text-subtle)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            backgroundColor: saved ? 'var(--badge-amber-bg)' : 'transparent',
            border: saved ? '1px solid #fcd34d' : 'none',
            transition: 'all var(--transition-fast)'
          }}
          title={saved ? 'Unsave Opportunity' : 'Save Opportunity'}
        >
          {saved ? <BookmarkCheck size={20} /> : <Bookmark size={18} />}
        </button>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)', alignItems: 'center' }}>
        <Badge variant="success">{job.experienceLevel || 'Entry Level'}</Badge>
        {job.category && <Badge variant="primary">{job.category}</Badge>}
        {job.source && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', marginLeft: 'auto' }}>
            Source: <a href={job.applicationUrl || 'https://www.themuse.com'} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>{job.source}</a>
          </span>
        )}
      </div>

      {/* Location & Metadata */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--color-surface-elevated)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
          <span>{job.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <Calendar size={14} style={{ color: 'var(--color-info)' }} />
          <span>{job.postedDate}</span>
        </div>
      </div>

      {/* Skills Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--spacing-lg)', marginTop: 'auto' }}>
        {(job.skills || []).slice(0, 4).map((skill, idx) => (
          <span
            key={idx}
            style={{
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              padding: '3px 10px',
              backgroundColor: 'var(--badge-blue-bg)',
              color: 'var(--badge-blue-text)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid #bae6fd'
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', width: '100%' }}>
        <Button variant="secondary" size="sm" style={{ flex: 1 }} onClick={() => onViewDetails && onViewDetails(job.id)}>
          Details
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={ExternalLink}
          disabled={!job.applicationUrl}
          style={{ flex: 1, background: 'var(--gradient-primary)', border: 'none' }}
          onClick={() => job.applicationUrl && window.open(job.applicationUrl, '_blank', 'noopener,noreferrer')}
        >
          {job.applicationUrl ? 'Apply Now' : 'Link N/A'}
        </Button>
      </div>
    </Card>
  );
};
