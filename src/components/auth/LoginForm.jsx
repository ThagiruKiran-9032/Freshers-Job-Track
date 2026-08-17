import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordField } from './PasswordField';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/authValidation';

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {authError && (
        <div style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--color-danger-bg)',
          border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-danger)',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{authError}</span>
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        placeholder="rahul.sharma@example.com"
        error={errors.email?.message}
        icon={Mail}
        {...register('email', {
          validate: value => validateEmail(value) || true
        })}
      />

      {/* Password Field */}
      <PasswordField
        label="Password"
        placeholder="••••••••••••"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required'
        })}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={LogIn}
        disabled={isSubmitting}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
          Register
        </Link>
      </div>
    </form>
  );
};
