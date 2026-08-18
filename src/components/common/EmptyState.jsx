import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export const EmptyState = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  icon: Icon,
  actionText,
  onAction,
  style = {}
}) => {
  return (
    <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-xl)', ...style }}>
      {Icon && (
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-elevated)',
          color: 'var(--color-text-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-md)'
        }}>
          <Icon size={28} />
        </div>
      )}
      <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-xs)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', maxWidth: '440px', margin: '0 auto var(--spacing-lg)', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Card>
  );
};
