import React, { useState, useEffect } from 'react';
import { collegesAPI, coursesAPI } from '../services/api';
import CollegeCard from '../components/common/CollegeCard';
import { Search, Filter, RotateCcw, Compass, MapPin, Layers } from 'lucide-react';

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedNaac, setSelectedNaac] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);

  // Load filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [courseRes, cityRes] = await Promise.all([
          coursesAPI.getAll(),
          collegesAPI.getCities(),
        ]);
        if (courseRes.success) setCourses(courseRes.courses);
        if (cityRes.success) setCities(cityRes.cities);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    };
    loadFilters();
  }, []);

  // Fetch colleges when filters change
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 9,
          search: search.trim(),
          city: selectedCity,
          courseId: selectedCourse,
          collegeType: selectedType,
          naacGrade: selectedNaac,
          sortBy,
          sortOrder,
        };

        const res = await collegesAPI.getAll(params);
        if (res.success) {
          setColleges(res.colleges || []);
          setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
        }
      } catch (err) {
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [search, selectedCity, selectedCourse, selectedType, selectedNaac, sortBy, sortOrder, page]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCity('All');
    setSelectedCourse('All');
    setSelectedType('All');
    setSelectedNaac('All');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
  };

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
            <Compass size={13} /> College Directory
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Explore Mumbai & Maharashtra Colleges</h1>
          <p style={{ color: 'var(--slate-muted)', fontSize: '1rem' }}>
            Discover accredited colleges, university affiliations, offered degree courses, and genuine historical admission criteria.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          {/* Top row: search + sort */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 0 280px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by college name, city, or university..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>Sort:</span>
              <select
                className="form-select"
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split('_');
                  setSortBy(sb);
                  setSortOrder(so);
                }}
                style={{ width: 'auto' }}
              >
                <option value="name_asc">Name (A to Z)</option>
                <option value="name_desc">Name (Z to A)</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="fees_asc">Lowest Fees</option>
                <option value="fees_desc">Highest Fees</option>
              </select>

              <button onClick={handleClearFilters} className="btn btn-secondary btn-sm" title="Reset all filters">
                <RotateCcw size={14} /> Clear
              </button>
            </div>
          </div>

          {/* Secondary Filter Dropdowns */}
          <div className="grid grid-cols-4 gap-4" style={{ fontSize: '0.85rem' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>City / Region</label>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Offered Course</label>
              <select
                className="form-select"
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Courses</option>
                {courses.map((crs) => (
                  <option key={crs._id} value={crs._id}>{crs.shortName} - {crs.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>College Type</label>
              <select
                className="form-select"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All Types</option>
                <option value="Autonomous">Autonomous</option>
                <option value="Government-Aided">Government-Aided</option>
                <option value="Private-Aided">Private-Aided</option>
                <option value="Private-Unaided">Private-Unaided</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>NAAC Grade</label>
              <select
                className="form-select"
                value={selectedNaac}
                onChange={(e) => {
                  setSelectedNaac(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">All NAAC Grades</option>
                <option value="A++">A++ Grade</option>
                <option value="A+">A+ Grade</option>
                <option value="A">A Grade</option>
                <option value="B++">B++ Grade</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--slate-muted)' }}>
          <div>
            Showing <strong>{colleges.length}</strong> of <strong>{pagination.total}</strong> colleges
          </div>
          {pagination.totalPages > 1 && (
            <div>
              Page {pagination.page} of {pagination.totalPages}
            </div>
          )}
        </div>

        {/* Colleges Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--slate-muted)' }}>
            Loading colleges matching your filters...
          </div>
        ) : colleges.length > 0 ? (
          <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
            {colleges.map((college) => (
              <CollegeCard key={college._id} college={college} />
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <Compass size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Colleges Found</h3>
            <p style={{ color: 'var(--slate-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              We could not find any colleges matching your selected filters. Try broadening your search or resetting filters.
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-secondary btn-sm"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                className={`btn btn-sm ${page === num ? 'btn-primary' : 'btn-secondary'}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="btn btn-secondary btn-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Colleges;
