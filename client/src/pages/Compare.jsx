import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { collegesAPI, coursesAPI } from '../services/api';
import {
  Layers,
  X,
  Plus,
  Compass,
  Award,
  IndianRupee,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();
  const [colleges, setColleges] = useState([]);
  const [cutoffs, setCutoffs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [allCollegesList, setAllCollegesList] = useState([]);
  const [addCollegeId, setAddCollegeId] = useState('');
  const [loading, setLoading] = useState(false);

  // Load all available colleges for the "Add college" dropdown
  useEffect(() => {
    collegesAPI.getAll({ limit: 50 }).then((res) => {
      if (res.success) setAllCollegesList(res.colleges || []);
    });
    coursesAPI.getAll().then((res) => {
      if (res.success) setCourses(res.courses || []);
    });
  }, []);

  // Fetch full details and cutoffs for the compared colleges
  useEffect(() => {
    if (compareList.length === 0) {
      setColleges([]);
      setCutoffs([]);
      return;
    }

    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const ids = compareList.map((c) => c._id);
        const res = await collegesAPI.compare(ids, selectedCourse !== 'All' ? selectedCourse : null);
        if (res.success) {
          setColleges(res.colleges || []);
          setCutoffs(res.cutoffs || []);
        }
      } catch (err) {
        console.error('Error fetching comparison data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [compareList, selectedCourse]);

  const handleAddCollege = (e) => {
    const colId = e.target.value;
    if (!colId) return;
    const targetCol = allCollegesList.find((c) => c._id === colId);
    if (targetCol) {
      const res = addToCompare(targetCol);
      if (!res.success) alert(res.message);
    }
    setAddCollegeId('');
  };

  if (compareList.length === 0) {
    return (
      <div className="py-16" style={{ backgroundColor: 'var(--slate-bg)' }}>
        <div className="container-narrow text-center">
          <div className="card" style={{ padding: '4rem 2rem' }}>
            <Layers size={48} color="#94a3b8" style={{ margin: '0 auto 1.25rem auto' }} />
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>No Colleges in Comparison Matrix</h2>
            <p style={{ color: 'var(--slate-muted)', maxWidth: '480px', margin: '0 auto 2rem auto', fontSize: '0.95rem' }}>
              Select up to 4 colleges from the directory or search results to evaluate courses, NAAC ratings, cutoffs, and fees side-by-side.
            </p>
            <Link to="/colleges" className="btn btn-primary btn-lg">
              <Compass size={18} /> Browse College Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <Layers size={13} /> Side-by-Side Matrix
            </div>
            <h1 style={{ fontSize: '2rem' }}>Compare Colleges ({colleges.length}/4)</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Evaluate admission prerequisites, fees, cutoffs, and university affiliations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {colleges.length < 4 && (
              <select
                className="form-select"
                value={addCollegeId}
                onChange={handleAddCollege}
                style={{ width: '220px', fontSize: '0.85rem' }}
              >
                <option value="">+ Add College to Matrix</option>
                {allCollegesList
                  .filter((col) => !compareList.some((c) => c._id === col._id))
                  .map((col) => (
                    <option key={col._id} value={col._id}>
                      {col.name} ({col.city})
                    </option>
                  ))}
              </select>
            )}

            <button onClick={clearCompare} className="btn btn-secondary btn-sm">
              Clear All
            </button>
          </div>
        </div>

        {/* Filter Cutoff by Program */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-light)' }}>
            Filter Cutoffs by Course:
          </span>
          <select
            className="form-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{ width: 'auto', fontSize: '0.85rem' }}
          >
            <option value="All">All Common Programs</option>
            {courses.map((c) => (
              <option key={c._id} value={c._id}>{c.shortName} - {c.name}</option>
            ))}
          </select>
        </div>

        {/* Comparison Matrix Table */}
        <div className="table-responsive" style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <table className="custom-table" style={{ fontSize: '0.88rem' }}>
            <thead>
              <tr>
                <th style={{ width: '200px', backgroundColor: '#f1f5f9' }}>Attribute</th>
                {colleges.map((col) => (
                  <th key={col._id} style={{ minWidth: '220px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Link to={`/colleges/${col._id}`} style={{ color: 'var(--navy-dark)', fontWeight: 700, fontSize: '0.95rem' }}>
                        {col.name}
                      </Link>
                      <button
                        onClick={() => removeFromCompare(col._id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                        title="Remove from comparison"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-muted)', fontWeight: 500, marginTop: '0.2rem' }}>
                      {col.city}, {col.state}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* College Type */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>College Type</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    <span className="badge badge-primary">{col.collegeType}</span>
                  </td>
                ))}
              </tr>

              {/* NAAC Accreditation */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>NAAC Grade</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    <span className="badge badge-outline">
                      <Award size={13} color="#2563eb" /> {col.naacGrade || 'Not Accredited'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* University Affiliation */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>University Affiliation</td>
                {colleges.map((col) => (
                  <td key={col._id}>{col.universityAffiliation}</td>
                ))}
              </tr>

              {/* Approx Annual Fees */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Approx. Annual Fees</td>
                {colleges.map((col) => (
                  <td key={col._id} style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ₹{col.annualFeesApprox ? col.annualFeesApprox.toLocaleString('en-IN') : 'Varies'}
                  </td>
                ))}
              </tr>

              {/* Established Year & Campus */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Campus & Established</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    {col.establishedYear} • {col.campusArea || 'Urban Campus'}
                  </td>
                ))}
              </tr>

              {/* Degree Programs Offered */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Programs Offered</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {col.coursesOffered && col.coursesOffered.length > 0 ? (
                        col.coursesOffered.map((crs) => (
                          <span
                            key={crs._id || crs}
                            style={{
                              backgroundColor: '#f1f5f9',
                              fontSize: '0.72rem',
                              padding: '0.2rem 0.45rem',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {crs.shortName || crs.name}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--slate-muted)' }}>Not listed</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Historical Cutoff Reference */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Historical Cutoffs</td>
                {colleges.map((col) => {
                  const colCutoffs = cutoffs.filter((c) => c.college === col._id || c.college?._id === col._id);
                  return (
                    <td key={col._id}>
                      {colCutoffs.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {colCutoffs.slice(0, 3).map((item) => (
                            <div key={item._id} style={{ fontSize: '0.78rem' }}>
                              <strong>{item.course?.shortName || 'Course'}:</strong> {item.cutoffValue}% ({item.category})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--slate-muted)', fontSize: '0.8rem' }}>No cutoffs available</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Official Website */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Official Portal</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    {col.officialWebsite ? (
                      <a href={col.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem' }}>
                        Visit Website <ExternalLink size={12} />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td style={{ fontWeight: 700, backgroundColor: '#f8fafc' }}>Actions</td>
                {colleges.map((col) => (
                  <td key={col._id}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <Link to={`/predict?collegeId=${col._id}`} className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
                        <Sparkles size={13} /> Predict Chance
                      </Link>
                      <Link to={`/colleges/${col._id}`} className="btn btn-secondary btn-sm" style={{ textAlign: 'center' }}>
                        Full Profile
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
