import React from 'react';
import { Filter, RotateCcw, MapPin, Briefcase, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const JobFilter = ({
  filters,
  onFilterChange,
  onReset,
  totalResults = 0,
  source = ''
}) => {
  return (
    <div className="jt-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1rem' }}>Fresher Job Filters</h3>
          {source && (
            <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.7rem' }}>
              Source: {source}
            </span>
          )}
        </div>
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.35rem', fontSize: '0.75rem' }}
        >
          <RotateCcw size={14} /> Clear Filters
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {/* Fresher Category / Experience */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Fresher Category</label>
          <select
            className="select"
            value={filters.experience}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          >
            <option value="all">All Fresher Roles</option>
            <option value="fresher">Freshers (0 years)</option>
            <option value="trainee">Trainee Programs</option>
            <option value="intern">Internships</option>
          </select>
        </div>

        {/* Job Type */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Job Type</label>
          <select
            className="select"
            value={filters.jobType}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
          >
            <option value="all">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Trainee">Trainee</option>
            <option value="Graduate Program">Graduate Program</option>
          </select>
        </div>

        {/* Work Mode */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Work Mode</label>
          <select
            className="select"
            value={filters.workMode}
            onChange={(e) => onFilterChange('workMode', e.target.value)}
          >
            <option value="all">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Sort Listings By</label>
          <select
            className="select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="relevance">Relevance / Fit Score</option>
          </select>
        </div>
      </div>
    </div>
  );
};
