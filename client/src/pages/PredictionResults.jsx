import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { predictionsAPI, favouritesAPI } from '../services/api';
import ChanceBadge from '../components/common/ChanceBadge';
import {
  Download,
  RotateCcw,
  Layers,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  IndianRupee,
  MapPin,
  ExternalLink,
  ChevronRight,
  BarChart2,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const PredictionResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [prediction, setPrediction] = useState(location.state?.prediction || null);
  const [predictionId, setPredictionId] = useState(location.state?.predictionId || null);
  const [loading, setLoading] = useState(!prediction);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [sortBy, setSortBy] = useState('diff'); // 'diff', 'name', 'fees'
  const [favouritedMap, setFavouritedMap] = useState({});

  // If page loaded without navigation state (e.g. reload or direct ID query)
  useEffect(() => {
    if (!prediction) {
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get('id');
      if (id) {
        predictionsAPI
          .getById(id)
          .then((res) => {
            if (res.success && res.prediction) {
              setPrediction(res.prediction);
              setPredictionId(res.prediction._id);
            }
          })
          .catch(() => navigate('/predict'))
          .finally(() => setLoading(false));
      } else {
        navigate('/predict');
      }
    } else {
      setLoading(false);
    }
  }, [location, prediction, navigate]);

  const handleDownloadPdf = async () => {
    if (!predictionId) {
      alert('PDF generation is available for saved predictions. Please log in to permanently save your reports.');
      return;
    }

    try {
      setDownloadingPdf(true);
      const blob = await predictionsAPI.downloadPdf(predictionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AdmitWise_Report_${(prediction.courseName || 'Prediction').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Error generating PDF report.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleToggleFavourite = async (colId) => {
    if (!isAuthenticated) {
      alert('Please log in to save colleges to your favourites.');
      return;
    }

    const isFav = favouritedMap[colId];
    try {
      if (isFav) {
        await favouritesAPI.remove(colId);
        setFavouritedMap((prev) => ({ ...prev, [colId]: false }));
      } else {
        await favouritesAPI.add(colId);
        setFavouritedMap((prev) => ({ ...prev, [colId]: true }));
      }
    } catch (err) {
      alert(err.message || 'Error updating favourite');
    }
  };

  if (loading || !prediction) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)', fontSize: '1.1rem' }}>Loading Prediction Analysis...</div>
      </div>
    );
  }

  const p = prediction.academicSnapshot || {};
  const counts = prediction.summaryCounts || {};
  const results = prediction.results || [];

  // Filter results
  let filteredResults = results.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'HIGH') return item.chanceCategory === 'High Chance';
    if (activeTab === 'MODERATE') return item.chanceCategory === 'Moderate Chance';
    if (activeTab === 'LOW') return item.chanceCategory === 'Low Chance';
    if (activeTab === 'OTHER') return item.chanceCategory === 'Insufficient Data' || item.chanceCategory === 'Not Eligible';
    return true;
  });

  // Sort results
  filteredResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'diff') {
      if (a.scoreDifference !== null && b.scoreDifference !== null) {
        return b.scoreDifference - a.scoreDifference;
      }
      return 0;
    }
    if (sortBy === 'name') {
      return a.collegeName.localeCompare(b.collegeName);
    }
    if (sortBy === 'fees') {
      return (a.annualFees || 0) - (b.annualFees || 0);
    }
    return 0;
  });

  // Chart data: compare student score vs college cutoff for top 6 colleges
  const chartData = results
    .filter((r) => r.cutoffValue !== null && r.studentScore !== null)
    .slice(0, 6)
    .map((r) => ({
      name: r.collegeName.length > 18 ? r.collegeName.slice(0, 16) + '...' : r.collegeName,
      'Your Score': r.studentScore,
      'College Cutoff': r.cutoffValue,
      chance: r.chanceCategory,
    }));

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Results Analysis • {prediction.algorithmVersion || 'Rule-Based Engine'}
            </div>
            <h1 style={{ fontSize: '2rem' }}>Admission Prediction Results</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Target Program: <strong>{prediction.courseName}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/predict" className="btn btn-secondary">
              <RotateCcw size={16} /> New Prediction
            </Link>
            {predictionId ? (
              <button
                onClick={handleDownloadPdf}
                disabled={downloadingPdf}
                className="btn btn-primary"
              >
                <Download size={16} />
                {downloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
            ) : (
              <Link to="/register" className="btn btn-primary">
                Save & Download Report
              </Link>
            )}
          </div>
        </div>

        {/* Academic Snapshot Card */}
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Candidate Profile Evaluated
          </div>
          <div className="grid grid-cols-4 gap-4" style={{ fontSize: '0.9rem' }}>
            <div>
              <div style={{ color: 'var(--slate-muted)', fontSize: '0.75rem' }}>HSC AGGREGATE</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{p.hscPercentage}%</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-muted)', fontSize: '0.75rem' }}>MATHS MARKS</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.mathsMarks !== null ? p.mathsMarks : 'N/A'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-muted)', fontSize: '0.75rem' }}>CATEGORY</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.category || 'Open/General'}</div>
            </div>
            <div>
              <div style={{ color: 'var(--slate-muted)', fontSize: '0.75rem' }}>STREAM / REGION</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{p.stream || 'Science'} ({p.preferredCity || 'All'})</div>
            </div>
          </div>
        </div>

        {/* Summary Badges Grid */}
        <div className="grid grid-cols-5 gap-4" style={{ marginBottom: '2rem' }}>
          <div className="card text-center" style={{ padding: '1rem', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{counts.totalMatched || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>MATCHING COLLEGES</div>
          </div>
          <div className="card text-center" style={{ padding: '1rem', borderLeft: '4px solid var(--success)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>{counts.highChance || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>HIGH CHANCE</div>
          </div>
          <div className="card text-center" style={{ padding: '1rem', borderLeft: '4px solid var(--warning)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)' }}>{counts.moderateChance || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>MODERATE CHANCE</div>
          </div>
          <div className="card text-center" style={{ padding: '1rem', borderLeft: '4px solid var(--danger)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>{counts.lowChance || 0}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>LOW CHANCE</div>
          </div>
          <div className="card text-center" style={{ padding: '1rem', borderLeft: '4px solid #64748b' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#64748b' }}>
              {(counts.notEligible || 0) + (counts.insufficientData || 0)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>OTHER / INSUFFICIENT</div>
          </div>
        </div>

        {/* Visual Cutoff Benchmark Chart */}
        {chartData.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <BarChart2 size={20} color="#2563eb" />
              <h3 style={{ fontSize: '1.15rem' }}>Cutoff Comparison Benchmark (Top Colleges)</h3>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                  <YAxis domain={['auto', 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                  <Legend />
                  <Bar dataKey="Your Score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="College Cutoff" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Filter Tabs & Sorting Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('HIGH')}
              className={`btn btn-sm ${activeTab === 'HIGH' ? 'btn-primary' : 'btn-secondary'}`}
            >
              High Chance ({counts.highChance || 0})
            </button>
            <button
              onClick={() => setActiveTab('MODERATE')}
              className={`btn btn-sm ${activeTab === 'MODERATE' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Moderate ({counts.moderateChance || 0})
            </button>
            <button
              onClick={() => setActiveTab('LOW')}
              className={`btn btn-sm ${activeTab === 'LOW' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Low Chance ({counts.lowChance || 0})
            </button>
            <button
              onClick={() => setActiveTab('OTHER')}
              className={`btn btn-sm ${activeTab === 'OTHER' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Other ({((counts.notEligible || 0) + (counts.insufficientData || 0))})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>Sort by:</span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="diff">Best Score Margin</option>
              <option value="name">College Name (A-Z)</option>
              <option value="fees">Annual Fees (Lowest)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="card text-center" style={{ padding: '3rem' }}>
            <p style={{ color: 'var(--slate-muted)', fontSize: '1rem' }}>
              No colleges found matching the selected filter tab.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredResults.map((item, index) => {
              const inComparison = isInCompare(item.collegeId);
              const isFav = favouritedMap[item.collegeId];

              return (
                <div key={item.collegeId || index} className="card card-hover" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <ChanceBadge chance={item.chanceCategory} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', fontWeight: 600 }}>
                          {item.collegeType} • {item.universityAffiliation}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)' }}>
                        <Link to={`/colleges/${item.collegeId}`} style={{ color: 'inherit' }}>
                          {item.collegeName}
                        </Link>
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--slate-muted)', marginTop: '0.2rem' }}>
                        <MapPin size={14} />
                        <span>{item.collegeCity || 'Mumbai'}</span>
                      </div>
                    </div>

                    {/* Numerical Comparison Metrics */}
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>HISTORICAL CUTOFF</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                          {item.cutoffValue !== null ? `${item.cutoffValue}%` : 'N/A'}
                        </div>
                        {item.academicYearUsed && item.academicYearUsed !== 'N/A' && (
                          <div style={{ fontSize: '0.68rem', color: 'var(--slate-muted)' }}>
                            {item.academicYearUsed} ({item.admissionRoundUsed})
                          </div>
                        )}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>ANNUAL FEES</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                          {item.annualFees ? `₹${item.annualFees.toLocaleString('en-IN')}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reasons / Explanation Callout */}
                  <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-light)', marginBottom: '0.35rem' }}>
                      AdmitWise Recommendation Rationale:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--slate-muted)', lineHeight: 1.5 }}>
                      {item.reasons && item.reasons.length > 0 ? (
                        item.reasons.map((reason, rIdx) => <li key={rIdx}>{reason}</li>)
                      ) : (
                        <li>Evaluated against historical university merit criteria.</li>
                      )}
                    </ul>
                    {item.dataSource && (
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        Source: {item.dataSource}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          if (inComparison) {
                            removeFromCompare(item.collegeId);
                          } else {
                            addToCompare({ _id: item.collegeId, name: item.collegeName });
                          }
                        }}
                        className={`btn btn-sm ${inComparison ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        <Layers size={14} />
                        {inComparison ? 'In Comparison' : 'Add to Compare'}
                      </button>

                      <button
                        onClick={() => handleToggleFavourite(item.collegeId)}
                        className="btn btn-secondary btn-sm"
                      >
                        <Bookmark size={14} fill={isFav ? '#dc2626' : 'none'} color={isFav ? '#dc2626' : 'currentColor'} />
                        {isFav ? 'Saved' : 'Save'}
                      </button>
                    </div>

                    <Link to={`/colleges/${item.collegeId}`} className="btn btn-outline btn-sm">
                      View College Profile <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResults;
