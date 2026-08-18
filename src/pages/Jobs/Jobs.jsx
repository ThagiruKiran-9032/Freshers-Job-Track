import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container } from '../../components/common/Container';
import { SectionHeader } from '../../components/common/SectionHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { JobSearch } from '../../components/jobs/JobSearch';
import { JobFilter } from '../../components/jobs/JobFilter';
import { ActiveFilters } from '../../components/jobs/ActiveFilters';
import { JobResultCount } from '../../components/jobs/JobResultCount';
import { Pagination } from '../../components/jobs/Pagination';
import { JobCard } from '../../components/jobs/JobCard';
import { useJobs } from '../../hooks/useJobs';
import { AlertTriangle, Briefcase } from 'lucide-react';

export const Jobs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read active parameters directly from URL query parameters (Single Source of Truth)
  const searchQuery = searchParams.get('search') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || '';
  const level = searchParams.get('level') || 'Entry Level';
  const company = searchParams.get('company') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const activeParams = {
    search: searchQuery,
    location,
    category,
    level,
    company,
    sortBy,
    page
  };

  const filters = {
    level,
    category,
    location,
    company,
    sortBy
  };

  // Fetch real job opportunities driven by active URL parameters
  const {
    jobs,
    loading,
    error,
    pageCount,
    totalCount,
    refetch
  } = useJobs(activeParams);

  // Helper to update URL search parameters
  const updateUrlParams = (newParams) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && String(val).trim() !== '' && val !== 'all') {
        next.set(key, String(val).trim());
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next);
  };

  const handleSearchSubmit = ({ search, location: loc }) => {
    updateUrlParams({
      search: search !== undefined ? search : searchQuery,
      location: loc !== undefined ? loc : location,
      page: 1
    });
  };

  const handleFilterChange = (key, value) => {
    updateUrlParams({
      [key]: value,
      page: 1
    });
  };

  const handleRemoveFilter = (key) => {
    if (key === 'search') {
      updateUrlParams({ search: '', page: 1 });
    } else {
      updateUrlParams({ [key]: key === 'level' ? 'all' : '', page: 1 });
    }
  };

  const handleClearAllFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (id) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <Container>
      {/* Header */}
      <SectionHeader
        title="Discover IT Fresher Jobs"
        subtitle="Explore live entry-level & internship roles powered directly by Jobicy IT Jobs API v2"
        badgeText="Jobicy IT Jobs API"
      />

      {/* Prominent Search UI Bar */}
      <JobSearch
        initialKeyword={searchQuery}
        initialLocation={location}
        onSearch={handleSearchSubmit}
      />

      {/* Experience & Category Filters */}
      <JobFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleClearAllFilters}
      />

      {/* Active Filter Tags Bar */}
      <ActiveFilters
        filters={filters}
        searchQuery={searchQuery}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearAllFilters}
      />

      {/* Main Jobs Listing & State Container */}
      {loading ? (
        /* Skeleton Loading Cards Grid */
        <div>
          <JobResultCount total={0} loading={true} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-lg)' }}>
            {[1, 2, 3, 4, 5, 6].map(idx => (
              <Card key={idx} style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-elevated)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '70%', height: '16px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }} />
                    <div style={{ width: '40%', height: '12px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }} />
                  </div>
                </div>
                <div style={{ width: '100%', height: '14px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }} />
                <div style={{ width: '80%', height: '14px', backgroundColor: 'var(--color-surface-elevated)', borderRadius: 'var(--radius-sm)' }} />
              </Card>
            ))}
          </div>
        </div>
      ) : error ? (
        /* Error State with Real Retry */
        <Card style={{ textAlign: 'center', padding: 'var(--spacing-2xl) var(--spacing-xl)', borderColor: '#fca5a5', backgroundColor: '#fee2e2' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#fecaca',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--spacing-md)'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--spacing-xs)', color: '#991b1b' }}>
            We couldn't update the opportunities
          </h3>
          <p style={{ color: '#7f1d1d', fontSize: 'var(--font-size-sm)', maxWidth: '440px', margin: '0 auto var(--spacing-lg)' }}>
            {error}
          </p>
          <Button variant="primary" style={{ background: 'var(--gradient-primary)', border: 'none' }} onClick={() => refetch()}>
            Retry Request
          </Button>
        </Card>
      ) : jobs.length > 0 ? (
        /* Real API Results View */
        <>
          {/* Result Count Header */}
          <JobResultCount
            total={totalCount}
            loading={false}
            page={page}
            pageCount={pageCount}
            pageJobsCount={jobs.length}
          />

          {/* Job Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--spacing-lg)'
          }}>
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        /* Polished Empty State */
        <>
          <JobResultCount total={0} loading={false} page={1} pageCount={1} pageJobsCount={0} />
          <EmptyState
            icon={Briefcase}
            title="No IT opportunities match your search"
            description="Try another keyword, location, or broader experience level filter to discover available roles."
            actionText="Clear All Filters"
            onAction={handleClearAllFilters}
          />
        </>
      )}
    </Container>
  );
};
