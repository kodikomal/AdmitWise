import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import {
  GraduationCap,
  Compass,
  Sparkles,
  BookOpen,
  User,
  LogOut,
  LayoutDashboard,
  Bookmark,
  History,
  ShieldCheck,
  Menu,
  X,
  Layers,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { compareCount } = useCompare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-border)', position: 'sticky', top: 0, zIndex: 90 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-dark)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Admit<span style={{ color: 'var(--primary)' }}>Wise</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--slate-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
              COLLEGE PREDICTOR
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hide-mobile">
          <Link
            to="/"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/') ? 'var(--primary)' : 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            Home
          </Link>
          <Link
            to="/colleges"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/colleges') ? 'var(--primary)' : 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Compass size={17} />
            Explore Colleges
          </Link>
          <Link
            to="/predict"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/predict') ? 'var(--primary)' : 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={17} color="#2563eb" />
            Predictor
          </Link>
          <Link
            to="/guidance"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: isActive('/guidance') ? 'var(--primary)' : 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <BookOpen size={17} />
            Guidance
          </Link>

          {/* Compare Badge Shortcut */}
          {compareCount > 0 && (
            <Link
              to="/compare"
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Layers size={15} />
              Compare ({compareCount})
            </Link>
          )}
        </nav>

        {/* Right CTA / Auth Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }} className="hide-mobile">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--slate-bg)',
                  border: '1px solid var(--slate-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 0.85rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: 'var(--navy-dark)',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
                {isAdmin && (
                  <span style={{ fontSize: '0.65rem', backgroundColor: '#dbeafe', color: '#1e40af', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                    ADMIN
                  </span>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: '220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--slate-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.5rem 0',
                    zIndex: 100,
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--slate-border)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-dark)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>{user.email}</div>
                  </div>

                  {!isAdmin && (
                    <>
                      <Link
                        to="/student/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--navy)' }}
                      >
                        <LayoutDashboard size={15} /> Student Dashboard
                      </Link>
                      <Link
                        to="/student/profile"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--navy)' }}
                      >
                        <User size={15} /> Academic Profile
                      </Link>
                      <Link
                        to="/student/history"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--navy)' }}
                      >
                        <History size={15} /> Prediction History
                      </Link>
                      <Link
                        to="/student/favourites"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--navy)' }}
                      >
                        <Bookmark size={15} /> Saved Colleges
                      </Link>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}
                      >
                        <ShieldCheck size={16} /> Admin Panel
                      </Link>
                    </>
                  )}

                  <div style={{ borderTop: '1px solid var(--slate-border)', marginTop: '0.25rem' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.85rem',
                        color: 'var(--danger)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--navy-dark)', cursor: 'pointer', display: 'none' }}
          className="show-mobile"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--slate-border)', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--navy)' }}>
              Home
            </Link>
            <Link to="/colleges" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--navy)' }}>
              Explore Colleges
            </Link>
            <Link to="/predict" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--primary)' }}>
              Admission Predictor
            </Link>
            <Link to="/guidance" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--navy)' }}>
              Admission Guidance
            </Link>
            <Link to="/compare" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--navy)' }}>
              Compare Colleges ({compareCount})
            </Link>

            <hr style={{ borderColor: 'var(--slate-border)', margin: '0.5rem 0' }} />

            {isAuthenticated ? (
              <>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-muted)' }}>Signed in as: <strong>{user?.name}</strong></div>
                {!isAdmin ? (
                  <>
                    <Link to="/student/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--navy)' }}>
                      Student Dashboard
                    </Link>
                    <Link to="/student/profile" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--navy)' }}>
                      Academic Profile
                    </Link>
                    <Link to="/student/history" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--navy)' }}>
                      Prediction History
                    </Link>
                  </>
                ) : (
                  <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
