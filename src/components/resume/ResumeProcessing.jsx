import React from 'react';
import { CheckCircle2, Loader2, FileSearch, Cpu, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';

export const ResumeProcessing = ({ currentStep = 0 }) => {
  const steps = [
    { title: 'Reading PDF document', desc: 'Parsing binary stream with PDF.js' },
    { title: 'Extracting page text & metadata', desc: 'Preserving text flow & content items' },
    { title: 'Segmenting sections & skills taxonomy', desc: 'Identifying education, skills, and projects' },
    { title: 'Building structured fresher profile', desc: 'Generating match metrics & confidence ratings' }
  ];

  return (
    <Card glass style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        animation: 'spin 2s linear infinite'
      }}>
        <Cpu size={32} />
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Analyzing Your Resume...</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        JobTrack is extracting your skills, education, and projects to automatically build your candidate profile.
      </p>

      {/* Steps List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.875rem 1.25rem',
                backgroundColor: isCurrent ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
                border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isDone ? (
                  <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
                ) : isCurrent ? (
                  <Loader2 size={20} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-subtle)' }} />
                )}
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: isCurrent ? 'var(--color-primary)' : 'var(--text-main)' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
