import React, { useState } from 'react';
import { FileText, Plus, ExternalLink, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';

const defaultResumes = [
  {
    id: 'res-1',
    name: 'Frontend Developer Resume (2026)',
    targetRole: 'React / Frontend Developer',
    updatedDate: '2026-08-10',
    fileLink: 'https://example.com/resumes/frontend-rahul.pdf',
    isPrimary: true
  },
  {
    id: 'res-2',
    name: 'General Fresher CS Resume',
    targetRole: 'Software Trainee / GET',
    updatedDate: '2026-08-01',
    fileLink: 'https://example.com/resumes/cs-rahul.pdf',
    isPrimary: false
  }
];

export const ResumeManager = () => {
  const [resumes, setResumes] = useLocalStorage('jt_resumes', defaultResumes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [fileLink, setFileLink] = useState('');

  const handleAddResume = (e) => {
    e.preventDefault();
    const newRes = {
      id: `res-${Date.now()}`,
      name,
      targetRole: targetRole || 'Software Developer',
      updatedDate: new Date().toISOString().split('T')[0],
      fileLink: fileLink || 'https://example.com/resume.pdf',
      isPrimary: resumes.length === 0
    };
    setResumes([newRes, ...resumes]);
    setName('');
    setTargetRole('');
    setFileLink('');
    setIsModalOpen(false);
  };

  const handleSetPrimary = (id) => {
    setResumes(resumes.map(r => ({
      ...r,
      isPrimary: r.id === id
    })));
  };

  const handleDelete = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  return (
    <Card style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ fontSize: '1.125rem' }}>Fresher Resume Versions</h3>
        </div>
        <Button variant="secondary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add Resume Version
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {resumes.map((res) => (
          <div
            key={res.id}
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: res.isPrimary ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{res.name}</h4>
                {res.isPrimary && <Badge variant="primary" icon={CheckCircle2}>Default</Badge>}
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Target: {res.targetRole}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}>
                <Clock size={12} /> Updated {res.updatedDate}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <Button variant="secondary" size="sm" icon={ExternalLink} style={{ flex: 1 }} onClick={() => window.open(res.fileLink, '_blank')}>
                Preview
              </Button>
              {!res.isPrimary && (
                <Button variant="outline" size="sm" onClick={() => handleSetPrimary(res.id)}>
                  Set Default
                </Button>
              )}
              <button className="btn btn-danger btn-icon" onClick={() => handleDelete(res.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Resume Version">
        <form onSubmit={handleAddResume}>
          <Input
            label="Resume Label / Title"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="e.g. React Developer Resume v2"
          />
          <Input
            label="Target Job Role"
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
          <Input
            label="File URL / Cloud Drive Link"
            value={fileLink}
            onChange={e => setFileLink(e.target.value)}
            placeholder="Google Drive, Dropbox, or PDF link..."
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Add Resume</Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
