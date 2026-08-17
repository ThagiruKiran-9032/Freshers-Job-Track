import React from 'react';
import { FileText, Download, CheckCircle2, Trash2, Star, Upload, ShieldCheck, Clock } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const ResumeCenter = ({ onUploadClick }) => {
  const { resumesList, downloadResume, setPrimaryResume, deleteResume } = useResume();

  return (
    <Card style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={22} style={{ color: 'var(--color-primary)' }} />
          <div>
            <h3 style={{ fontSize: '1.125rem' }}>Resume Storage Center</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stored locally in browser IndexedDB database</p>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={Upload} onClick={onUploadClick}>
          Upload New Resume
        </Button>
      </div>

      {resumesList.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {resumesList.map((res) => {
            const sizeMb = (res.size / (1024 * 1024)).toFixed(1);
            return (
              <div
                key={res.id}
                style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: res.isPrimary ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{res.name}</h4>
                    </div>
                    {res.isPrimary && <Badge variant="primary" icon={CheckCircle2}>Primary</Badge>}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <span>PDF • {sizeMb} MB</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {res.uploadDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.875rem' }}>
                  <Button variant="secondary" size="sm" icon={Download} style={{ flex: 1 }} onClick={() => downloadResume(res.id)}>
                    Download
                  </Button>
                  {!res.isPrimary && (
                    <Button variant="outline" size="sm" icon={Star} onClick={() => setPrimaryResume(res.id)}>
                      Make Primary
                    </Button>
                  )}
                  <button className="btn btn-danger btn-icon" onClick={() => deleteResume(res.id)} title="Delete File">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>No PDF resume files stored in your local browser database yet.</p>
          <Button variant="primary" size="sm" icon={Upload} onClick={onUploadClick}>
            Upload Resume PDF
          </Button>
        </div>
      )}
    </Card>
  );
};
