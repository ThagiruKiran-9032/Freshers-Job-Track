import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { KanbanColumn } from './KanbanColumn';
import { ApplicationCard } from './ApplicationCard';
import { APPLICATION_STAGES } from '../../context/ApplicationContext';

export const KanbanBoard = ({ applications = [], onUpdateStatus, onEdit, onDelete }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeAppId = active.id;
    const overTarget = over.id; // Could be column stage ID or another item ID

    // Check if target is one of the valid stage IDs
    const matchedStage = APPLICATION_STAGES.find(s => s.id === overTarget);
    if (matchedStage) {
      onUpdateStatus(activeAppId, matchedStage.id);
      return;
    }

    // If dropped over another application card, find that item's column stage
    const overItem = applications.find(a => a.id === overTarget);
    if (overItem) {
      onUpdateStatus(activeAppId, overItem.status);
    }
  };

  const activeApplication = applications.find(a => a.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{
        display: 'flex',
        gap: '1.25rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        minHeight: '650px'
      }}>
        {APPLICATION_STAGES.map((stage) => {
          const stageItems = applications.filter(app => app.status === stage.id);
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              items={stageItems}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5'
            }
          }
        })
      }}>
        {activeApplication ? (
          <ApplicationCard application={activeApplication} onEdit={() => {}} onDelete={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
