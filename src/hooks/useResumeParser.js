import { useState } from 'react';
import { processResumeFile } from '../services/resumeService';

export function useResumeParser() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, file_selected, processing, review, saved, error
  const [stage, setStage] = useState(''); // reading, extracting, parsing, completed
  const [rawText, setRawText] = useState('');
  const [parsedProfile, setParsedProfile] = useState(null);
  const [error, setError] = useState(null);

  const selectFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      setStatus('idle');
      return;
    }

    const isPDF = selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf');
    const isDOCX = selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || selectedFile.name.endsWith('.docx');

    if (!isPDF && !isDOCX) {
      setError('Unsupported file type. Please upload a PDF or DOCX resume.');
      setStatus('error');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Resume is too large. Please upload a file smaller than 5 MB.');
      setStatus('error');
      return;
    }

    setFile(selectedFile);
    setStatus('file_selected');
  };

  const processFile = async () => {
    if (!file) return;

    setStatus('processing');
    setError(null);

    try {
      const result = await processResumeFile(file, (currentStage) => setStage(currentStage));
      setRawText(result.rawText);
      setParsedProfile(result.profile);
      setStatus('review');
    } catch (err) {
      setError(err.message || 'We couldn\'t process this resume.');
      setStatus('error');
    }
  };

  const updateProfile = (updatedProfile) => {
    setParsedProfile(updatedProfile);
  };

  const saveProfile = () => {
    if (!parsedProfile) return;

    try {
      localStorage.setItem('jobtrack_profile', JSON.stringify(parsedProfile));
      setStatus('saved');
    } catch (err) {
      setError('Failed to save profile to localStorage.');
    }
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setStage('');
    setRawText('');
    setParsedProfile(null);
    setError(null);
  };

  return {
    file,
    status,
    stage,
    rawText,
    parsedProfile,
    error,
    selectFile,
    processFile,
    updateProfile,
    saveProfile,
    reset
  };
}
