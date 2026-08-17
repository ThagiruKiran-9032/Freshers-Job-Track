import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Kanban,
  Video,
  Bookmark,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useApplications, APPLICATION_STAGES } from '../../context/ApplicationContext';
import { useInterviews } from '../../context/InterviewContext';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { FitScoreBadge } from '../../components/jobs/FitScoreBadge';
import { mockJobsData } from '../../data/mockJobs';
import { calculateFresherFitScore } from '../../utils/jobMatcher';
import { JobCard } from '../../components/jobs/JobCard';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, completeness } = useProfile();
  const { applications } = useApplications();
  const { interviews } = useInterviews();
  const { savedJobs } = useSavedJobs();

  // Top 3 Recommended Jobs sorted by Fit Score
  const recommendedJobs = [...mockJobsData]
    .map(job => ({
      job,
      fitData: calculateFresherFitScore(profile, job)
    }))
    .sort((a, b) => b.fitData.overallScore - a.fitData.overallScore)
    .slice(0, 3);

  const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming');

  return (
    <div className="page-container fade-in">
      {/* Welcome Banner */}
      <Card glass style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.875rem' }}>Welcome back, {profile.personal.fullName.split(' ')[0]}! 👋</h1>
              <Badge variant="primary" icon={Sparkles}>Fresher Candidate</Badge>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '600px' }}>
              {profile.personal.headline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" icon={UserCheck} onClick={() => navigate('/profile')}>
              Update Profile ({completeness}%)
            </Button>
            <Button variant="primary" icon={Briefcase} onClick={() => navigate('/jobs')}>
              Find Jobs
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <Card hover onClick={() => navigate('/applications')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE APPLICATIONS</span>
            <Kanban size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{applications.length}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>In Pipeline →</span>
        </Card>

        <Card hover onClick={() => navigate('/interviews')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>UPCOMING INTERVIEWS</span>
            <Video size={20} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-warning)' }}>
            {upcomingInterviews.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)' }}>Rounds Scheduled →</span>
        </Card>

        <Card hover onClick={() => navigate('/saved-jobs')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>SAVED SHORTLIST</span>
            <Bookmark size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}>
            {savedJobs.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>Bookmarked Jobs →</span>
        </Card>

        <Card hover onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>PROFILE COMPLETENESS</span>
            <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--color-success)' }}>
            {completeness}%
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)' }}>Fresher Fit Accuracy →</span>
        </Card>
      </div>

      {/* Main Grid: Recommended Jobs & Pipeline Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Recommended Jobs Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--color-warning)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Recommended for You</h2>
            </div>
            <Button variant="secondary" size="sm" icon={ArrowRight} onClick={() => navigate('/jobs')}>
              View All Jobs
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendedJobs.map(({ job }) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Upcoming Interviews Widget */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} style={{ color: 'var(--color-warning)' }} />
                Next Interview
              </h3>
              <Button variant="secondary" size="sm" onClick={() => navigate('/interviews')}>All</Button>
            </div>

            {upcomingInterviews.length > 0 ? (
              <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  {upcomingInterviews[0].jobTitle}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {upcomingInterviews[0].company} • <Badge variant="warning">{upcomingInterviews[0].roundType}</Badge>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> {upcomingInterviews[0].date} at {upcomingInterviews[0].time}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No upcoming interviews scheduled.</p>
            )}
          </Card>

          {/* Application Pipeline Overview Widget */}
          <Card>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Application Pipeline Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {APPLICATION_STAGES.slice(1, 6).map(stage => {
                const count = applications.filter(a => a.status === stage.id).length;
                return (
                  <div key={stage.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: stage.color }} />
                      <span style={{ fontWeight: 500 }}>{stage.label}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Skill Snapshot Bar Widget */}
          <Card>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Fresher Skill Snapshot</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { name: 'React.js & Frontend', level: 90 },
                { name: 'JavaScript (ES6+)', level: 85 },
                { name: 'HTML & CSS Design System', level: 95 },
                { name: 'Git & REST APIs', level: 80 }
              ].map((s, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>{s.name}</span>
                    <span style={{ color: 'var(--color-primary)' }}>{s.level}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${s.level}%`, height: '100%', backgroundColor: 'var(--color-primary)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
