import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { Layers, X, ArrowRight } from 'lucide-react';

const FloatingCompareBar = () => {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="compare-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ backgroundColor: 'var(--primary)', padding: '0.35rem', borderRadius: '50%', display: 'flex' }}>
          <Layers size={16} color="#ffffff" />
        </div>
        <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>
          Compare ({compareCount}/4):
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'nowrap', overflowX: 'auto', maxWidth: '450px' }}>
        {compareList.map((col) => (
          <div
            key={col._id}
            style={{
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{col.name.length > 18 ? col.name.slice(0, 16) + '...' : col.name}</span>
            <button
              onClick={() => removeFromCompare(col._id)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}
              title="Remove from comparison"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link to="/compare" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem' }}>
          Compare Matrix <ArrowRight size={14} />
        </Link>
        <button
          onClick={clearCompare}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default FloatingCompareBar;
