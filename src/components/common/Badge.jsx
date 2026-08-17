import React from 'react';

export const Badge = ({
  children,
  variant = 'primary',
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} {...props}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};
