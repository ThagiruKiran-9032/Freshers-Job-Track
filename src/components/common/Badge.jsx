import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  style = {}
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
        return { bg: 'var(--badge-green-bg)', color: 'var(--badge-green-text)', border: '1px solid #a7f3d0' };
      case 'warning':
        return { bg: 'var(--badge-amber-bg)', color: 'var(--badge-amber-text)', border: '1px solid #fde68a' };
      case 'error':
        return { bg: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' };
      case 'info':
        return { bg: 'var(--badge-blue-bg)', color: 'var(--badge-blue-text)', border: '1px solid #bae6fd' };
      case 'purple':
        return { bg: 'var(--badge-purple-bg)', color: 'var(--badge-purple-text)', border: '1px solid #e9d5ff' };
      case 'pink':
        return { bg: 'var(--badge-pink-bg)', color: 'var(--badge-pink-text)', border: '1px solid #fbcfe8' };
      case 'ghost':
        return { bg: 'var(--color-surface-elevated)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' };
      case 'primary':
      default:
        return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)', border: '1px solid #c7d2fe' };
    }
  };

  const { bg, color, border } = getBadgeColors();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        color: color,
        border,
        lineHeight: 1.2,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...style
      }}
      className={className}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
