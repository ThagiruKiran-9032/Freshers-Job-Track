import React from 'react';

/**
 * JobResultCount component — Formats and displays the real API job count
 */
export const JobResultCount = ({ total = 0, loading = false, page = 1, pageCount = 1, pageJobsCount = 0 }) => {
  if (loading) {
    return (
      <div style={{
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-muted)',
        fontWeight: 500
      }}>
        Loading opportunities from real IT job service...
      </div>
    );
  }

  const formattedTotal = Number(total || 0).toLocaleString();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 'var(--spacing-md)',
      marginBottom: 'var(--spacing-md)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', fontWeight: 700 }}>
        Total Jobs Found: <span style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: 'var(--font-size-md)', marginLeft: '4px' }}>{formattedTotal}</span> Opportunities
      </div>
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
        Showing {pageJobsCount} on Page <strong>{page}</strong> of <strong>{pageCount}</strong>
      </div>
    </div>
  );
};
