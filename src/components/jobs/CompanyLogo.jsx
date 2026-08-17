import React, { useState, useEffect } from 'react';
import {
  resolveCompanyLogoUrl,
  getCompanyInitials,
  getCompanyColorStyle
} from '../../services/companyLogoService';

export const CompanyLogo = ({ companyName = 'Company', logoUrl, size = 52 }) => {
  const [imageFailed, setImageFailed] = useState(false);

  const resolvedUrl = resolveCompanyLogoUrl(companyName, logoUrl);

  // Reset image error state if company or logoUrl changes
  useEffect(() => {
    setImageFailed(false);
  }, [companyName, logoUrl]);

  const initials = getCompanyInitials(companyName);
  const colorStyle = getCompanyColorStyle(companyName);

  if (resolvedUrl && !imageFailed) {
    return (
      <div
        className="company-logo-container"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px',
          boxSizing: 'border-box'
        }}
      >
        <img
          src={resolvedUrl}
          alt={`${companyName} Logo`}
          onError={() => setImageFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    );
  }

  // Deterministic Fallback Avatar Badge
  return (
    <div
      className="company-logo-fallback"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: 'var(--radius-md)',
        background: colorStyle.bg,
        color: colorStyle.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: size > 40 ? '1.125rem' : '0.875rem',
        letterSpacing: '0.02em',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
        userSelect: 'none',
        flexShrink: 0
      }}
      title={companyName}
    >
      {initials}
    </div>
  );
};
