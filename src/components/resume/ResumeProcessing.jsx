import React from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, Loader2 } from 'lucide-react';

export const ResumeProcessing = ({ stage = 'reading' }) => {
  const stages = [
    { id: 'reading', label: 'Reading resume file' },
    { id: 'extracting', label: 'Extracting text content' },
    { id: 'parsing', label: 'Detecting sections & collecting skills' },
    { id: 'completed', label: 'Building candidate profile' }
  ];

  const getStageStatus = (stageId) => {
    const stageOrder = ['reading', 'extracting', 'parsing', 'completed'];
    const currentIndex = stageOrder.indexOf(stage);
    const itemIndex = stageOrder.indexOf(stageId);

    if (itemIndex < currentIndex) return 'completed';
    if (itemIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <Card style={{ padding: 'var(--spacing-2xl) var(--spacing-xl)', textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>
        Analyzing Resume Content...
      </h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-xl)' }}>
        Processing PDF/DOCX file locally in your browser
      </p>

      <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {stages.map((st) => {
          const status = getStageStatus(st.id);
          return (
            <div
              key={st.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: status === 'active' ? 'var(--color-primary-light)' : 'var(--color-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: status === 'active' ? 'var(--color-primary)' : 'var(--color-border)'
              }}
            >
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: status === 'active' ? 700 : 500 }}>
                {st.label}
              </span>
              {status === 'completed' && <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />}
              {status === 'active' && <Loader2 size={18} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
