import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Sparkles, AlertCircle, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilter } from '../../components/jobs/JobFilter';
import { Skeleton } from '../../components/common/Skeleton';
import { Button } from '../../components/common/Button';
import { fetchJobs } from '../../services/jobService';

export const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationInput, setLocationInput] = useState('India');
  const [page, setPage] = useState(initialPage);

  const [filters, setFilters] = useState({
    experience: 'all',
    jobType: 'all',
    workMode: 'all',
    sortBy: 'newest'
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const result = await fetchJobs({
          query: searchQuery,
          location: locationInput,
          experience: filters.experience,
          jobType: filters.jobType,
          workMode: filters.workMode,
          sortBy: filters.sortBy,
          page: page
        });
        setJobs(result.jobs || []);
        setTotalCount(result.total || (result.jobs ? result.jobs.length : 0));
        setDataSource(result.source || 'Jooble REST API');
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadJobs, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, locationInput, filters, page]);

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setLocationInput('India');
    setPage(1);
    setFilters({
      experience: 'all',
      jobType: 'all',
      workMode: 'all',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  const handleSearchForm = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  const handleNextPage = () => {
    const nextP = page + 1;
    setPage(nextP);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const prevP = page - 1;
      setPage(prevP);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const startResultIdx = (page - 1) * 20 + 1;
  const endResultIdx = Math.min(page * 20, totalCount || jobs.length);

  return (
    <div className="page-container fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Discover Fresher Jobs 💼</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Explore entry-level tech roles powered by live <strong>Jooble REST API</strong> search & smart profile matching.
        </p>
      </div>

      {/* Main Search Bar Controls */}
      <form onSubmit={handleSearchForm} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="input"
              placeholder="Search by job title, skill, or keyword (e.g. React, Trainee)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              type="text"
              className="input"
              placeholder="Location e.g. Bengaluru, Remote, India..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <Button type="submit" variant="primary" icon={Search} style={{ height: '42px' }}>
            Search Fresher Jobs
          </Button>
        </div>
      </form>

      {/* Filter Component Bar */}
      <JobFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        totalResults={totalCount}
        source={dataSource}
      />

      {/* Results Header Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        {loading ? (
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Finding fresher opportunities...
          </div>
        ) : jobs.length > 0 ? (
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Found <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{totalCount}</span> fresher opportunities{' '}
            <span style={{ fontWeight: 400, color: 'var(--text-subtle)', marginLeft: '6px' }}>
              (Showing {startResultIdx}–{endResultIdx} of {totalCount})
            </span>
          </div>
        ) : (
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-warning)' }}>
            No matching fresher opportunities found
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="jt-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Skeleton width="52px" height="52px" borderRadius="var(--radius-md)" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height="20px" style={{ marginBottom: '8px' }} />
                  <Skeleton width="40%" height="16px" />
                </div>
              </div>
              <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
              <Skeleton width="90%" height="16px" style={{ marginBottom: '16px' }} />
              <Skeleton width="100%" height="38px" borderRadius="var(--radius-md)" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <Button
              variant="secondary"
              icon={ChevronLeft}
              disabled={page <= 1}
              onClick={handlePrevPage}
            >
              Previous
            </Button>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Page {page}
            </span>
            <Button
              variant="secondary"
              icon={ChevronRight}
              disabled={jobs.length < 20 && totalCount <= page * 20}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="jt-card empty-state" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <Briefcase className="empty-state-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', color: 'var(--text-subtle)' }} />
          <h3 className="empty-state-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Fresher Jobs Found</h3>
          <p className="empty-state-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: '1.5' }}>
            We couldn't find any job listings matching your search terms. Try clearing filters or searching for terms like <strong>React</strong>, <strong>Trainee</strong>, or <strong>Python</strong>.
          </p>
          <Button variant="secondary" onClick={handleResetFilters}>Reset All Filters</Button>
        </div>
      )}
    </div>
  );
};
