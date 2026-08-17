import React, { useState } from 'react';
import { Sparkles, Check, AlertTriangle, Info } from 'lucide-react';
import { Modal } from '../common/Modal';

export const FitScoreBadge = ({ fitData, compact = false }) => {
  const [showModal, setShowModal] = useState(false);
  const { overallScore, scoreColor, breakdown } = fitData || {
    overallScore: 85,
    scoreColor: 'var(--color-success)',
    breakdown: { skillMatch: true, experienceMatch: true, roleMatch: true, locationMatch: true, salaryMatch: true }
  };

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: compact ? '0.2rem 0.5rem' : '0.35rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: `${scoreColor}18`,
          color: scoreColor,
          border: `1px solid ${scoreColor}40`,
          fontSize: compact ? '0.75rem' : '0.8125rem',
          fontWeight: 700,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease'
        }}
        title="Fresher Fit Score — Click for match details"
      >
        <Sparkles size={compact ? 12 : 14} />
        <span>{overallScore}% Match</span>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Fresher Fit Score Breakdown"
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: scoreColor,
            fontFamily: 'var(--font-heading)',
            lineHeight: 1
          }}>
            {overallScore}%
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Estimated Candidate-to-Job Fit Rating
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Fresher / Entry-Level Suitability', matched: breakdown.experienceMatch, weight: '30%' },
            { label: 'Technical & Tool Skills Overlap', matched: breakdown.skillMatch, weight: '30%' },
            { label: 'Target Job Role Match', matched: breakdown.roleMatch, weight: '20%' },
            { label: 'Location & Work Mode Match', matched: breakdown.locationMatch, weight: '10%' },
            { label: 'Salary Expectation Range', matched: breakdown.salaryMatch, weight: '10%' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: item.matched ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                  color: item.matched ? 'var(--color-success)' : 'var(--color-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.matched ? <Check size={14} /> : <AlertTriangle size={14} />}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Weight: {item.weight}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', padding: '0.875rem', backgroundColor: 'var(--color-info-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-info)', fontSize: '0.8125rem', display: 'flex', gap: '0.5rem' }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Tip: Update your skills and preferred job titles in your <strong>Career Profile</strong> to increase match scores across job listings!</span>
        </div>
      </Modal>
    </>
  );
};
