import React, { useState, useRef } from 'react';
import { Upload, FileText, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

export const ResumeUploader = ({ onFileSelect, errorMessage, onRetry }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
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
    <div className="jt-card" style={{ padding: '2rem', textAlign: 'center' }}>
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: isDragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--border-color)',
          backgroundColor: isDragOver ? 'var(--color-primary-light)' : 'var(--bg-surface-elevated)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 1.5rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept=".pdf,application/pdf"
          style={{ display: 'none' }}
        />

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Upload size={30} />
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>
            Drag & Drop your Resume PDF here
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            or click to browse your computer
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={14} /> PDF format only
          </span>
          <span>•</span>
          <span>Max 5 MB file size</span>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Resume File
        </Button>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div style={{
          marginTop: '1.25rem',
          padding: '0.875rem 1rem',
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
          {onRetry && (
            <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      )}

      {/* Privacy Guarantee Statement */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'var(--color-success-bg)',
        color: 'var(--color-success)',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600
      }}>
        <ShieldCheck size={16} />
        <span>Your resume is processed 100% locally in your browser and is not uploaded to any server.</span>
      </div>
    </div>
  );
};
