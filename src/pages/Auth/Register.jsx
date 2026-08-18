import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { UserPlus, User, Mail, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, isAuthenticated } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/jobs';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    navigate(redirectUrl, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setFormError('Full Name is required.');
      return;
    }
    if (!cleanEmail) {
      setFormError('Email Address is required.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Confirm password does not match password.');
      return;
    }

    setSubmitting(true);
    const result = await register({ name: cleanName, email: cleanEmail, password });
    setSubmitting(false);

    if (result.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <Container style={{ maxWidth: '520px', padding: 'var(--spacing-2xl) var(--spacing-md)' }}>
      <Card style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid #c7d2fe' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)', display: 'inline-block' }}>
            <Logo size="lg" />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text)' }}>
            Create Candidate Account
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            Join JobTrack to manage your profile, saved jobs, and applications
          </p>
        </div>

        {/* Validation Error Card */}
        {formError && (
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            color: '#991b1b',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600
          }}>
            <AlertTriangle size={18} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input
                type="email"
                placeholder="candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Password (Min 6 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
                autoComplete="new-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            style={{ width: '100%', height: '44px', marginTop: 'var(--spacing-sm)', background: 'var(--gradient-primary)', border: 'none', fontSize: 'var(--font-size-md)' }}
          >
            {submitting ? 'Creating Account...' : 'Register Account'}
          </Button>
        </form>

        {/* Footer Link to Login */}
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Sign In Here
            </Link>
          </p>
        </div>
      </Card>

      {/* Security Note */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
        <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
        <span>Demo authentication using browser localStorage persistence</span>
      </div>
    </Container>
  );
};
