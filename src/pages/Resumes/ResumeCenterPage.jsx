import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { ResumeProcessing } from '../../components/resume/ResumeProcessing';
import { ResumeReview } from '../../components/resume/ResumeReview';
import { ResumeCenter } from '../../components/resume/ResumeCenter';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FileText, Sparkles, ShieldCheck } from 'lucide-react';

export const ResumeCenterPage = () => {
  const {
    uploadState,
    processingStep,
    errorMessage,
    pendingProfile,
    processUploadedResume,
    confirmReviewedProfile,
    resetUploadState
  } = useResume();

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.875rem' }}>Resume Center & Auto Profile Extractor 📄</h1>
          <Badge variant="primary" icon={Sparkles}>AI/Rule Extraction</Badge>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>
          Upload your PDF resume to automatically extract your education, skills, and projects into your candidate profile.
        </p>
      </div>

      {/* Upload State Engine */}
      {uploadState === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ResumeUploader
            onFileSelect={processUploadedResume}
            errorMessage={errorMessage}
            onRetry={resetUploadState}
          />
          <ResumeCenter onUploadClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>
      )}

      {uploadState === 'validating' && (
        <ResumeProcessing currentStep={0} />
      )}

      {uploadState === 'processing' && (
        <ResumeProcessing currentStep={processingStep} />
      )}

      {uploadState === 'review' && (
        <ResumeReview
          initialProfile={pendingProfile}
          onConfirm={confirmReviewedProfile}
          onCancel={resetUploadState}
        />
      )}

      {uploadState === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ResumeUploader
            onFileSelect={processUploadedResume}
            errorMessage={errorMessage}
            onRetry={resetUploadState}
          />
          <ResumeCenter onUploadClick={resetUploadState} />
        </div>
      )}

      {uploadState === 'confirmed' && (
        <Card glass style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--color-success-bg)' }}>
          <ShieldCheck size={48} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-success)', marginBottom: '0.5rem' }}>
            Profile Created & Resume Saved!
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Your candidate profile has been updated and your resume is stored locally in your browser.
          </p>
        </Card>
      )}
    </div>
  );
};
