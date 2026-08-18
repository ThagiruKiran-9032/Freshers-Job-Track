import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useJob } from '../../hooks/useJob';
import { JobHeader } from '../../components/jobs/JobHeader';
import { JobMeta } from '../../components/jobs/JobMeta';
import { JobDescription } from '../../components/jobs/JobDescription';
import { JobSkills } from '../../components/jobs/JobSkills';
import { JobSource } from '../../components/jobs/JobSource';
import { ArrowLeft, AlertTriangle, Compass } from 'lucide-react';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { job, loading, error, retry } = useJob(id);

  const handleBack = () => {
    navigate(-1); // Return to previous browsing location with active filters preserved
  };

  if (loading) {
    return (
      <Container>
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={handleBack}>
            Back to Jobs
          </Button>
        </div>
        {/* Loading Skeleton */}
        <Card style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-md)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-elevated)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '60%', height: '24px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }} />
              <div style={{ width: '35%', height: '16px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          </div>
          <div style={{ width: '100%', height: '40px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-md)' }} />
        </Card>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container>
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={handleBack}>
            Back to Jobs
          </Button>
        </div>
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-xl)' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-error-bg)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-md)'
          }}>
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>
            Opportunity Not Found
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '440px', margin: '0 auto var(--spacing-lg)', lineHeight: 1.5 }}>
            {error || 'This job listing may have been removed or is no longer available.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/jobs')}>
              Back to Jobs
            </Button>
            <Button variant="primary" onClick={retry}>
              Retry Request
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {/* Back Navigation preserving context */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={handleBack}>
          Back to Jobs
        </Button>
      </div>

      {/* Prominent Job Header */}
      <JobHeader job={job} />

      {/* Job Metadata Banner Grid */}
      <JobMeta job={job} />

      {/* Main Details Section Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {/* Left Column: Description */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <JobDescription description={job.description} />
        </div>

        {/* Right Column: Skills & Source Attribution */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <JobSkills skills={job.skills} />
          <JobSource source={job.source} applicationUrl={job.applicationUrl} />
        </div>
      </div>
    </Container>
  );
};
