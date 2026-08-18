import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { SectionHeader } from '../../components/common/SectionHeader';
import { ResumeUploader } from '../../components/resume/ResumeUploader';
import { ResumeProcessing } from '../../components/resume/ResumeProcessing';
import { ResumeReview } from '../../components/resume/ResumeReview';
import { useResumeParser } from '../../hooks/useResumeParser';
import { useProfile } from '../../context/ProfileContext';

export const Resume = () => {
  const navigate = useNavigate();
  const { updateProfile: updateContextProfile } = useProfile();

  const {
    file,
    status,
    stage,
    parsedProfile,
    error,
    selectFile,
    processFile,
    updateProfile,
    saveProfile,
    reset
  } = useResumeParser();

  const handleSaveProfile = () => {
    saveProfile();
    if (parsedProfile) {
      updateContextProfile(parsedProfile);
    }
    navigate('/profile');
  };

  return (
    <Container>
      <SectionHeader
        title="Resume Center & Automatic Data Collector"
        subtitle="Upload your PDF or DOCX resume to extract your candidate background locally in your browser"
        badgeText="100% Client-Side Engine"
      />

      {status === 'processing' ? (
        <ResumeProcessing stage={stage} />
      ) : status === 'review' || status === 'saved' ? (
        <ResumeReview
          profile={parsedProfile}
          onUpdate={updateProfile}
          onSave={handleSaveProfile}
        />
      ) : (
        <ResumeUploader
          file={file}
          error={error}
          onFileSelect={selectFile}
          onProcess={processFile}
          onReset={reset}
        />
      )}
    </Container>
  );
};
