import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collegesAPI, favouritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import {
  MapPin,
  Award,
  Globe,
  Phone,
  Mail,
  Calendar,
  Layers,
  Bookmark,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Clock,
  BookOpen,
} from 'lucide-react';

const CollegeDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [college, setCollege] = useState(null);
  const [cutoffs, setCutoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);

  // Cutoff filter state
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        const res = await collegesAPI.getById(id);
        if (res.success && res.college) {
          setCollege(res.college);
          setCutoffs(res.cutoffs || []);
        } else {
          setError('College not found.');
        }

        if (isAuthenticated) {
          const favRes = await favouritesAPI.check(id);
          setIsFavourited(favRes.isFavourited);
        }
      } catch (err) {
        setError(err.message || 'Failed to load college details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id, isAuthenticated]);

  const handleToggleFav = async () => {
    if (!isAuthenticated) {
      alert('Please log in to save colleges to your favourites.');
      return;
    }

    try {
      if (isFavourited) {
        await favouritesAPI.remove(college._id);
        setIsFavourited(false);
      } else {
        await favouritesAPI.add(college._id);
        setIsFavourited(true);
      }
    } catch (err) {
      alert(err.message || 'Error updating favourites');
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)', fontSize: '1.1rem' }}>Loading college profile...</div>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="container py-16 text-center">
        <h2>College Not Found</h2>
        <p style={{ color: 'var(--slate-muted)', marginTop: '0.5rem' }}>{error || 'Unable to retrieve details.'}</p>
        <Link to="/colleges" className="btn btn-primary mt-4">
          Return to College Directory
        </Link>
      </div>
    );
  }

  const inComparison = isInCompare(college._id);

  // Filter cutoffs
  const availableYears = [...new Set(cutoffs.map((c) => c.academicYear))];
  const availableCategories = [...new Set(cutoffs.map((c) => c.category))];

  const filteredCutoffs = cutoffs.filter((c) => {
    if (selectedYear !== 'All' && c.academicYear !== selectedYear) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Main Header Card */}
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: '1 0 320px' }}>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{college.collegeType}</span>
                {college.naacGrade && (
                  <span className="badge badge-outline">
                    <Award size={13} color="#2563eb" /> NAAC {college.naacGrade}
                  </span>
                )}
                {college.isVerified && (
                  <span className="badge badge-high">
                    <CheckCircle size={12} /> Verified Data
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '2.1rem', color: 'var(--navy-dark)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                {college.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--slate-muted)', marginBottom: '0.5rem' }}>
                <MapPin size={16} />
                <span>{college.address}, {college.city}, {college.state} - {college.pincode}</span>
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--navy-light)', fontWeight: 600 }}>
                Affiliation: <span style={{ color: 'var(--primary)' }}>{college.universityAffiliation}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  if (inComparison) {
                    removeFromCompare(college._id);
                  } else {
                    addToCompare(college);
                  }
                }}
                className={`btn ${inComparison ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Layers size={16} />
                {inComparison ? 'In Comparison' : 'Add to Compare'}
              </button>

              <button onClick={handleToggleFav} className="btn btn-secondary">
                <Bookmark size={16} fill={isFavourited ? '#dc2626' : 'none'} color={isFavourited ? '#dc2626' : 'currentColor'} />
                {isFavourited ? 'Saved to Favourites' : 'Add to Favourites'}
              </button>

              <Link to={`/predict?collegeId=${college._id}`} className="btn btn-primary">
                <Sparkles size={16} />
                Predict My Chance
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-4" style={{ backgroundColor: 'var(--slate-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>ESTABLISHED</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{college.establishedYear || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>APPROX ANNUAL FEES</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                ₹{college.annualFeesApprox ? college.annualFeesApprox.toLocaleString('en-IN') : 'Varies by course'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>CAMPUS SIZE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{college.campusArea || 'Urban Campus'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>RATING</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ca8a04' }}>
                ★ {college.rating ? college.rating.toFixed(1) : '4.2'} / 5.0
              </div>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column: Courses Offered & Cutoffs (Span 2) */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Summary */}
            {college.summary && (
              <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>About the Institution</h3>
                <p style={{ color: 'var(--slate-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
                  {college.summary}
                </p>
              </div>
            )}

            {/* Courses Offered */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <BookOpen size={20} color="#2563eb" />
                <h3 style={{ fontSize: '1.15rem' }}>Academic Degree Programs Offered</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {college.coursesOffered && college.coursesOffered.length > 0 ? (
                  college.coursesOffered.map((crs) => (
                    <div
                      key={crs._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--slate-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {crs.degreeType || 'Undergraduate'} • {crs.durationYears} Years
                          </span>
                          <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-dark)', marginTop: '0.15rem' }}>
                            {crs.name} ({crs.shortName})
                          </h4>
                        </div>

                        <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                          {crs.admissionBasis === 'ENTRANCE_EXAM' ? 'Entrance Exam' : 'HSC Merit'}
                        </span>
                      </div>

                      {crs.eligibilityCriteria && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                          <strong>Eligibility Requirements:</strong> Min {crs.eligibilityCriteria.minHscPercentage}% aggregate in HSC ({crs.eligibilityCriteria.minHscReservedPercentage}% for reserved).
                          {crs.eligibilityCriteria.requiresMathsInHsc && (
                            <span style={{ color: '#b91c1c', fontWeight: 600 }}> Mathematics is compulsory in HSC.</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--slate-muted)' }}>No courses listed for this college.</p>
                )}
              </div>
            </div>

            {/* Historical Admission Cutoffs Table */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>Historical Admission Cutoffs</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-muted)' }}>
                    Actual published cutoff percentages & percentiles
                  </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {availableYears.length > 1 && (
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                    >
                      <option value="All">All Years</option>
                      {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}

                  {availableCategories.length > 1 && (
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                    >
                      <option value="All">All Categories</option>
                      {availableCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {filteredCutoffs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--slate-muted)', fontSize: '0.9rem' }}>
                  No cutoff records match the selected filter.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Program</th>
                        <th>Year</th>
                        <th>Round</th>
                        <th>Category</th>
                        <th>Cutoff Value</th>
                        <th>Fees (p.a.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCutoffs.map((item) => (
                        <tr key={item._id}>
                          <td style={{ fontWeight: 600 }}>{item.course?.shortName || item.course?.name || 'Program'}</td>
                          <td>{item.academicYear}</td>
                          <td>{item.admissionRound}</td>
                          <td>
                            <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                              {item.category}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {item.cutoffValue}% {item.cutoffType === 'PERCENTILE' ? 'ile' : ''}
                          </td>
                          <td>₹{item.annualFees ? item.annualFees.toLocaleString('en-IN') : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact, Portals, Verification (Span 1) */}
          <div>
            {/* Data Source & Verification Notice */}
            <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff', borderTop: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={18} color="#2563eb" />
                <h4 style={{ fontSize: '0.95rem' }}>Data Verification Notice</h4>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--slate-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {college.dataSource || 'Information compiled from published University of Mumbai merit lists and official college brochures.'}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Status: <strong>{college.isVerified ? 'Verified Academic Record' : 'Illustrative Sample'}</strong>
              </div>
            </div>

            {/* Official Contact & Admission Portals */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Contact & Portals</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                {college.officialWebsite && (
                  <div>
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.72rem', fontWeight: 600 }}>OFFICIAL WEBSITE</div>
                    <a href={college.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600 }}>
                      <Globe size={14} /> Visit Website <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {college.admissionPortalUrl && (
                  <div>
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.72rem', fontWeight: 600 }}>ADMISSION PORTAL</div>
                    <a href={college.admissionPortalUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 600 }}>
                      <ExternalLink size={14} /> Online Admission Portal
                    </a>
                  </div>
                )}

                {college.contactPhone && (
                  <div>
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.72rem', fontWeight: 600 }}>PHONE NUMBER</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--navy-dark)' }}>
                      <Phone size={14} /> {college.contactPhone}
                    </div>
                  </div>
                )}

                {college.contactEmail && (
                  <div>
                    <div style={{ color: 'var(--slate-muted)', fontSize: '0.72rem', fontWeight: 600 }}>CONTACT EMAIL</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--navy-dark)' }}>
                      <Mail size={14} /> {college.contactEmail}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campus Facilities */}
            {college.facilities && college.facilities.length > 0 && (
              <div className="card">
                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>Campus Infrastructure</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {college.facilities.map((fac, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: '#f1f5f9',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--navy-light)',
                      }}
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
