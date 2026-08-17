import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const PasswordField = forwardRef(({
  label = 'Password',
  error,
  id,
  placeholder = '••••••••••••',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'password');

  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">
        {label}
      </label>
      <div style={{ position: 'relative', width: '100%' }}>
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
          <Lock size={18} />
        </div>

        <input
          ref={ref}
          id={fieldId}
          type={showPassword ? 'text' : 'password'}
          className="input"
          style={{ paddingLeft: '40px', paddingRight: '40px' }}
          placeholder={placeholder}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-subtle)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <span style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: '2px' }}>{error}</span>}
    </div>
  );
});

PasswordField.displayName = 'PasswordField';
