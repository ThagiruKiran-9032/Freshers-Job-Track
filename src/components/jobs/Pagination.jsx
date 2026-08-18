import React from 'react';
import { Button } from '../common/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  page = 1,
  pageCount = 1,
  onPageChange
}) => {
  if (pageCount <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xl)' }}>
      <Button
        variant="secondary"
        icon={ChevronLeft}
        disabled={page <= 1}
        onClick={() => onPageChange && onPageChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>

      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
        Page {page} of {pageCount}
      </span>

      <Button
        variant="secondary"
        icon={ChevronRight}
        disabled={page >= pageCount}
        onClick={() => onPageChange && onPageChange(Math.min(pageCount, page + 1))}
      >
        Next
      </Button>
    </div>
  );
};
