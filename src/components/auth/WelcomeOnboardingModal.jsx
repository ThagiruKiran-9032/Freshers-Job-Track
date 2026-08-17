import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Sparkles, ArrowRight, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

export const WelcomeOnboardingModal = () => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useAuth();

  // Show modal only if user is logged in AND profileCompleted is false
  const isOpen = Boolean(currentUser && currentUser.profileCompleted === false);

  const handleUploadResume = () => {
    completeOnboarding();
    navigate('/resumes');
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleSkip}
      title="Welcome to JobTrack 👋"
      maxWidth="500px"
    >
      <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}>
          <Sparkles size={32} />
        </div>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Let's build your career profile!
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Upload your PDF resume and JobTrack will automatically extract your technical skills, education, projects, experience, and career information in seconds.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Button
            variant="primary"
            size="lg"
            icon={Upload}
            onClick={handleUploadResume}
            style={{ width: '100%' }}
          >
            Upload Resume & Auto Build Profile
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleSkip}
            style={{ width: '100%' }}
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
