import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { favouritesAPI } from '../../services/api';
import { MapPin, Award, IndianRupee, Bookmark, Check, Layers, ExternalLink, ArrowRight } from 'lucide-react';

const CollegeCard = ({ college, initialFavourited = false, onFavouriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const [isFav, setIsFav] = useState(initialFavourited);
  const [favLoading, setFavLoading] = useState(false);

  const inComparison = isInCompare(college._id);

  const handleToggleFavourite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in as a student to save colleges to your favourites.');
      return;
    }

    try {
      setFavLoading(true);
      if (isFav) {
        await favouritesAPI.remove(college._id);
        setIsFav(false);
        if (onFavouriteToggle) onFavouriteToggle(college._id, false);
      } else {
        await favouritesAPI.add(college._id);
        setIsFav(true);
        if (onFavouriteToggle) onFavouriteToggle(college._id, true);
      }
    } catch (err) {
      alert(err.message || 'Error updating favourites');
    } finally {
      setFavLoading(false);
    }
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeFromCompare(college._id);
    } else {
      const res = addToCompare(college);
      if (!res.success) {
        alert(res.message);
      }
    }
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Top Meta Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
            {college.collegeType || 'College'}
          </span>
          {college.naacGrade && (
            <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
              <Award size={12} color="#2563eb" /> NAAC {college.naacGrade}
            </span>
          )}
          {college.isVerified && (
            <span className="badge badge-high" style={{ fontSize: '0.68rem' }}>
              <Check size={11} /> Verified
            </span>
          )}
        </div>

        {/* Action icons */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={handleToggleCompare}
            title={inComparison ? 'Remove from compare' : 'Add to compare'}
            style={{
              background: inComparison ? 'var(--primary)' : 'var(--slate-bg)',
              color: inComparison ? '#ffffff' : 'var(--slate-muted)',
              border: '1px solid var(--slate-border)',
              borderRadius: '6px',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={14} />
          </button>
          <button
            onClick={handleToggleFavourite}
            disabled={favLoading}
            title={isFav ? 'Remove favourite' : 'Save to favourites'}
            style={{
              background: isFav ? '#fee2e2' : 'var(--slate-bg)',
              color: isFav ? '#dc2626' : 'var(--slate-muted)',
              border: '1px solid var(--slate-border)',
              borderRadius: '6px',
              padding: '0.35rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bookmark size={14} fill={isFav ? '#dc2626' : 'none'} />
          </button>
        </div>
      </div>

      {/* College Title */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-dark)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
        <Link to={`/colleges/${college._id}`} style={{ color: 'inherit' }}>
          {college.name}
        </Link>
      </h3>

      {/* Location & Affiliation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--slate-muted)', marginBottom: '0.85rem' }}>
        <MapPin size={14} />
        <span>{college.city}, {college.state || 'Maharashtra'}</span>
      </div>

      {/* Fees / Key Metrics */}
      <div style={{ backgroundColor: 'var(--slate-bg)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>APPROX ANNUAL FEES</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={14} />
            {college.annualFeesApprox ? college.annualFeesApprox.toLocaleString('en-IN') : 'Varies by course'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', fontWeight: 600 }}>RATING</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ca8a04' }}>
            ★ {college.rating ? college.rating.toFixed(1) : '4.2'} / 5
          </div>
        </div>
      </div>

      {/* Offered Courses Pills */}
      <div style={{ marginBottom: '1.25rem', flex: '1 0 auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--navy-light)', marginBottom: '0.4rem' }}>
          Key Programs Offered:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {college.coursesOffered && college.coursesOffered.length > 0 ? (
            college.coursesOffered.slice(0, 3).map((crs) => (
              <span
                key={typeof crs === 'object' ? crs._id : crs}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--slate-border)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  color: 'var(--navy-light)',
                }}
              >
                {typeof crs === 'object' ? crs.shortName || crs.name : 'Course'}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>Degree programs available</span>
          )}
          {college.coursesOffered && college.coursesOffered.length > 3 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-muted)', alignSelf: 'center' }}>
              +{college.coursesOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--slate-border)', paddingTop: '0.85rem' }}>
        <Link to={`/colleges/${college._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
          View Details
        </Link>
        <Link to={`/predict?collegeId=${college._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: 'center' }}>
          Predict Chance <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default CollegeCard;
