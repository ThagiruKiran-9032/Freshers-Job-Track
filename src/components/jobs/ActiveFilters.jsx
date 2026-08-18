import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { X, RotateCcw } from 'lucide-react';

export const ActiveFilters = ({
  filters = {},
  searchQuery = '',
  onRemoveFilter,
  onClearAll
}) => {
  const activeItems = [];

  if (searchQuery && searchQuery.trim()) {
    activeItems.push({ key: 'search', label: `Search: ${searchQuery}` });
  }
  if (filters.level && filters.level !== 'all') {
    activeItems.push({ key: 'level', label: `Level: ${filters.level}` });
  }
  if (filters.category && filters.category !== 'all') {
    activeItems.push({ key: 'category', label: `Category: ${filters.category}` });
  }
  if (filters.location && filters.location !== 'all') {
    activeItems.push({ key: 'location', label: `Location: ${filters.location}` });
  }
  if (filters.company) {
    activeItems.push({ key: 'company', label: `Company: ${filters.company}` });
  }

  if (activeItems.length === 0) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-sm)',
      flexWrap: 'wrap',
      marginBottom: 'var(--spacing-lg)',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      backgroundColor: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)'
    }}>
      <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
        Active Filters:
      </span>

      {activeItems.map(item => (
        <span
          key={item.key}
          onClick={() => onRemoveFilter && onRemoveFilter(item.key)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title={`Remove ${item.label}`}
        >
          {item.label}
          <X size={12} />
        </span>
      ))}

      <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onClearAll} style={{ marginLeft: 'auto' }}>
        Clear All
      </Button>
    </div>
  );
};
