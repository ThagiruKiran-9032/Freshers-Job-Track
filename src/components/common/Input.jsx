import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        {Icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-subtle)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`input ${className}`.trim()}
          style={Icon ? { paddingLeft: '40px' } : undefined}
          {...props}
        />
      </div>
      {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '2px' }}>{error}</span>}
      {helperText && !error && <span style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', marginTop: '2px' }}>{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
