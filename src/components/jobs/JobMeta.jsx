import React from 'react';
import { MapPin, DollarSign, Briefcase, Calendar, Tag } from 'lucide-react';

export const JobMeta = ({ job }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-surface-elevated)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      marginBottom: 'var(--spacing-lg)'
    }}>
      <div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
          LOCATION
        </span>
        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} style={{ color: 'var(--color-primary)' }} /> {job.location || 'Location not listed'}
        </span>
      </div>

      <div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
          SALARY BAND
        </span>
        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
          <DollarSign size={14} /> Salary not listed
        </span>
      </div>

      <div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
          EXPERIENCE REQUIRED
        </span>
        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Briefcase size={14} /> {job.experienceLevel || 'Entry Level'}
        </span>
      </div>

      <div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
          JOB CATEGORY
        </span>
        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Tag size={14} /> {job.category || 'Technology'}
        </span>
      </div>

      <div>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', display: 'block', marginBottom: '2px', fontWeight: 600 }}>
          POSTED DATE
        </span>
        <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Calendar size={14} /> {job.postedDate || 'Date not listed'}
        </span>
      </div>
    </div>
  );
};
