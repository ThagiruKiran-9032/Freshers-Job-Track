import React, { useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Upload, FileText, X, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

export const ResumeUploader = ({
  file,
  error,
  onFileSelect,
  onProcess,
  onReset
}) => {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Zone */}
      <Card
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          padding: 'var(--spacing-2xl) var(--spacing-xl)',
          textAlign: 'center',
          border: '2px dashed var(--color-primary)',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, rgba(124, 58, 237, 0.06) 100%)',
          cursor: 'pointer',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--gradient-primary)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-md)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Upload size={32} />
        </div>

        <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--spacing-xs)' }}>
          Upload your resume file
        </h3>

        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', fontWeight: 500, marginBottom: 'var(--spacing-lg)' }}>
          Drag & drop your PDF or DOCX file here, or click to browse (Max size: 5MB)
        </p>

        {file ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-primary)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <FileText size={22} style={{ color: 'var(--color-primary)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text)' }}>{file.name}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
            <button onClick={onReset} style={{ color: 'var(--color-text-subtle)', marginLeft: 'var(--spacing-sm)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
        ) : (
          <Button variant="primary" icon={FileText} style={{ background: 'var(--gradient-primary)', border: 'none' }} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            Browse Resume File
          </Button>
        )}

        {file && (
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <Button variant="primary" size="lg" icon={Sparkles} style={{ background: 'var(--gradient-primary)', border: 'none', boxShadow: 'var(--shadow-glow)' }} onClick={onProcess}>
              Extract Candidate Profile
            </Button>
          </div>
        )}
      </Card>

      {/* Error Alert */}
      {error && (
        <Card style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', borderColor: '#fca5a5', backgroundColor: '#fee2e2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', color: '#b91c1c' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{error}</span>
          </div>
        </Card>
      )}

      {/* Privacy Notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)', fontWeight: 500 }}>
        <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
        <span>Your resume is processed 100% locally in your browser. Structured profile data is stored on this device.</span>
      </div>
    </div>
  );
};
