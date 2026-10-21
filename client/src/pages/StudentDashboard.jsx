import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import CollegeCard from '../components/common/CollegeCard';
import {
  User,
  Sparkles,
  Bookmark,
  History,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  IndianRupee,
  Calendar,
  Compass,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await studentAPI.getDashboard();
        if (res.success) {
          setDashboardData(res);
        }
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)', fontSize: '1.1rem' }}>Loading Student Dashboard...</div>
      </div>
    );
  }

  const stats = dashboardData?.stats || { predictionCount: 0, favouriteCount: 0, profileCompletion: 50 };
  const profile = dashboardData?.academicProfile || user?.academicProfile || {};
  const recentPredictions = dashboardData?.recentPredictions || [];
  const recommendedColleges = dashboardData?.recommendedColleges || [];

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              Student Portal
            </div>
            <h1 style={{ fontSize: '2.1rem' }}>Welcome back, {user?.name}!</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Track your admission predictions, saved colleges, and academic eligibility profile.
            </p>
          </div>

          <Link to="/predict" className="btn btn-primary btn-lg">
            <Sparkles size={18} /> Run New Prediction
          </Link>
        </div>

        {/* Profile Completion Indicator */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} color="var(--primary)" />
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                Academic Profile Completion: {stats.profileCompletion}%
              </span>
            </div>
            <Link to="/student/profile" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Edit Profile →
            </Link>
          </div>

          <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${stats.profileCompletion}%`,
                height: '100%',
                backgroundColor: stats.profileCompletion > 70 ? 'var(--success)' : 'var(--primary)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {stats.profileCompletion < 80 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', marginTop: '0.45rem' }}>
              Tip: Completing your HSC stream, Mathematics marks, and annual fee budget improves recommendation accuracy.
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
          {/* Card 1: Academic Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
                Academic Snapshot
              </span>
              <User size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '0.25rem' }}>
              {profile.hscPercentage ? `${profile.hscPercentage}%` : 'Not Set'}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)' }}>
              Stream: <strong>{profile.hscStream || 'Science'}</strong> • Category: <strong>{profile.category || 'Open'}</strong>
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--slate-border)', paddingTop: '0.75rem' }}>
              <Link to="/student/profile" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Update Academic Details →
              </Link>
            </div>
          </div>

          {/* Card 2: Predictions Count */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
                Total Predictions
              </span>
              <History size={18} color="var(--primary)" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '0.25rem' }}>
              {stats.predictionCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)' }}>
              Completed admission cutoff evaluations
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--slate-border)', paddingTop: '0.75rem' }}>
              <Link to="/student/history" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                View Full History →
              </Link>
            </div>
          </div>

          {/* Card 3: Saved Favourites */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
                Saved Colleges
              </span>
              <Bookmark size={18} color="#dc2626" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-dark)', marginBottom: '0.25rem' }}>
              {stats.favouriteCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)' }}>
              Bookmarked colleges for comparison
            </div>
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--slate-border)', paddingTop: '0.75rem' }}>
              <Link to="/student/favourites" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                Open Saved Colleges →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Prediction History */}
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Prediction Runs</h3>
            <Link to="/student/history" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All ({stats.predictionCount})
            </Link>
          </div>

          {recentPredictions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--slate-muted)' }}>
              <Sparkles size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>You haven't run any admission predictions yet.</p>
              <Link to="/predict" className="btn btn-primary btn-sm">
                Run Your First Prediction
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Target Program</th>
                    <th>Date</th>
                    <th>HSC % Used</th>
                    <th>High Chance</th>
                    <th>Moderate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((pred) => (
                    <tr key={pred._id}>
                      <td style={{ fontWeight: 600, color: 'var(--navy-dark)' }}>{pred.courseName}</td>
                      <td>{new Date(pred.createdAt).toLocaleDateString('en-IN')}</td>
                      <td>{pred.academicSnapshot?.hscPercentage}%</td>
                      <td>
                        <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
                          {pred.summaryCounts?.highChance || 0} Colleges
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-moderate" style={{ fontSize: '0.72rem' }}>
                          {pred.summaryCounts?.moderateChance || 0} Colleges
                        </span>
                      </td>
                      <td>
                        <Link to={`/predict/results?id=${pred._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}>
                          View Results →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recommended Colleges for this Student */}
        {recommendedColleges.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Recommended Colleges for You</h3>
              <Link to="/colleges" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Explore All Colleges
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {recommendedColleges.map((col) => (
                <div key={col._id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary">{col.collegeType}</span>
                      {col.naacGrade && <span className="badge badge-outline">NAAC {col.naacGrade}</span>}
                    </div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                      <Link to={`/colleges/${col._id}`} style={{ color: 'inherit' }}>
                        {col.name}
                      </Link>
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-muted)' }}>{col.city}</div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                      ₹{col.annualFeesApprox ? col.annualFeesApprox.toLocaleString('en-IN') : 'Varies'} / yr
                    </span>
                    <Link to={`/predict?collegeId=${col._id}`} className="btn btn-primary btn-sm">
                      Predict <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
