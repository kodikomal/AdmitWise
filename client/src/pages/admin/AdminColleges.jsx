import React, { useState, useEffect } from 'react';
import { adminAPI, coursesAPI } from '../../services/api';
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [collegeType, setCollegeType] = useState('Autonomous');
  const [universityAffiliation, setUniversityAffiliation] = useState('University of Mumbai');
  const [naacGrade, setNaacGrade] = useState('A');
  const [annualFeesApprox, setAnnualFeesApprox] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [admissionPortalUrl, setAdmissionPortalUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [dataSource, setDataSource] = useState('Official College Prospectus & MU Records');

  const fetchColleges = async (page = 1) => {
    try {
      setLoading(true);
      const res = await adminAPI.getColleges({ page, limit: 15, search });
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

  useEffect(() => {
    fetchColleges(1);
    coursesAPI.getAll().then((res) => {
      if (res.success) setCourses(res.courses || []);
    });
  }, [search]);

  const handleOpenAdd = () => {
    setEditingCollege(null);
    setName('');
    setCode('');
    setAddress('');
    setCity('Mumbai');
    setCollegeType('Autonomous');
    setUniversityAffiliation('University of Mumbai');
    setNaacGrade('A');
    setAnnualFeesApprox('45000');
    setOfficialWebsite('');
    setAdmissionPortalUrl('');
    setContactEmail('');
    setContactPhone('');
    setSummary('');
    setSelectedCourses(courses.slice(0, 2).map((c) => c._id));
    setDataSource('Official College Prospectus & MU Records');
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollege(col);
    setName(col.name);
    setCode(col.code || '');
    setAddress(col.address);
    setCity(col.city);
    setCollegeType(col.collegeType);
    setUniversityAffiliation(col.universityAffiliation);
    setNaacGrade(col.naacGrade || 'A');
    setAnnualFeesApprox(col.annualFeesApprox ? col.annualFeesApprox.toString() : '');
    setOfficialWebsite(col.officialWebsite || '');
    setAdmissionPortalUrl(col.admissionPortalUrl || '');
    setContactEmail(col.contactEmail || '');
    setContactPhone(col.contactPhone || '');
    setSummary(col.summary || '');
    setSelectedCourses(col.coursesOffered ? col.coursesOffered.map((c) => (typeof c === 'object' ? c._id : c)) : []);
    setDataSource(col.dataSource || '');
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !address || !city) {
      setFormError('Please fill in Name, Address, and City.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        code,
        address,
        city,
        collegeType,
        universityAffiliation,
        naacGrade,
        annualFeesApprox: annualFeesApprox ? parseFloat(annualFeesApprox) : 0,
        officialWebsite,
        admissionPortalUrl,
        contactEmail,
        contactPhone,
        summary,
        coursesOffered: selectedCourses,
        dataSource,
        isVerified: true,
      };

      if (editingCollege) {
        await adminAPI.updateCollege(editingCollege._id, payload);
      } else {
        await adminAPI.createCollege(payload);
      }

      setShowModal(false);
      fetchColleges(pagination.page);
    } catch (err) {
      setFormError(err.message || 'Error saving college record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (col) => {
    if (
      !window.confirm(
        `Are you sure you want to delete '${col.name}'? This will also remove its associated cutoffs.`
      )
    ) {
      return;
    }

    try {
      await adminAPI.deleteCollege(col._id);
      fetchColleges(pagination.page);
    } catch (err) {
      alert(err.message || 'Error deleting college.');
    }
  };

  const toggleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Navigation & Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Admin Dashboard
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <Building2 size={13} /> College Catalog
            </div>
            <h1 style={{ fontSize: '2rem' }}>College Management ({pagination.total})</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Add, edit, and maintain college records and accreditation status.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Add New College
          </button>
        </div>

        {/* Search */}
        <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search colleges by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>
        </div>

        {/* Colleges Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>College Name</th>
                <th>City</th>
                <th>Type</th>
                <th>NAAC</th>
                <th>Approx Fees</th>
                <th>Programs</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((col) => (
                <tr key={col._id}>
                  <td style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>
                    <Link to={`/colleges/${col._id}`} style={{ color: 'inherit' }}>
                      {col.name}
                    </Link>
                    {col.code && <span style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', display: 'block' }}>Code: {col.code}</span>}
                  </td>
                  <td>{col.city}</td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {col.collegeType}
                    </span>
                  </td>
                  <td>{col.naacGrade || 'N/A'}</td>
                  <td>₹{col.annualFeesApprox ? col.annualFeesApprox.toLocaleString('en-IN') : 'N/A'}</td>
                  <td>{col.coursesOffered?.length || 0} courses</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => handleOpenEdit(col)}
                        className="btn btn-secondary btn-sm"
                        title="Edit College"
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(col)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete College"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Add or Edit College */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>
                  {editingCollege ? `Edit: ${editingCollege.name}` : 'Add New College'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">College Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">College Code / DTE Code</label>
                    <input
                      type="text"
                      className="form-input"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                      <option value="Thane">Thane</option>
                      <option value="Pune">Pune</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">College Type *</label>
                    <select className="form-select" value={collegeType} onChange={(e) => setCollegeType(e.target.value)}>
                      <option value="Autonomous">Autonomous</option>
                      <option value="Government">Government</option>
                      <option value="Government-Aided">Government-Aided</option>
                      <option value="Private-Aided">Private-Aided</option>
                      <option value="Private-Unaided">Private-Unaided</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">NAAC Grade</label>
                    <select className="form-select" value={naacGrade} onChange={(e) => setNaacGrade(e.target.value)}>
                      <option value="A++">A++</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B++">B++</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Approx Annual Fees (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={annualFeesApprox}
                      onChange={(e) => setAnnualFeesApprox(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">University Affiliation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={universityAffiliation}
                    onChange={(e) => setUniversityAffiliation(e.target.value)}
                  />
                </div>

                {/* Courses Offered Selector */}
                <div className="form-group">
                  <label className="form-label">Assign Degree Programs Offered</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto', border: '1px solid var(--slate-border)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                    {courses.map((crs) => {
                      const isSelected = selectedCourses.includes(crs._id);
                      return (
                        <button
                          type="button"
                          key={crs._id}
                          onClick={() => toggleCourseSelect(crs._id)}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--primary)' : 'var(--slate-border)',
                            backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                            color: isSelected ? 'var(--primary-dark)' : 'var(--navy-light)',
                          }}
                        >
                          {isSelected && '✓ '} {crs.shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Official Website</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={officialWebsite}
                      onChange={(e) => setOfficialWebsite(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admission Portal URL</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://..."
                      value={admissionPortalUrl}
                      onChange={(e) => setAdmissionPortalUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">College Summary / Highlights</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--slate-border)', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving...' : editingCollege ? 'Save Updates' : 'Create College'}
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

export default AdminColleges;
