import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Calendar, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { FitScoreBadge } from '../../components/jobs/FitScoreBadge';
import { CompanyLogo } from '../../components/jobs/CompanyLogo';
import { fetchJobById, cacheJobInService } from '../../services/jobService';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useProfile } from '../../context/ProfileContext';
import { calculateFresherFitScore } from '../../utils/jobMatcher';
import { Skeleton } from '../../components/common/Skeleton';

export const JobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { isJobSaved, toggleSaveJob } = useSavedJobs();

  // Initialize from router state if available
  const passedJob = location.state?.job;
  const [job, setJob] = useState(passedJob || null);
  const [loading, setLoading] = useState(!passedJob);

  useEffect(() => {
    if (passedJob) {
      cacheJobInService(passedJob);
      setJob(passedJob);
      setLoading(false);
      return;
    }

    const loadDetail = async () => {
      setLoading(true);
      try {
        const found = await fetchJobById(id);
        setJob(found);
      } catch (err) {
        console.error('Error loading job details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id, passedJob]);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <Skeleton width="120px" height="36px" style={{ marginBottom: '1.5rem' }} />
        <Card style={{ padding: '2rem' }}>
          <Skeleton width="60%" height="32px" style={{ marginBottom: '1rem' }} />
          <Skeleton width="30%" height="20px" style={{ marginBottom: '2rem' }} />
          <Skeleton width="100%" height="200px" />
        </Card>
      </div>
    );
  }

  if (!job) return null;

  const saved = isJobSaved(job.id);
  const fitData = calculateFresherFitScore(profile, job);

  return (
    <div className="page-container fade-in">
      {/* Top Back Navigation */}
      <Link to="/jobs" style={{ textDecoration: 'none', marginBottom: '1.5rem', display: 'inline-block' }}>
        <Button variant="secondary" size="sm" icon={ArrowLeft}>Back to Job Listings</Button>
      </Link>

      {/* Main Job Hero Header Card */}
      <Card style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <CompanyLogo companyName={job.company} logoUrl={job.companyLogo} size={72} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>{job.title}</h1>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: 600 }}>{job.company}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant={saved ? 'secondary' : 'outline'}
              icon={saved ? BookmarkCheck : Bookmark}
              onClick={() => toggleSaveJob(job)}
              style={saved ? { color: 'var(--color-warning)' } : undefined}
            >
              {saved ? 'Saved' : 'Save Job'}
            </Button>

            <Button
              variant="primary"
              icon={ExternalLink}
              onClick={() => window.open(job.applyUrl, '_blank')}
            >
              Apply Now
            </Button>
          </div>
        </div>

        {/* Status Badges & Fit Score */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '1.5rem', alignItems: 'center' }}>
          <FitScoreBadge fitData={fitData} />
          {job.isFresherFriendly && (
            <Badge variant="success" icon={CheckCircle2}>Fresher Friendly Candidate Verified</Badge>
          )}
          {job.jobType && <Badge variant="primary">{job.jobType}</Badge>}
          {job.workMode && <Badge variant="info">{job.workMode}</Badge>}
        </div>

        {/* Key Info Banner Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          padding: '1.25rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '2px' }}>LOCATION</span>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={16} /> {job.location}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '2px' }}>SALARY BAND</span>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: job.salary === 'Salary not disclosed' ? 'var(--text-subtle)' : 'var(--color-success)' }}><DollarSign size={16} /> {job.salary}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '2px' }}>EXPERIENCE REQUIRED</span>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Briefcase size={16} /> {job.experienceLevel}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'block', marginBottom: '2px' }}>POSTED DATE</span>
            <span style={{ fontWeight: 600, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={16} /> Posted {job.postedDate}</span>
          </div>
        </div>
      </Card>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Job Description & Specs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Job Overview</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9375rem', whiteSpace: 'pre-line' }}>
              {job.description}
            </p>
          </Card>

          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Key Qualifications & Requirements</h3>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.625rem', lineHeight: 1.6 }}>
              {(job.requirements || []).map((req, idx) => (
                <li key={idx} style={{ fontSize: '0.9375rem' }}>{req}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Perks & Benefits</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(job.benefits || []).map((b, idx) => (
                <span key={idx} className="badge badge-success" style={{ padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}>
                  <ShieldCheck size={14} /> {b}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Required Skills & Company Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Required Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(job.skills || []).map((skill, idx) => (
                <span key={idx} className="badge badge-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8125rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
              About {job.company}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {job.company} is an active employer seeking enthusiastic entry-level talent for immediate hiring.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
