import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { JobCard } from '../../components/jobs/JobCard';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useApplications } from '../../context/ApplicationContext';
import { BookmarkX, Compass, Trash2 } from 'lucide-react';

export const SavedJobs = () => {
  const navigate = useNavigate();
  const { savedJobs, removeSavedJob, clearSavedJobs } = useSavedJobs();
  const { applications } = useApplications();

  return (
    <Container>
      <SectionHeader
        title="Saved Opportunities"
        subtitle="Manage your bookmarked job listings and track application status"
        action={
          savedJobs.length > 0 ? (
            <Button variant="secondary" size="sm" icon={Trash2} onClick={clearSavedJobs}>
              Clear All Saved Jobs
            </Button>
          ) : null
        }
      />

      {savedJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {savedJobs.map((job) => (
            <div key={job.id} style={{ position: 'relative' }}>
              <JobCard
                job={job}
                onViewDetails={(id) => navigate(`/jobs/${id}`)}
              />
            </div>
          ))}
        </div>
      ) : (
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-xl)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-elevated)',
            color: 'var(--color-text-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-md)',
            border: '1px solid var(--color-border)'
          }}>
            <BookmarkX size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>
            No saved opportunities yet
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '440px', margin: '0 auto var(--spacing-lg)', lineHeight: 1.5 }}>
            Save jobs you're interested in while browsing real opportunities and come back to review or apply to them later.
          </p>
          <Button variant="primary" icon={Compass} onClick={() => navigate('/jobs')}>
            Explore Real Jobs
          </Button>
        </Card>
      )}
    </Container>
  );
};
