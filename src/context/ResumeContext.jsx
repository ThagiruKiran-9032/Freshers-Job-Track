import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  saveResumeFile,
  getAllResumes,
  getResumeById,
  setPrimaryResumeFile,
  deleteResumeFile,
  getPrimaryResume
} from '../services/indexedDB';
import { extractTextFromPDF } from '../services/resumeParser';
import { validateResumeFile, validateExtractedText } from '../utils/resume/validateResume';
import { buildProfileFromResumeText } from '../utils/resume/buildProfile';
import { useProfile } from './ProfileContext';

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const { profile, setProfile } = useProfile();

  const [resumesList, setResumesList] = useState([]);
  const [uploadState, setUploadState] = useState('idle'); // idle, selected, validating, processing, review, confirmed, error
  const [processingStep, setProcessingStep] = useState(0); // 0: Reading, 1: Extracting, 2: Parsing, 3: Finalizing
  const [errorMessage, setErrorMessage] = useState(null);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

  // Load resumes list from IndexedDB on mount
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const list = await getAllResumes();
      setResumesList(list);
    } catch (err) {
      console.error('Failed to load resumes from IndexedDB:', err);
    }
  };

  /**
   * Process uploaded PDF file through validation, extraction, and parsing
   */
  const processUploadedResume = async (file) => {
    setErrorMessage(null);
    setUploadState('validating');

    // 1. File Validation
    const fileVal = validateResumeFile(file);
    if (!fileVal.isValid) {
      setErrorMessage(fileVal.error);
      setUploadState('error');
      return;
    }

    try {
      setActiveFile(file);
      setUploadState('processing');
      setProcessingStep(0); // Reading PDF

      await new Promise(r => setTimeout(r, 400));
      setProcessingStep(1); // Extracting Text

      const rawText = await extractTextFromPDF(file);

      const textVal = validateExtractedText(rawText);
      if (!textVal.isValid) {
        setErrorMessage(textVal.error);
        setUploadState('error');
        return;
      }

      setProcessingStep(2); // Parsing Sections
      await new Promise(r => setTimeout(r, 400));

      setProcessingStep(3); // Building Structured Profile
      const parsedProfile = buildProfileFromResumeText(rawText);

      // Preserve manual headline if candidate previously entered one manually
      if (profile?.personal?.headlineSource === 'manual' && profile?.personal?.headline) {
        parsedProfile.personal.newGeneratedHeadline = parsedProfile.personal.headline;
        parsedProfile.personal.headline = profile.personal.headline;
        parsedProfile.personal.headlineSource = 'manual';
      }

      await new Promise(r => setTimeout(r, 300));
      setPendingProfile(parsedProfile);
      setUploadState('review');

    } catch (err) {
      console.error('Processing error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while parsing your resume.');
      setUploadState('error');
    }
  };

  /**
   * Confirm reviewed profile and save PDF blob into IndexedDB
   */
  const confirmReviewedProfile = async (reviewedProfileData) => {
    try {
      // 1. Update ProfileContext
      setProfile(reviewedProfileData);

      // 2. Save PDF blob to IndexedDB if activeFile exists
      if (activeFile) {
        const isFirst = resumesList.length === 0;
        const newResumeRecord = {
          id: `resume-${Date.now()}`,
          name: activeFile.name,
          type: activeFile.type || 'application/pdf',
          size: activeFile.size,
          uploadDate: new Date().toISOString().split('T')[0],
          isPrimary: isFirst,
          blob: activeFile,
          targetRole: reviewedProfileData.personal.headline || 'Software Developer'
        };

        await saveResumeFile(newResumeRecord);
        await loadResumes();
      }

      setUploadState('confirmed');
      setTimeout(() => {
        setUploadState('idle');
        setPendingProfile(null);
        setActiveFile(null);
      }, 1000);

    } catch (err) {
      console.error('Confirmation error:', err);
      setErrorMessage('Failed to save profile or resume file locally.');
    }
  };

  /**
   * Download a resume file from IndexedDB
   */
  const downloadResume = async (id) => {
    const record = await getResumeById(id);
    if (!record || !record.blob) return;

    const url = URL.createObjectURL(record.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Set primary resume
   */
  const handleSetPrimary = async (id) => {
    await setPrimaryResumeFile(id);
    await loadResumes();
  };

  /**
   * Delete resume file
   */
  const handleDeleteResume = async (id) => {
    if (window.confirm('Delete this stored resume file from browser storage? Your confirmed profile information will remain intact.')) {
      await deleteResumeFile(id);
      await loadResumes();
    }
  };

  const resetUploadState = () => {
    setUploadState('idle');
    setErrorMessage(null);
    setPendingProfile(null);
    setActiveFile(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumesList,
        uploadState,
        processingStep,
        errorMessage,
        pendingProfile,
        processUploadedResume,
        confirmReviewedProfile,
        downloadResume,
        setPrimaryResume: handleSetPrimary,
        deleteResume: handleDeleteResume,
        resetUploadState
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
