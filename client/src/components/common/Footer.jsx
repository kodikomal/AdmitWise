import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', paddingTop: '3.5rem', paddingBottom: '2rem', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        <div className="grid grid-cols-4 gap-8" style={{ marginBottom: '2.5rem' }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '0.45rem', borderRadius: '8px', display: 'flex' }}>
                <GraduationCap size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Admit<span style={{ color: '#38bdf8' }}>Wise</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1rem' }}>
              "Predict. Explore. Achieve."
              <br />
              An explainable, rule-based college admission prediction and recommendation system built for students seeking higher education in Mumbai and Maharashtra.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', backgroundColor: '#1e293b', padding: '0.35rem 0.65rem', borderRadius: '6px', color: '#38bdf8' }}>
              <ShieldCheck size={14} /> BSc Information Technology Project
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>AdmitWise Tools</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li><Link to="/predict" style={{ color: '#cbd5e1' }}>Admission Predictor</Link></li>
              <li><Link to="/colleges" style={{ color: '#cbd5e1' }}>Explore Mumbai Colleges</Link></li>
              <li><Link to="/compare" style={{ color: '#cbd5e1' }}>Compare Colleges Matrix</Link></li>
              <li><Link to="/guidance" style={{ color: '#cbd5e1' }}>Admission Guidelines & FAQs</Link></li>
              <li><Link to="/login" style={{ color: '#cbd5e1' }}>Student Portal Login</Link></li>
            </ul>
          </div>

          {/* Programs Covered */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Featured Programs</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li>B.Sc. Information Technology (B.Sc. IT)</li>
              <li>B.Sc. Computer Science (B.Sc. CS)</li>
              <li>B.Tech. Computer Engineering</li>
              <li>B.Tech. AI & Data Science</li>
              <li>Bachelor of Management Studies (BMS)</li>
              <li>Bachelor of Commerce (B.Com)</li>
            </ul>
          </div>

          {/* Official Education Portals */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>Official Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <a href="https://mum.digitaluniversity.ac" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Mumbai University Portal <ExternalLink size={13} />
                </a>
              </li>
              <li>
                <a href="https://cetcell.mahacet.org" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  State CET Cell Maharashtra <ExternalLink size={13} />
                </a>
              </li>
              <li>
                <a href="https://dte.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  DTE Maharashtra <ExternalLink size={13} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', paddingBottom: '1.5rem', fontSize: '0.78rem', lineHeight: 1.6, color: '#64748b' }}>
          <strong>Academic Demonstration Disclaimer:</strong> AdmitWise is a BSc IT student project designed for educational demonstration, viva examination, and portfolio evaluation. Admission predictions are rule-based estimates calculated against historical merit list records and university eligibility circulars. Admission is neither guaranteed nor officially binding. Always verify final merit lists and seat allotments on official university and college portals.
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} AdmitWise. Built with React.js, Node.js, Express, and MongoDB.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Mumbai & Maharashtra Region</span>
            <span>•</span>
            <span>Documented Viva Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
