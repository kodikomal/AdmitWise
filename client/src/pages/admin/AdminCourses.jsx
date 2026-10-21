import React, { useState, useEffect } from 'react';
import { coursesAPI, adminAPI } from '../../services/api';
import { BookOpen, Plus, Edit, Trash2, X, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [stream, setStream] = useState('Information Technology');
  const [degreeType, setDegreeType] = useState('Undergraduate');
  const [durationYears, setDurationYears] = useState('3');
  const [admissionBasis, setAdmissionBasis] = useState('HSC_MERIT');
  const [minHscPercentage, setMinHscPercentage] = useState('45');
  const [minHscReservedPercentage, setMinHscReservedPercentage] = useState('40');
  const [requiresMathsInHsc, setRequiresMathsInHsc] = useState(false);
  const [description, setDescription] = useState('');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await coursesAPI.getAll();
      if (res.success) {
        setCourses(res.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setName('');
    setShortName('');
    setStream('Information Technology');
    setDegreeType('Undergraduate');
    setDurationYears('3');
    setAdmissionBasis('HSC_MERIT');
    setMinHscPercentage('45');
    setMinHscReservedPercentage('40');
    setRequiresMathsInHsc(false);
    setDescription('');
    setError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (crs) => {
    setEditingCourse(crs);
    setName(crs.name);
    setShortName(crs.shortName);
    setStream(crs.stream);
    setDegreeType(crs.degreeType || 'Undergraduate');
    setDurationYears(crs.durationYears?.toString() || '3');
    setAdmissionBasis(crs.admissionBasis || 'HSC_MERIT');
    setMinHscPercentage(crs.eligibilityCriteria?.minHscPercentage?.toString() || '45');
    setMinHscReservedPercentage(crs.eligibilityCriteria?.minHscReservedPercentage?.toString() || '40');
    setRequiresMathsInHsc(!!crs.eligibilityCriteria?.requiresMathsInHsc);
    setDescription(crs.description || '');
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !shortName) {
      setError('Please provide Course Name and Short Name.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name,
        shortName,
        stream,
        degreeType,
        durationYears: parseInt(durationYears, 10),
        admissionBasis,
        eligibilityCriteria: {
          minHscPercentage: parseFloat(minHscPercentage),
          minHscReservedPercentage: parseFloat(minHscReservedPercentage),
          requiresMathsInHsc,
        },
        description,
      };

      if (editingCourse) {
        await adminAPI.updateCourse(editingCourse._id, payload);
      } else {
        await adminAPI.createCourse(payload);
      }

      setShowModal(false);
      fetchCourses();
    } catch (err) {
      setError(err.message || 'Error saving course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (crs) => {
    if (!window.confirm(`Are you sure you want to delete '${crs.name}'?`)) return;

    try {
      await adminAPI.deleteCourse(crs._id);
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Error deleting course.');
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
              <BookOpen size={13} /> Curriculum Catalog
            </div>
            <h1 style={{ fontSize: '2rem' }}>Course Management ({courses.length})</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Define degree programs, durations, streams, and mandatory academic prerequisites.
            </p>
          </div>

          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={16} /> Add New Program
          </button>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Program Name</th>
                <th>Stream</th>
                <th>Duration</th>
                <th>Admission Basis</th>
                <th>Min HSC %</th>
                <th>Maths Required</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((crs) => (
                <tr key={crs._id}>
                  <td style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>
                    {crs.name} <span style={{ color: 'var(--primary)' }}>({crs.shortName})</span>
                  </td>
                  <td>{crs.stream}</td>
                  <td>{crs.durationYears} Years</td>
                  <td>
                    <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                      {crs.admissionBasis === 'ENTRANCE_EXAM' ? 'Entrance Exam' : 'HSC Merit'}
                    </span>
                  </td>
                  <td>{crs.eligibilityCriteria?.minHscPercentage || 45}%</td>
                  <td>
                    {crs.eligibilityCriteria?.requiresMathsInHsc ? (
                      <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>Yes</span>
                    ) : (
                      <span style={{ color: 'var(--slate-muted)', fontSize: '0.8rem' }}>No</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button onClick={() => handleOpenEdit(crs)} className="btn btn-secondary btn-sm">
                        <Edit size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(crs)} className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal: Add or Edit Course */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.35rem' }}>
                  {editingCourse ? `Edit: ${editingCourse.name}` : 'Add New Degree Program'}
                </h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={20} />
                </button>
              </div>

              {error && <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Program Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. B.Sc. Information Technology"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Short Name / Code *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. B.Sc. IT"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stream *</label>
                    <select className="form-select" value={stream} onChange={(e) => setStream(e.target.value)}>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Management">Management</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Duration (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      className="form-input"
                      value={durationYears}
                      onChange={(e) => setDurationYears(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Admission Basis</label>
                    <select className="form-select" value={admissionBasis} onChange={(e) => setAdmissionBasis(e.target.value)}>
                      <option value="HSC_MERIT">HSC Merit Based</option>
                      <option value="ENTRANCE_EXAM">Entrance Examination (MHT-CET / JEE)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Min HSC % (General)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={minHscPercentage}
                      onChange={(e) => setMinHscPercentage(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min HSC % (Reserved)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={minHscReservedPercentage}
                      onChange={(e) => setMinHscReservedPercentage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="reqMaths"
                    checked={requiresMathsInHsc}
                    onChange={(e) => setRequiresMathsInHsc(e.target.checked)}
                  />
                  <label htmlFor="reqMaths" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-dark)', cursor: 'pointer' }}>
                    Mathematics in HSC is a Mandatory Prerequisite (e.g. for B.Sc. IT & Engineering)
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', borderTop: '1px solid var(--slate-border)', paddingTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Program'}
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

export default AdminCourses;
