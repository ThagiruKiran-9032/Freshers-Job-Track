import React from 'react';
import { Card } from '../common/Card';
import { Info, ExternalLink } from 'lucide-react';

export const JobSource = ({ source = 'The Muse', applicationUrl }) => {
  return (
    <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
        <Info size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
            Job Source & Verification Notice
          </h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)', lineHeight: 1.5, marginBottom: 'var(--spacing-sm)' }}>
            This opportunity listing is published by <strong>{source}</strong> API. Job availability and requirements can change over time; please verify details on the official employer landing page before submitting your application.
          </p>
          {applicationUrl && (
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                color: 'var(--color-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              View original listing on {source} <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};
