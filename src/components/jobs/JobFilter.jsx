import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';

export const JobFilter = ({
  filters = {},
  onFilterChange,
  onReset
}) => {
  const [mobileModalOpen, setMobileModalOpen] = useState(false);

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      {/* Quick Fresher Filter Buttons */}
      <div>
        <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          QUICK FRESHER FILTERS
        </label>
        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
          {[
            { label: 'Entry Level', value: 'Entry Level' },
            { label: 'Internships', value: 'Internship' },
            { label: 'Software Eng', category: 'Software Engineering' },
            { label: 'Data Science', category: 'Data Science & Analytics' },
            { label: 'UX & Design', category: 'UX & Design' },
            { label: 'AI & ML', category: 'AI & Machine Learning' }
          ].map((item, idx) => {
            const isActive = item.value
              ? filters.level === item.value
              : filters.category === item.category;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (item.value) onFilterChange('level', item.value);
                  if (item.category) onFilterChange('category', item.category);
                }}
                style={{
                  fontSize: 'var(--font-size-xs)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface-elevated)',
                  color: isActive ? '#ffffff' : 'var(--color-text-muted)',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Dropdowns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--spacing-md)' }}>
        <div>
          <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
            Experience Level
          </label>
          <select
            value={filters.level || 'all'}
            onChange={(e) => onFilterChange('level', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Internship">Internship</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
            Job Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All Categories</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Data Science & Analytics">Data Science & Analytics</option>
            <option value="UX & Design">UX & Design</option>
            <option value="IT & System Admin">IT & System Admin</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="QA & Testing">QA & Testing</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
            Sort Results
          </label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <Card className="desktop-filters" style={{ marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
            <Filter size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Refine Fresher Opportunities</span>
          </div>
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset}>
            Clear Filters
          </Button>
        </div>
        {filterContent}
      </Card>

      {/* Mobile Filter Toggle Button & Drawer */}
      <div className="mobile-filter-trigger" style={{ marginBottom: 'var(--spacing-md)', display: 'none' }}>
        <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setMobileModalOpen(true)} style={{ width: '100%' }}>
          Filter Opportunities
        </Button>
      </div>

      {mobileModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface)',
            width: '100%',
            maxHeight: '90vh',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg)',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--spacing-sm)' }}>
              <h3 style={{ fontSize: 'var(--font-size-md)' }}>Filter Opportunities</h3>
              <button onClick={() => setMobileModalOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            {filterContent}
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
              <Button variant="secondary" onClick={onReset} style={{ flex: 1 }}>Clear</Button>
              <Button variant="primary" onClick={() => setMobileModalOpen(false)} style={{ flex: 1 }}>Apply Filters</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
