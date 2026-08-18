import React from 'react';

export const SectionHeader = ({
  title,
  subtitle,
  badgeText,
  action,
  style = {}
}) => {
  return (
    <div style={{ marginBottom: 'var(--spacing-lg)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
            <h2 style={{ fontSize: 'var(--font-size-xl)' }}>{title}</h2>
            {badgeText && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
