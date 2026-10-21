import React, { useState, useEffect } from 'react';
import { guidanceAPI } from '../services/api';
import {
  BookOpen,
  CheckSquare,
  ExternalLink,
  ShieldAlert,
  Calendar,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';

const Guidance = () => {
  const [guidanceList, setGuidanceList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const res = await guidanceAPI.getAll(selectedCategory !== 'All' ? selectedCategory : null);
        if (res.success) {
          setGuidanceList(res.guidance || []);
        }
      } catch (err) {
        console.error('Error fetching guidance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuidance();
  }, [selectedCategory]);

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem', textAlign: 'center', maxWidth: '720px', margin: '0 auto 2.5rem auto' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.45rem' }}>
            <BookOpen size={13} /> Admission Knowledge Base
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Admission Guidance & Process</h1>
          <p style={{ color: 'var(--slate-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
            Authoritative explanations of Mumbai University merit lists, Maharashtra State CET Cell CAP rounds, document verification checklists, and reservation categories.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {['All', 'Merit Lists', 'CAP Rounds', 'Eligibility', 'Documents', 'FAQs'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Guidance Articles Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-muted)' }}>
            Loading admission guidance...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {guidanceList.map((item) => (
              <div key={item._id} className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span className="badge badge-primary">{item.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-muted)' }}>
                    Last Verified: Academic Year 2024–25
                  </span>
                </div>

                <h2 style={{ fontSize: '1.45rem', color: 'var(--navy-dark)', marginBottom: '0.75rem' }}>
                  {item.title}
                </h2>

                {item.summary && (
                  <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {item.summary}
                  </p>
                )}

                {/* Content Body formatted */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--slate-border)',
                    fontSize: '0.9rem',
                    color: 'var(--navy-dark)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    marginBottom: '1.5rem',
                  }}
                >
                  {item.content}
                </div>

                {/* Document Checklist if present */}
                {item.documentChecklist && item.documentChecklist.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckSquare size={17} color="#16a34a" /> Mandatory Document Checklist
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {item.documentChecklist.map((doc, dIdx) => (
                        <div
                          key={dIdx}
                          style={{
                            backgroundColor: '#ffffff',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--slate-border)',
                          }}
                        >
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                            {doc.name} {doc.isMandatory && <span style={{ color: '#dc2626' }}>*</span>}
                          </div>
                          {doc.description && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--slate-muted)', marginTop: '0.2rem' }}>
                              {doc.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Links */}
                {item.officialLinks && item.officialLinks.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                      Official Verification Portals
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {item.officialLinks.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          {link.title} <ExternalLink size={13} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Disclaimer Banner */}
        <div className="card" style={{ marginTop: '2.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <Info size={22} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.6 }}>
              <strong>Official Regulation Notice:</strong> Rules governing admissions, reservation quotas, and seat allocation are established by the Directorate of Technical Education (DTE), State Common Entrance Test Cell Maharashtra, and the University of Mumbai. Students should strictly verify all cutoffs, dates, and option form confirmations directly on the respective official university and CET Cell portals.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidance;
