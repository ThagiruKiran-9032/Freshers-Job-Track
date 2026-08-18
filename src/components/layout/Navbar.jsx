import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, User, Bookmark, FileText, LogOut, LogIn, UserPlus, ChevronDown
} from 'lucide-react';

/**
 * Generate user initials from full name dynamically (e.g. John Doe -> JD)
 */
export function getUserInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { savedJobs } = useSavedJobs();
  const { user, isAuthenticated, logout } = useAuth();
  const savedCount = savedJobs ? savedJobs.length : 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setMobileOpen(prev => !prev);
  const closeMobileMenu = () => {
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setDropdownOpen(false);
    navigate('/login');
  };

  const initials = user ? getUserInitials(user.name) : 'U';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Logo onClick={closeMobileMenu} />

        {/* Mobile Menu Toggle Button */}
        <button
          className="nav-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Navigation Bar Links & Controls */}
        <nav>
          <ul className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <li>
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end
              >
                Home
              </NavLink>
            </li>

            {isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/jobs"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Jobs
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/saved-jobs"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Saved Jobs
                    {savedCount > 0 && (
                      <span style={{
                        marginLeft: '6px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 800,
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#ffffff',
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)'
                      }}>
                        {savedCount}
                      </span>
                    )}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/resume"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Resume
                  </NavLink>
                </li>
              </>
            )}

            {/* Auth Controls & Dynamic Initials Circular Avatar Pill */}
            {isAuthenticated ? (
              <li style={{ position: 'relative' }} ref={dropdownRef}>
                <div
                  className="nav-avatar-pill"
                  onClick={() => setDropdownOpen(prev => !prev)}
                >
                  <div className="avatar-circle">
                    {initials}
                  </div>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text)' }}>
                    {user && user.name ? user.name.split(' ')[0] : 'User'}
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </div>

                {/* Avatar User Dropdown Menu */}
                {dropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', marginBottom: '4px' }}>
                      <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--color-text)' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{user.email}</div>
                    </div>

                    <NavLink
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="nav-dropdown-item"
                    >
                      <User size={15} style={{ color: 'var(--color-primary)' }} />
                      <span>My Candidate Profile</span>
                    </NavLink>

                    <NavLink
                      to="/saved-jobs"
                      onClick={closeMobileMenu}
                      className="nav-dropdown-item"
                    >
                      <Bookmark size={15} style={{ color: 'var(--color-info)' }} />
                      <span>Saved Opportunities</span>
                    </NavLink>

                    <NavLink
                      to="/resume"
                      onClick={closeMobileMenu}
                      className="nav-dropdown-item"
                    >
                      <FileText size={15} style={{ color: 'var(--color-success)' }} />
                      <span>Resume Builder</span>
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="nav-dropdown-item"
                      style={{ color: '#dc2626', borderTop: '1px solid var(--color-border)', marginTop: '4px', paddingTop: '8px' }}
                    >
                      <LogOut size={15} />
                      <span>Logout Account</span>
                    </button>
                  </div>
                )}
              </li>
            ) : (
              /* Unauthenticated Controls */
              <>
                <li>
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <LogIn size={15} />
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--gradient-primary)',
                      color: '#ffffff',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: 'var(--font-size-xs)',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                      textDecoration: 'none'
                    }}
                  >
                    <UserPlus size={15} />
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
