import React, { useState } from 'react';
import { Bookmark, Search, Trash2 } from 'lucide-react';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { JobCard } from '../../components/jobs/JobCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const SavedJobs = () => {
  const { savedJobs } = useSavedJobs();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = savedJobs.filter(job => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Saved Jobs Shortlist ⭐</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage your bookmarked fresher job listings before submitting applications.
        </p>
      </div>

      {savedJobs.length > 0 && (
        <div style={{ marginBottom: '1.5rem', maxWidth: '450px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search in saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>
        </div>
      )}

      {filteredJobs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="jt-card empty-state">
          <Bookmark className="empty-state-icon" />
          <h3 className="empty-state-title">No Saved Jobs Yet</h3>
          <p className="empty-state-desc">
            You haven't bookmarked any fresher job listings yet. Click the bookmark icon on any job card to add it to your personal shortlist!
          </p>
        </div>
      )}
    </div>
  );
};
