import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favouritesAPI } from '../services/api';
import CollegeCard from '../components/common/CollegeCard';
import { Bookmark, Compass, ArrowRight } from 'lucide-react';

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await favouritesAPI.getAll();
        if (res.success) {
          setFavourites(res.favourites || []);
        }
      } catch (err) {
        console.error('Error fetching favourites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleFavouriteToggle = (collegeId, isFavourited) => {
    if (!isFavourited) {
      setFavourites((prev) => prev.filter((col) => col._id !== collegeId));
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)' }}>Loading saved colleges...</div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <Bookmark size={13} fill="currentColor" /> Student Shortlist
            </div>
            <h1 style={{ fontSize: '2rem' }}>Saved Colleges ({favourites.length})</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Colleges bookmarked for application tracking and direct comparison.
            </p>
          </div>

          <Link to="/colleges" className="btn btn-secondary">
            <Compass size={16} /> Browse More Colleges
          </Link>
        </div>

        {favourites.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <Bookmark size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Colleges Saved Yet</h3>
            <p style={{ color: 'var(--slate-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              Click the bookmark icon on any college card or details page to add it to your personal shortlist.
            </p>
            <Link to="/colleges" className="btn btn-primary">
              Explore Mumbai Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {favourites.map((college) => (
              <CollegeCard
                key={college._id}
                college={college}
                initialFavourited={true}
                onFavouriteToggle={handleFavouriteToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
