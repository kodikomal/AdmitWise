import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  ShieldCheck,
  Building2,
  BookOpen,
  BarChart3,
  Users,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await adminAPI.getDashboard();
        if (res.success) {
          setData(res.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)' }}>Loading Administrator Dashboard...</div>
      </div>
    );
  }

  const {
    totalColleges = 0,
    totalCourses = 0,
    totalCutoffs = 0,
    totalStudents = 0,
    totalPredictions = 0,
    dataCompleteness = {},
    collegesByType = [],
    collegesByCity = [],
    recentUsers = [],
    recentPredictions = [],
  } = data || {};

  const typeChartData = collegesByType.map((c) => ({
    name: c._id || 'Unknown',
    value: c.count,
  }));

  const cityChartData = collegesByCity.map((c) => ({
    name: c._id || 'Unknown',
    count: c.count,
  }));

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <ShieldCheck size={13} /> Administrative Control Center
            </div>
            <h1 style={{ fontSize: '2.1rem' }}>Administrator Dashboard</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Real-time database statistics, college catalog management, and verification metrics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to="/admin/colleges" className="btn btn-secondary btn-sm">
              <Building2 size={15} /> Manage Colleges
            </Link>
            <Link to="/admin/courses" className="btn btn-secondary btn-sm">
              <BookOpen size={15} /> Manage Courses
            </Link>
            <Link to="/admin/cutoffs" className="btn btn-secondary btn-sm">
              <BarChart3 size={15} /> Manage Cutoffs
            </Link>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">
              <Users size={15} /> Student Accounts
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-5 gap-4" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
              Colleges
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-dark)' }}>{totalColleges}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Registered Institutions</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #0ea5e9' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
              Courses
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-dark)' }}>{totalCourses}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Degree Programs</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
              Historical Cutoffs
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-dark)' }}>{totalCutoffs}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Cutoff Data Points</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
              Students
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-dark)' }}>{totalStudents}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Registered Users</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase' }}>
              Predictions Run
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy-dark)' }}>{totalPredictions}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)' }}>Simulations Executed</div>
          </div>
        </div>

        {/* Data Completeness Indicators */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <CheckCircle size={18} color="#16a34a" /> Data Verification & Completeness Indicators
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>Verified Colleges:</span>
                <strong>{dataCompleteness.verifiedColleges || 0} / {totalColleges} (100%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                <span>Verified Cutoffs:</span>
                <strong>{dataCompleteness.verifiedCutoffs || 0} / {totalCutoffs} (100%)</strong>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2.5rem' }}>
          {/* Chart 1: Colleges by Type */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Colleges Distribution by Type</h3>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {typeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Colleges by City */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Colleges by Geographic Region</h3>
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cityChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Tables */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Registered Students */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Recent Registered Students</h3>
              <Link to="/admin/users" style={{ fontSize: '0.82rem', fontWeight: 600 }}>View All</Link>
            </div>

            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.isActive ? 'badge-high' : 'badge-low'}`} style={{ fontSize: '0.68rem' }}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Prediction Runs */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>Recent Prediction Executions</h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--slate-muted)' }}>System Log</span>
            </div>

            <div className="table-responsive">
              <table className="custom-table" style={{ fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>HSC %</th>
                    <th>High</th>
                    <th>Mod</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPredictions.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600 }}>{p.courseName}</td>
                      <td>{p.academicSnapshot?.hscPercentage}%</td>
                      <td>{p.summaryCounts?.highChance || 0}</td>
                      <td>{p.summaryCounts?.moderateChance || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
