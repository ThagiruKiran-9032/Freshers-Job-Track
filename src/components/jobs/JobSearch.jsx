import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Search, MapPin } from 'lucide-react';

export const JobSearch = ({
  initialKeyword = '',
  initialLocation = '',
  onSearch
}) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search: keyword.trim(), location: location.trim() });
    }
  };

  return (
    <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)' }} />
            <input
              type="text"
              placeholder="Search title, skill, or role (e.g. React)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-info)' }} />
            <input
              type="text"
              placeholder="Location (e.g. India, Remote, New York)..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>

          <Button type="submit" variant="primary" icon={Search} style={{ height: '40px', background: 'var(--gradient-primary)', border: 'none' }}>
            Search Opportunities
          </Button>
        </div>
      </form>
    </Card>
  );
};
