import React, { useState } from 'react';
import { Edit3, RefreshCw, Check, X, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { generateSingleHeadline } from '../../utils/resume/headlineGenerator';

export const HeadlineManager = ({ headline, headlineSource, onSaveHeadline, currentProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(headline || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  const MAX_LENGTH = 120;

  const handleStartEdit = () => {
    setEditedText(headline || '');
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedText(headline || '');
    setErrorMsg('');
    setIsEditing(false);
  };

  const handleSaveManual = () => {
    const clean = editedText.replace(/\s+/g, ' ').trim();
    if (!clean) {
      setErrorMsg('Headline cannot be empty.');
      return;
    }
    if (clean.length > MAX_LENGTH) {
      setErrorMsg(`Headline must be ${MAX_LENGTH} characters or less.`);
      return;
    }

    onSaveHeadline(clean, 'manual');
    setIsEditing(false);
    setErrorMsg('');
  };

  const executeRegeneration = () => {
    const newHeadline = generateSingleHeadline(currentProfile);
    onSaveHeadline(newHeadline, 'auto');
    setEditedText(newHeadline);
    setShowRegenConfirm(false);
  };

  const handleRegenerateClick = () => {
    if (headlineSource === 'manual') {
      setShowRegenConfirm(true);
    } else {
      executeRegeneration();
    }
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          Professional Headline
        </label>

        {headlineSource === 'manual' ? (
          <Badge variant="warning" icon={UserCheck}>Manually entered</Badge>
        ) : (
          <Badge variant="primary" icon={Sparkles}>Generated from your resume</Badge>
        )}
      </div>

      {!isEditing ? (
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {headline || 'Software Developer | Fresher'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
            <Button type="button" variant="secondary" size="sm" icon={Edit3} onClick={handleStartEdit}>
              Edit Headline
            </Button>
            <Button type="button" variant="outline" size="sm" icon={RefreshCw} onClick={handleRegenerateClick}>
              Regenerate
            </Button>
          </div>
        </div>
      ) : (
        <div style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <input
            type="text"
            className="input"
            value={editedText}
            maxLength={MAX_LENGTH}
            onChange={(e) => {
              setEditedText(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="e.g. Backend Developer | Python, FastAPI & MySQL | Fresher"
            autoFocus
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: editedText.length > MAX_LENGTH - 10 ? 'var(--color-warning)' : 'var(--text-subtle)' }}>
              Characters: {editedText.length} / {MAX_LENGTH}
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button type="button" variant="secondary" size="sm" icon={X} onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button type="button" variant="primary" size="sm" icon={Check} onClick={handleSaveManual}>
                Save Headline
              </Button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal for overwriting manual headline */}
      <Modal
        isOpen={showRegenConfirm}
        onClose={() => setShowRegenConfirm(false)}
        title="Regenerate headline?"
        maxWidth="450px"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            This will replace your manually entered headline with a new automatically generated headline based on your resume profile.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => setShowRegenConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={RefreshCw} onClick={executeRegeneration}>
              Regenerate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
