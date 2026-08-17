import React, { useState } from 'react';
import { Video, Calendar, Clock, User, ExternalLink, Plus, Edit3, Trash2, CheckCircle, FileText } from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const Interviews = () => {
  const { interviews, addInterview, updateInterview, deleteInterview } = useInterviews();
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'completed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    roundType: 'Technical Round 1',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    interviewerName: '',
    meetingLink: '',
    notes: '',
    status: 'Upcoming'
  });

  const filteredInterviews = interviews.filter(item =>
    activeTab === 'upcoming' ? item.status === 'Upcoming' : item.status === 'Completed'
  );

  const handleOpenAdd = () => {
    setSelectedInterview(null);
    setFormData({
      company: '',
      jobTitle: '',
      roundType: 'Technical Round 1',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      interviewerName: '',
      meetingLink: '',
      notes: '',
      status: 'Upcoming'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedInterview(item);
    setFormData({
      company: item.company,
      jobTitle: item.jobTitle,
      roundType: item.roundType,
      date: item.date,
      time: item.time,
      interviewerName: item.interviewerName,
      meetingLink: item.meetingLink,
      notes: item.notes,
      status: item.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedInterview) {
      updateInterview(selectedInterview.id, formData);
    } else {
      addInterview(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="page-container fade-in">
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Interview Manager 🎯</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Schedule and track HR screenings, technical coding rounds, and final interview discussions.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Schedule Interview
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'upcoming' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'upcoming' ? 600 : 500,
            fontSize: '0.9375rem',
            cursor: 'pointer'
          }}
        >
          <Calendar size={18} /> Upcoming Interviews ({interviews.filter(i => i.status === 'Upcoming').length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'completed' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'completed' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'completed' ? 600 : 500,
            fontSize: '0.9375rem',
            cursor: 'pointer'
          }}
        >
          <CheckCircle size={18} /> Completed History ({interviews.filter(i => i.status === 'Completed').length})
        </button>
      </div>

      {/* Interview Cards List */}
      {filteredInterviews.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredInterviews.map((item) => (
            <Card key={item.id} hover style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img
                    src={item.companyLogo}
                    alt={item.company}
                    style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.125rem' }}>{item.jobTitle}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>{item.company}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button className="btn btn-secondary btn-icon" onClick={() => handleOpenEdit(item)}><Edit3 size={16} /></button>
                  <button className="btn btn-danger btn-icon" onClick={() => deleteInterview(item.id)}><Trash2 size={16} /></button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <Badge variant="warning">{item.roundType}</Badge>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: '0.875rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Date:</strong> {item.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                  <span><strong>Time:</strong> {item.time}</span>
                </div>
                {item.interviewerName && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={16} style={{ color: 'var(--color-primary)' }} />
                    <span><strong>Interviewer:</strong> {item.interviewerName}</span>
                  </div>
                )}
              </div>

              {item.notes && (
                <div style={{ marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FileText size={14} /> Preparation Notes:
                  </div>
                  {item.notes}
                </div>
              )}

              {item.meetingLink && (
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={ExternalLink}
                    style={{ width: '100%' }}
                    onClick={() => window.open(item.meetingLink, '_blank')}
                  >
                    Launch Video Meeting
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="empty-state">
          <Video className="empty-state-icon" />
          <h3 className="empty-state-title">No {activeTab} Interviews</h3>
          <p className="empty-state-desc">
            {activeTab === 'upcoming' ? 'No interviews scheduled yet. Click "Schedule Interview" to log an upcoming round!' : 'No completed interview records found.'}
          </p>
        </Card>
      )}

      {/* Schedule / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedInterview ? 'Edit Interview Details' : 'Schedule New Interview Round'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Company Name"
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <Input
              label="Job Role Title"
              value={formData.jobTitle}
              onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Interview Round Type</label>
              <select
                className="select"
                value={formData.roundType}
                onChange={e => setFormData({ ...formData, roundType: e.target.value })}
              >
                <option value="HR Screening">HR Screening</option>
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="Coding Assessment">Coding Assessment</option>
                <option value="Managerial Round">Managerial Round</option>
                <option value="Final Discussion">Final Discussion</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Interview Status</label>
              <select
                className="select"
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 11:00 AM"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Interviewer Name"
              value={formData.interviewerName}
              onChange={e => setFormData({ ...formData, interviewerName: e.target.value })}
              placeholder="e.g. Priya Mehta"
            />
            <Input
              label="Meeting Link URL"
              value={formData.meetingLink}
              onChange={e => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="Google Meet or Zoom link..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preparation & Topics Notes</label>
            <textarea
              className="textarea"
              rows={3}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Concepts to revise, questions to ask interviewer..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Interview</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
