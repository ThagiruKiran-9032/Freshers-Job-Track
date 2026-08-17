import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Clock, CheckCircle2 } from 'lucide-react';
import { useInterviews } from '../../context/InterviewContext';
import { useApplications } from '../../context/ApplicationContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const CalendarView = () => {
  const { interviews } = useInterviews();
  const { applications } = useApplications();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Compile Calendar Events
  const events = [];

  // Add Interviews
  interviews.forEach(item => {
    events.push({
      id: item.id,
      date: item.date,
      title: `${item.company} - ${item.roundType}`,
      type: 'interview',
      color: 'var(--color-warning)',
      details: `${item.jobTitle} at ${item.time}`
    });
  });

  // Add Application Follow-ups
  applications.forEach(item => {
    if (item.followUpDate) {
      events.push({
        id: `fol-${item.id}`,
        date: item.followUpDate,
        title: `Follow-up: ${item.company}`,
        type: 'followup',
        color: 'var(--color-primary)',
        details: `${item.title} (${item.status})`
      });
    }
  });

  const getEventsForDay = (dayNum) => {
    const dayString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return events.filter(e => e.date === dayString);
  };

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Career Schedule & Calendar 📅</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Unified view of upcoming interviews, recruiter follow-ups, and assessment deadlines.
        </p>
      </div>

      <Card style={{ padding: '1.5rem' }}>
        {/* Calendar Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>
            {monthNames[month]} {year}
          </h2>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-icon" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={20} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </button>
            <button className="btn btn-secondary btn-icon" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md) var(--radius-md) 0 0', overflow: 'hidden' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dIdx) => (
            <div key={dIdx} style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '0.75rem', textAlign: 'center', fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border-color)' }}>
          {/* Empty Cells Before First Day */}
          {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
            <div key={`empty-${idx}`} style={{ backgroundColor: 'var(--bg-surface-elevated)', minHeight: '100px', opacity: 0.3 }} />
          ))}

          {/* Days of Current Month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dayEvents = getEventsForDay(dayNum);
            const isToday = new Date().getDate() === dayNum && new Date().getMonth() === month && new Date().getFullYear() === year;

            return (
              <div
                key={dayNum}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  minHeight: '110px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  border: isToday ? '2px solid var(--color-primary)' : undefined
                }}
              >
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: isToday ? 'var(--color-primary)' : 'var(--text-muted)',
                  alignSelf: 'flex-end'
                }}>
                  {dayNum}
                </div>

                {/* Render Day Events */}
                {dayEvents.map((evt, eIdx) => (
                  <div
                    key={eIdx}
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: `${evt.color}20`,
                      color: evt.color,
                      borderLeft: `3px solid ${evt.color}`,
                      padding: '3px 6px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={`${evt.title} — ${evt.details}`}
                  >
                    {evt.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
