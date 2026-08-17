import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Laptop, Bell, Briefcase, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useProfile } from '../../context/ProfileContext';

export const Settings = () => {
  const { profile, updatePreferences } = useProfile();

  const [theme, setTheme] = useState(() => localStorage.getItem('jt_theme') || 'dark');
  const [interviewReminders, setInterviewReminders] = useState(true);
  const [followUpAlerts, setFollowUpAlerts] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jt_theme', theme);
  }, [theme]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset demo data back to defaults?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="page-container fade-in">
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '85px',
          right: '24px',
          backgroundColor: 'var(--color-success)',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 100
        }}>
          <CheckCircle2 size={18} />
          <span>Platform preferences updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Platform Settings ⚙️</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Customize appearance, notification alerts, and default search preferences.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Appearance & Themes Card */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun size={20} style={{ color: 'var(--color-warning)' }} />
            Appearance & Theme Mode
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Sleek dark theme surface' },
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Bright slate theme surface' }
            ].map(t => {
              const IconComponent = t.icon;
              const isSelected = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <IconComponent size={20} style={{ color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-main)' }}>{t.label}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Notifications & Reminders Card */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} style={{ color: 'var(--color-primary)' }} />
            Notification Preferences
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Interview Reminders</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Show notifications for upcoming interview rounds</div>
              </div>
              <input
                type="checkbox"
                checked={interviewReminders}
                onChange={e => setInterviewReminders(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.75rem', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Recruiter Follow-up Alerts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Notify when follow-up dates are reached</div>
              </div>
              <input
                type="checkbox"
                checked={followUpAlerts}
                onChange={e => setFollowUpAlerts(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
            </label>
          </div>
        </Card>

        {/* Data Reset Danger Zone */}
        <Card style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--color-danger)' }}>Data Reset</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Clear local storage and reset profile, saved jobs, and applications back to fresh defaults.
          </p>
          <Button type="button" variant="danger" icon={RefreshCw} onClick={handleResetData}>
            Reset Local Application Data
          </Button>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" size="lg">Save Settings</Button>
        </div>
      </form>
    </div>
  );
};
