import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, Bell, UserCheck, LogOut, User } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = ({ onMobileToggle }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem('jt_theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jt_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-backdrop)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 80,
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      {/* Left side: Mobile hamburger & Global quick search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '480px' }}>
        <button
          onClick={onMobileToggle}
          className="btn btn-secondary btn-icon mobile-only"
          style={{ display: 'none' }}
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              placeholder="Search fresher jobs by title, skill, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-surface-elevated)' }}
            />
          </div>
        </form>
      </div>

      {/* Right side: User pill, notifications, theme & logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {/* User Account Quick Pill */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
          title="Click to view & update your Fresher Profile"
        >
          <User size={16} />
          <span>{currentUser?.name || 'My Profile'}</span>
        </div>

        {/* Notifications Icon */}
        <button
          className="btn btn-secondary btn-icon"
          style={{ borderRadius: 'var(--radius-full)', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--color-primary)',
            borderRadius: '50%'
          }} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          style={{ borderRadius: 'var(--radius-full)' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--color-warning)' }} /> : <Moon size={18} style={{ color: 'var(--color-primary)' }} />}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-icon"
          style={{ borderRadius: 'var(--radius-full)', color: 'var(--color-danger)' }}
          title="Sign Out of JobTrack"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
