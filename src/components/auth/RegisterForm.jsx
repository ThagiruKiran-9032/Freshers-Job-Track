import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { PasswordField } from './PasswordField';
import { useAuth } from '../../hooks/useAuth';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from '../../utils/authValidation';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerAuth } = useAuth();

  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        password: data.password
      });

      // Redirect directly to dashboard with Welcome Resume Onboarding Modal active
      navigate('/', { replace: true });
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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

      {/* Full Name */}
      <Input
        label="Full Name"
        placeholder="e.g. Rahul Sharma"
        error={errors.name?.message}
        icon={User}
        {...register('name', {
          validate: value => validateName(value) || true
        })}
      />

      {/* Email Address */}
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

      {/* Password */}
      <div>
        <PasswordField
          label="Password"
          placeholder="••••••••••••"
          error={errors.password?.message}
          {...register('password', {
            validate: value => validatePassword(value) || true
          })}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px', lineHeight: '1.4' }}>
          Must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.
        </div>
      </div>

      {/* Confirm Password */}
      <PasswordField
        label="Confirm Password"
        placeholder="••••••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          validate: value => validateConfirmPassword(watchPassword, value) || true
        })}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        icon={UserPlus}
        disabled={isSubmitting}
        style={{ width: '100%', marginTop: '0.5rem' }}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Footer Link */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
          Log In
        </Link>
      </div>
    </form>
  );
};
