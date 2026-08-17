import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { APPLICATION_STAGES } from '../../context/ApplicationContext';
import { Trash2, Save, Calendar, User, FileText } from 'lucide-react';

import { useResume } from '../../context/ResumeContext';

export const ApplicationModal = ({ isOpen, onClose, application, onSave, onDelete }) => {
  const { resumesList } = useResume();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    resumeVersion: 'Frontend Developer Resume',
    recruiterName: '',
    recruiterEmail: '',
    followUpDate: '',
    notes: ''
  });

  useEffect(() => {
    if (application) {
      setFormData({
        title: application.title || '',
        company: application.company || '',
        status: application.status || 'Applied',
        appliedDate: application.appliedDate || new Date().toISOString().split('T')[0],
        resumeVersion: application.resumeVersion || (resumesList[0]?.name || 'Frontend Developer Resume'),
        recruiterName: application.recruiterName || '',
        recruiterEmail: application.recruiterEmail || '',
        followUpDate: application.followUpDate || '',
        notes: application.notes || ''
      });
    } else {
      setFormData({
        title: '',
        company: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        resumeVersion: resumesList[0]?.name || 'Frontend Developer Resume',
        recruiterName: '',
        recruiterEmail: '',
        followUpDate: '',
        notes: ''
      });
    }
  }, [application, isOpen, resumesList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={application ? `Edit Application — ${application.title}` : 'Track New Job Application'}
      maxWidth="600px"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Input
            label="Job Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g. Junior React Developer"
          />
          <Input
            label="Company Name"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            required
            placeholder="e.g. TechCorp"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Application Pipeline Stage</label>
            <select
              className="select"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {APPLICATION_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date Applied"
            type="date"
            icon={Calendar}
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Resume Version</label>
            <select
              className="select"
              value={formData.resumeVersion}
              onChange={(e) => setFormData({ ...formData, resumeVersion: e.target.value })}
            >
              {resumesList.length > 0 ? (
                resumesList.map(r => (
                  <option key={r.id} value={r.name}>{r.name} {r.isPrimary ? '(Primary)' : ''}</option>
                ))
              ) : (
                <>
                  <option value="Frontend Developer Resume">Frontend Developer Resume</option>
                  <option value="General Fresher Resume">General Fresher Resume</option>
                </>
              )}
            </select>
          </div>

          <Input
            label="Follow-up Reminder Date"
            type="date"
            icon={Calendar}
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <Input
            label="Recruiter Name"
            icon={User}
            value={formData.recruiterName}
            onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
            placeholder="e.g. Priya Sharma"
          />
          <Input
            label="Recruiter Contact Email"
            type="email"
            value={formData.recruiterEmail}
            onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
            placeholder="e.g. hr@company.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Application Notes & Preparation Log</label>
          <textarea
            className="textarea"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Log technical rounds, HR feedback, or interview tips..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          {application ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => {
                onDelete(application.id);
                onClose();
              }}
            >
              Delete
            </Button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" icon={Save}>Save Application</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
