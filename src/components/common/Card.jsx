import React from 'react';

export const Card = ({
  children,
  variant = 'default',
  hover = false,
  glass = false,
  className = '',
  ...props
}) => {
  const hoverClass = hover ? 'jt-card-hover' : '';
  const glassClass = glass ? 'jt-card-glass' : '';

  return (
    <div className={`jt-card ${hoverClass} ${glassClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
