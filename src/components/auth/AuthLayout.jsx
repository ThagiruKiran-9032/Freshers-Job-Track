import React, { useState, useEffect } from 'react';
import { GraduationCap, Sun, Moon, ShieldCheck } from 'lucide-react';
import { Card } from '../common/Card';

export const AuthLayout = ({ children, title, subtitle }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('jt_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg-app)',
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Top Header Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          style={{ borderRadius: 'var(--radius-full)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--color-warning)' }} /> : <Moon size={18} style={{ color: 'var(--color-primary)' }} />}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-primary), #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <GraduationCap size={30} />
          </div>

          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
            JobTrack <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>Fresher</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Find. Apply. Track. Grow.
          </p>
        </div>

        {/* Form Card */}
        <Card glass style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.375rem', marginBottom: '0.35rem' }}>{title}</h2>
            {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
          </div>

          {children}
        </Card>

        {/* Security Statement */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.35rem'
        }}>
          <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
          <span>Local browser-authenticated account simulation</span>
        </div>
      </div>
    </div>
  );
};
