import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ApplicationCard } from './ApplicationCard';

export const KanbanColumn = ({ stage, items = [], onEdit, onDelete }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: '1 0 300px',
        minWidth: '300px',
        maxWidth: '340px',
        backgroundColor: isOver ? 'var(--bg-surface-hover)' : 'var(--bg-surface-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '1rem 0.875rem',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 220px)',
        maxHeight: '750px',
        transition: 'background-color 0.2s ease',
        boxSizing: 'border-box'
      }}
    >
      {/* Column Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: `2px solid ${stage.color}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: stage.color,
            display: 'inline-block'
          }} />
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{stage.label}</h3>
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: 'var(--bg-surface)',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--text-muted)'
        }}>
          {items.length}
        </span>
      </div>

      {/* Draggable Items Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', paddingLeft: '2px' }}>
        <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {items.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-subtle)',
            fontSize: '0.8125rem'
          }}>
            Drop applications here
          </div>
        )}
      </div>
    </div>
  );
};
