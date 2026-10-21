import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, AlertCircle, Sparkles, ShieldCheck, User } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/student/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(from);
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'student') {
      setEmail('student@admitwise.edu');
      setPassword('Student@123password');
    } else if (role === 'admin') {
      setEmail('admin@admitwise.edu');
      setPassword('Admin@123password');
    }
  };

  return (
    <div className="py-16" style={{ backgroundColor: 'var(--slate-bg)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow" style={{ maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', color: '#ffffff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <GraduationCap size={28} />
          </div>
          <h1 style={{ fontSize: '1.85rem', color: 'var(--navy-dark)' }}>Sign In to AdmitWise</h1>
          <p style={{ color: 'var(--slate-muted)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Access your admission predictions, saved colleges, and academic profile.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <div className="card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password *</label>
                <span
                  onClick={() => alert('For password recovery in development mode, use demo credentials or the npm run create-admin script.')}
                  style={{ fontSize: '0.78rem', color: 'var(--primary)', cursor: 'pointer' }}
                >
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Viva and College Evaluation */}
          <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--slate-border)', paddingTop: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center', marginBottom: '0.75rem' }}>
              Quick Demonstration Logins
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <User size={13} /> Demo Student
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                <ShieldCheck size={13} /> Demo Admin
              </button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--slate-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
