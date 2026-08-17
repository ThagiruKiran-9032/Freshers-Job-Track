import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, FileText, Edit3, GripVertical } from 'lucide-react';
import { Card } from '../common/Card';

export const ApplicationCard = ({ application, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
    marginBottom: '0.875rem'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        hover
        style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-surface)',
          border: isDragging ? '2px dashed var(--color-primary)' : '1px solid var(--border-color)',
          boxShadow: isDragging ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Top Handle & Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.625rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flex: 1, minWidth: 0 }}>
            <div
              {...listeners}
              style={{
                cursor: 'grab',
                color: 'var(--text-subtle)',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '2px',
                flexShrink: 0
              }}
              title="Drag card to move stage"
            >
              <GripVertical size={16} />
            </div>
            <img
              src={application.companyLogo}
              alt={application.company}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
                flexShrink: 0
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <h4 style={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                lineHeight: 1.3,
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {application.title}
              </h4>
              <p style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {application.company}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(application);
            }}
            className="btn btn-secondary btn-icon"
            style={{ padding: '4px', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
            title="Edit Application Details"
          >
            <Edit3 size={14} />
          </button>
        </div>

        {/* Applied Date & Resume Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-subtle)', margin: '0.625rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={12} style={{ color: 'var(--color-primary)' }} />
            <span>Applied {application.appliedDate}</span>
          </div>
          {application.resumeVersion && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <FileText size={12} />
              <span>{application.resumeVersion}</span>
            </div>
          )}
        </div>

        {/* Short Notes Snippet */}
        {application.notes && (
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface-elevated)',
            padding: '0.5rem 0.625rem',
            borderRadius: 'var(--radius-xs)',
            marginTop: '0.5rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}>
            {application.notes}
          </p>
        )}
      </Card>
    </div>
  );
};
