import React, { useState, useEffect } from 'react';
import { adminAPI, collegesAPI, coursesAPI } from '../../services/api';
import { BarChart3, Plus, Edit, Trash2, X, ArrowLeft, Filter, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminCutoffs = () => {
  const [cutoffs, setCutoffs] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filter state
  const [filterCollege, setFilterCollege] = useState('All');
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCutoff, setEditingCutoff] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [collegeId, setCollegeId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [admissionRound, setAdmissionRound] = useState('Round 1');
  const [category, setCategory] = useState('Open/General');
  const [examination, setExamination] = useState('HSC Aggregate %');
  const [cutoffType, setCutoffType] = useState('PERCENTAGE');
  const [cutoffValue, setCutoffValue] = useState('');
  const [annualFees, setAnnualFees] = useState('');
  const [source, setSource] = useState('Mumbai University Official Merit List 2024');

  const fetchCutoffs = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        collegeId: filterCollege !== 'All' ? filterCollege : undefined,
        courseId: filterCourse !== 'All' ? filterCourse : undefined,
        academicYear: filterYear !== 'All' ? filterYear : undefined,
        category: filterCategory !== 'All' ? filterCategory : undefined,
      };

      const res = await adminAPI.getCutoffs(params);
      if (res.success) {
        setCutoffs(res.cutoffs || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error fetching cutoffs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCutoffs(1);
  }, [filterCollege, filterCourse, filterYear, filterCategory]);

  useEffect(() => {
    collegesAPI.getAll({ limit: 100 }).then((res) => {
      if (res.success) setColleges(res.colleges || []);
    });
    coursesAPI.getAll().then((res) => {
      if (res.success) setCourses(res.courses || []);
    });
  }, []);

  const handleOpenAdd = () => {
    setEditingCutoff(null);
    setCollegeId(colleges[0]?._id || '');
    setCourseId(courses[0]?._id || '');
    setAcademicYear('2024-2025');
    setAdmissionRound('Round 1');
    setCategory('Open/General');
    setExamination('HSC Aggregate %');
    setCutoffType('PERCENTAGE');
    setCutoffValue('');
    setAnnualFees('45000');
    setSource('Mumbai University Official Merit List 2024');
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingCutoff(item);
    setCollegeId(typeof item.college === 'object' ? item.college._id : item.college);
    setCourseId(typeof item.course === 'object' ? item.course._id : item.course);
    setAcademicYear(item.academicYear);
    setAdmissionRound(item.admissionRound);
    setCategory(item.category);
    setExamination(item.examination || 'HSC Aggregate %');
    setCutoffType(item.cutoffType || 'PERCENTAGE');
    setCutoffValue(item.cutoffValue?.toString() || '');
    setAnnualFees(item.annualFees ? item.annualFees.toString() : '');
    setSource(item.source || '');
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(cutoffValue);
    if (isNaN(val) || val < 0) {
      setError('Please provide a valid cutoff value.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        college: collegeId,
        course: courseId,
        academicYear,
        admissionRound,
        category,
        examination,
        cutoffType,
        cutoffValue: val,
        annualFees: annualFees ? parseFloat(annualFees) : 0,
        source,
        isVerified: true,
      };

      if (editingCutoff) {
        await adminAPI.updateCutoff(editingCutoff._id, payload);
      } else {
        await adminAPI.createCutoff(payload);
      }

      setShowModal(false);
      fetchCutoffs(pagination.page);
    } catch (err) {
      setError(err.message || 'Error saving cutoff record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete cutoff record (${item.cutoffValue}%)?`)) return;

    try {
      await adminAPI.deleteCutoff(item._id);
      fetchCutoffs(pagination.page);
    } catch (err) {
      alert(err.message || 'Error deleting cutoff.');
    }
  };

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <BarChart3 size={13} /> Admission Benchmarks
            </div>
            <h1 style={{ fontSize: '2rem' }}>Historical Cutoff Management ({pagination.total})</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Maintain verified round-by-round merit list cutoff percentages and percentiles.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Add Cutoff Record
          </button>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Filter by College</label>
              <select
                className="form-select"
                value={filterCollege}
                onChange={(e) => setFilterCollege(e.target.value)}
              >
                <option value="All">All Colleges</option>
                {colleges.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Filter by Course</label>
              <select
                className="form-select"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="All">All Courses</option>
                {courses.map((crs) => (
                  <option key={crs._id} value={crs._id}>{crs.shortName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Academic Year</label>
              <select
                className="form-select"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="All">All Academic Years</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.78rem' }}>Category</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Open/General">Open / General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cutoffs Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>College</th>
                <th>Course</th>
                <th>Year</th>
                <th>Round</th>
                <th>Category</th>
                <th>Exam Basis</th>
                <th>Cutoff Value</th>
                <th>Annual Fees</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cutoffs.map((item) => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 600 }}>{item.college?.name || 'College'}</td>
                  <td>{item.course?.shortName || item.course?.name || 'Course'}</td>
                  <td>{item.academicYear}</td>
                  <td>{item.admissionRound}</td>
                  <td>
                    <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>{item.examination}</td>
                  <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                    {item.cutoffValue}% {item.cutoffType === 'PERCENTILE' ? 'ile' : ''}
                  </td>
                  <td>₹{item.annualFees ? item.annualFees.toLocaleString('en-IN') : 'N/A'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button onClick={() => handleOpenEdit(item)} className="btn btn-secondary btn-sm">
                        <Edit size={13} />
                      </button>
                      <button onClick={() => handleDelete(item)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Add or Edit Cutoff */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>
                  {editingCutoff ? 'Edit Historical Cutoff Record' : 'Add Historical Cutoff Record'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">College *</label>
                  <select className="form-select" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required>
                    {colleges.map((col) => (
                      <option key={col._id} value={col._id}>{col.name} ({col.city})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Course *</label>
                  <select className="form-select" value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
                    {courses.map((crs) => (
                      <option key={crs._id} value={crs._id}>{crs.name} ({crs.shortName})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Academic Year *</label>
                    <select className="form-select" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2022-2023">2022-2023</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admission Round *</label>
                    <select className="form-select" value={admissionRound} onChange={(e) => setAdmissionRound(e.target.value)}>
                      <option value="Round 1">Round 1 (First Merit List)</option>
                      <option value="Round 2">Round 2 (Second Merit List)</option>
                      <option value="Round 3">Round 3 (Third Merit List)</option>
                      <option value="Institutional / Spot">Institutional / Spot Round</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Open/General">Open / General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                      <option value="TFWS">TFWS</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cutoff Value (%, Percentile) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="e.g. 84.50"
                      value={cutoffValue}
                      onChange={(e) => setCutoffValue(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Examination Basis</label>
                    <select className="form-select" value={examination} onChange={(e) => setExamination(e.target.value)}>
                      <option value="HSC Aggregate %">HSC Aggregate %</option>
                      <option value="MHT-CET Percentile">MHT-CET Percentile</option>
                      <option value="JEE Main Percentile">JEE Main Percentile</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Annual Fees (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={annualFees}
                      onChange={(e) => setAnnualFees(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Data Source</label>
                  <input
                    type="text"
                    className="form-input"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--slate-border)', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving...' : editingCutoff ? 'Save Cutoff' : 'Create Cutoff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCutoffs;
