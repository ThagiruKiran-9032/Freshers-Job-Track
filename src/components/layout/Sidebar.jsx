import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Bookmark,
  Kanban,
  Video,
  Calendar,
  BarChart3,
  BookOpen,
  User,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navGroups = [
    {
      title: 'DISCOVERY',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Find Jobs', path: '/jobs', icon: Search, badge: 'Real API' },
        { label: 'Saved Jobs', path: '/saved-jobs', icon: Bookmark }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Pipeline Board', path: '/applications', icon: Kanban },
        { label: 'Interviews', path: '/interviews', icon: Video },
        { label: 'Calendar', path: '/calendar', icon: Calendar }
      ]
    },
    {
      title: 'CAREER TOOLS',
      items: [
        { label: 'Resume Center', path: '/resumes', icon: FileText, highlight: true },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Career Profile', path: '/profile', icon: User },
        { label: 'Fresher Guides', path: '/resources', icon: BookOpen }
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 90
          }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        style={{
          width: collapsed ? '80px' : '260px',
          minWidth: collapsed ? '80px' : '260px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 95,
          userSelect: 'none'
        }}
        className={`sidebar ${mobileOpen ? 'mobile-show' : ''}`}
      >
        {/* Brand Header */}
        <div style={{
          height: '70px',
          padding: '0 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary), #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <GraduationCap size={22} />
            </div>
            {!collapsed && (
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  JobTrack <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>Fresher</span>
                </div>
              </div>
            )}
          </NavLink>
        </div>

        {/* Navigation Section Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} style={{ marginBottom: '1.5rem' }}>
              {!collapsed && (
                <div style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--text-subtle)',
                  padding: '0 0.75rem 0.5rem',
                  letterSpacing: '0.08em'
                }}>
                  {group.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {group.items.map((item, iIdx) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={iIdx}
                      to={item.path}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        padding: '0.625rem 0.875rem',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                        backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.875rem',
                        transition: 'all 0.15s ease'
                      })}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <IconComponent size={20} />
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-accent-light)',
                          color: 'var(--color-accent)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          {item.badge}
                        </span>
                      )}
                      {!collapsed && item.highlight && (
                        <Sparkles size={14} style={{ color: 'var(--color-warning)' }} />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Collapse Footer Toggle */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-end'
        }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-secondary btn-icon"
            style={{ borderRadius: 'var(--radius-full)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};
