import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  icon: Icon,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border-hover)',
          boxShadow: 'var(--shadow-sm)'
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          border: '1px solid transparent'
        };
      case 'primary':
      default:
        return {
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 14px', fontSize: 'var(--font-size-xs)' };
      case 'lg':
        return { padding: '12px 26px', fontSize: 'var(--font-size-md)' };
      case 'md':
      default:
        return { padding: '9px 18px', fontSize: 'var(--font-size-sm)' };
    }
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        ...getVariantStyle(),
        ...getSizeStyle(),
        ...style
      }}
      className={className}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};
