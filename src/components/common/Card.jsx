import React from 'react';

export const Card = ({
  children,
  hover = false,
  className = '',
  style = {},
  onClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: isHovered && hover ? '1px solid var(--color-border-focus)' : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: isHovered && hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: isHovered && hover ? 'translateY(-2px)' : 'none',
        transition: 'all var(--transition-normal)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
      className={className}
    >
      {children}
    </div>
  );
};
