import React from 'react';
import { Card } from '../common/Card';

export const JobDescription = ({ description }) => {
  return (
    <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
        Job Overview & Details
      </h3>
      <div style={{
        color: 'var(--color-text-muted)',
        lineHeight: 1.7,
        fontSize: 'var(--font-size-sm)',
        whiteSpace: 'pre-line'
      }}>
        {description || 'Job description details are available on the employer application page.'}
      </div>
    </Card>
  );
};
