import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const JobSkills = ({ skills = [] }) => {
  if (!skills || skills.length === 0) return null;

  return (
    <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
      <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-md)' }}>
        Required & Mentioned Skills
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
        {skills.map((skill, idx) => (
          <Badge key={idx} variant="primary">{skill}</Badge>
        ))}
      </div>
    </Card>
  );
};
