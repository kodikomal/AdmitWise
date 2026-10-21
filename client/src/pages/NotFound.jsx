import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="py-16 text-center" style={{ backgroundColor: 'var(--slate-bg)', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container-narrow">
        <div style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontSize: '1.75rem', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--slate-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
          The page or admission section you are looking for does not exist or may have been relocated.
        </p>
        <Link to="/" className="btn btn-primary">
          <Compass size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
