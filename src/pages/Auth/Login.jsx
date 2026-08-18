import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import { LogIn, Mail, Lock, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/jobs';
  const registeredNotice = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect immediately
  if (isAuthenticated) {
    navigate(redirectUrl, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setFormError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setSubmitting(true);
    const result = await login({ email: cleanEmail, password });
    setSubmitting(false);

    if (result.success) {
      navigate(redirectUrl, { replace: true });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <Container style={{ maxWidth: '480px', padding: 'var(--spacing-2xl) var(--spacing-md)' }}>
      <Card style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid #c7d2fe' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ marginBottom: 'var(--spacing-md)', display: 'inline-block' }}>
            <Logo size="lg" />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--spacing-xs)', color: 'var(--color-text)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
            Sign in to access your candidate workspace & fresher jobs
          </p>
        </div>

        {/* Registration Success Banner */}
        {registeredNotice && (
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--badge-green-bg)',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            color: 'var(--color-success)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>Registration successful! Please log in with your credentials.</span>
          </div>
        )}

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
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
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: 'var(--radius-md)' }}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            style={{ width: '100%', height: '44px', background: 'var(--gradient-primary)', border: 'none', fontSize: 'var(--font-size-md)' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to JobTrack'}
          </Button>
        </form>

        {/* Footer Link to Register */}
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirectUrl)}`} style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>
              Register Candidate Account
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
