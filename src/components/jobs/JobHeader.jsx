import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Bookmark, BookmarkCheck, ExternalLink, CheckCircle2, Send, Check } from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useApplications, APPLICATION_STATUSES } from '../../context/ApplicationContext';

export const JobHeader = ({ job }) => {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const { getApplicationStatus, markAsApplied, updateApplicationStatus } = useApplications();

  const saved = isJobSaved(job.id);
  const currentStatus = getApplicationStatus(job.id);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'C');

  const handleApplyClick = () => {
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMarkApplied = () => {
    if (!currentStatus) {
      markAsApplied(job, 'Applied');
    } else {
      // Cycle to next status
      const currentIndex = APPLICATION_STATUSES.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % APPLICATION_STATUSES.length;
      updateApplicationStatus(job.id, APPLICATION_STATUSES[nextIndex]);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Applied': return 'primary';
      case 'Interview': return 'warning';
      case 'Selected': return 'success';
      case 'Rejected': return 'error';
      default: return 'ghost';
    }
  };

  return (
    <Card style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }}>
          {/* Logo Area (Safe Initials Fallback) */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 'var(--font-size-2xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getInitial(job.company)}
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '4px', lineHeight: 1.2 }}>
              {job.title}
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-md)', fontWeight: 600 }}>
              {job.company}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button
            variant="secondary"
            icon={saved ? BookmarkCheck : Bookmark}
            onClick={() => toggleSaveJob(job)}
            style={{ color: saved ? 'var(--color-warning)' : undefined }}
          >
            {saved ? 'Saved' : 'Save Job'}
          </Button>

          <Button
            variant={currentStatus ? 'secondary' : 'secondary'}
            icon={currentStatus ? Check : Send}
            onClick={handleMarkApplied}
          >
            {currentStatus ? `Status: ${currentStatus}` : 'Mark as Applied'}
          </Button>

          <Button
            variant="primary"
            icon={ExternalLink}
            disabled={!job.applicationUrl}
            onClick={handleApplyClick}
          >
            {job.applicationUrl ? 'Apply Now' : 'Application Link Unavailable'}
          </Button>
        </div>
      </div>

      {/* Badges Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-lg)', alignItems: 'center' }}>
        <Badge variant="success" icon={CheckCircle2}>{job.experienceLevel || 'Entry Level'}</Badge>
        {job.category && <Badge variant="primary">{job.category}</Badge>}
        {job.jobType && <Badge variant="ghost">{job.jobType}</Badge>}
        {currentStatus && (
          <Badge variant={getStatusBadgeVariant(currentStatus)}>
            Application Tracker: {currentStatus}
          </Badge>
        )}
      </div>
    </Card>
  );
};
