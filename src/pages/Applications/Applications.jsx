import React, { useState } from 'react';
import { Kanban, List, Plus, Search, Filter, Calendar, FileText, Trash2, Edit3 } from 'lucide-react';
import { useApplications, APPLICATION_STAGES } from '../../context/ApplicationContext';
import { KanbanBoard } from '../../components/applications/KanbanBoard';
import { ApplicationModal } from '../../components/applications/ApplicationModal';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const Applications = () => {
  const {
    applications,
    addApplication,
    updateApplicationStatus,
    updateApplicationDetails,
    deleteApplication
  } = useApplications();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchQuery.trim() ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase().trim());

    const matchesStage = stageFilter === 'all' || app.status === stageFilter;

    return matchesSearch && matchesStage;
  });

  const handleOpenAddModal = () => {
    setSelectedApp(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (app) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const handleSaveModal = (data) => {
    if (selectedApp) {
      updateApplicationDetails(selectedApp.id, data);
    } else {
      addApplication(
        { id: `job-custom-${Date.now()}`, title: data.title, company: data.company, companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150', location: 'Remote' },
        data.status,
        data
      );
    }
  };

  return (
    <div className="page-container fade-in">
      {/* Page Title & Hero Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Application Pipeline Board 📊</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track and manage your fresher applications visually from <strong>Saved</strong> to <strong>Offer</strong>.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={handleOpenAddModal}>
          Track New Application
        </Button>
      </div>

      {/* Control Bar: View Switcher, Search & Filter */}
      <div className="jt-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '260px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="input"
              placeholder="Filter applications by company or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          {/* Stage Filter */}
          <select
            className="select"
            style={{ width: '180px' }}
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All Pipeline Stages</option>
            {APPLICATION_STAGES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* View Switcher Toggle Buttons */}
        <div style={{ display: 'flex', gap: '0.375rem', backgroundColor: 'var(--bg-surface-elevated)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setViewMode('kanban')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'kanban' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'kanban' ? 'var(--color-primary)' : 'var(--text-muted)',
              fontWeight: viewMode === 'kanban' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.8125rem'
            }}
          >
            <Kanban size={16} /> Kanban View
          </button>

          <button
            onClick={() => setViewMode('table')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'table' ? 'var(--color-primary)' : 'var(--text-muted)',
              fontWeight: viewMode === 'table' ? 600 : 500,
              cursor: 'pointer',
              fontSize: '0.8125rem'
            }}
          >
            <List size={16} /> Table View
          </button>
        </div>
      </div>

      {/* Main Pipeline Display Area */}
      {viewMode === 'kanban' ? (
        <KanbanBoard
          applications={filteredApplications}
          onUpdateStatus={updateApplicationStatus}
          onEdit={handleOpenEditModal}
          onDelete={deleteApplication}
        />
      ) : (
        /* Table List View */
        <Card style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-subtle)' }}>
                <th style={{ padding: '1rem' }}>Job & Company</th>
                <th style={{ padding: '1rem' }}>Stage Status</th>
                <th style={{ padding: '1rem' }}>Date Applied</th>
                <th style={{ padding: '1rem' }}>Resume Version</th>
                <th style={{ padding: '1rem' }}>Recruiter</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => {
                const stageInfo = APPLICATION_STAGES.find(s => s.id === app.status);
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={app.companyLogo} alt={app.company} style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{app.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.company}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: `${stageInfo?.color || '#64748b'}20`,
                        color: stageInfo?.color || '#64748b'
                      }}>
                        {stageInfo?.label || app.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.appliedDate}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.resumeVersion || 'Default Resume'}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.recruiterName || 'N/A'}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary btn-icon" onClick={() => handleOpenEditModal(app)}><Edit3 size={16} /></button>
                        <button className="btn btn-danger btn-icon" onClick={() => deleteApplication(app.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Add / Edit Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        application={selectedApp}
        onSave={handleSaveModal}
        onDelete={deleteApplication}
      />
    </div>
  );
};
