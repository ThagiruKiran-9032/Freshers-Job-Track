import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Sparkles } from 'lucide-react';

export const Logo = ({ size = 'md', onClick, showTag = true, className = '' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconBoxSize = isSm ? '32px' : isLg ? '48px' : '38px';
  const iconSize = isSm ? 16 : isLg ? 24 : 19;
  const fontSize = isSm ? '1.1rem' : isLg ? '1.6rem' : '1.3rem';

  return (
    <NavLink
      to="/"
      onClick={onClick}
      className={`logo-brand ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        userSelect: 'none'
      }}
    >
      {/* Brand Icon Box */}
      <div style={{
        width: iconBoxSize,
        height: iconBoxSize,
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
        flexShrink: 0,
        position: 'relative'
      }}>
        <Briefcase size={iconSize} />
        <Sparkles size={iconSize / 2} style={{ position: 'absolute', top: '2px', right: '2px', color: '#fef08a' }} />
      </div>

      {/* Brand Text & Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize,
          fontWeight: 800,
          color: 'var(--color-text)',
          letterSpacing: '-0.03em',
          lineHeight: 1
        }}>
          JobTrack
        </span>
        {showTag && (
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 7px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            color: '#4f46e5',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            Freshers
          </span>
        )}
      </div>
    </NavLink>
  );
};
