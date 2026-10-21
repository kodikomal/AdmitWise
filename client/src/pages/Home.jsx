import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collegesAPI, coursesAPI } from '../services/api';
import CollegeCard from '../components/common/CollegeCard';
import {
  Sparkles,
  Compass,
  CheckCircle,
  HelpCircle,
  BarChart2,
  ShieldCheck,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  GraduationCap,
  Award,
} from 'lucide-react';

const Home = () => {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [stats, setStats] = useState({ colleges: 15, courses: 6, cutoffs: 35 });
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [collegesRes, coursesRes] = await Promise.all([
          collegesAPI.getFeatured(),
          coursesAPI.getAll(),
        ]);

        if (collegesRes.success) {
          setFeaturedColleges(collegesRes.colleges || []);
        }

        // Fetch actual counts from colleges and courses endpoint
        const fullColleges = await collegesAPI.getAll({ limit: 1 });
        setStats({
          colleges: fullColleges.pagination ? fullColleges.pagination.total : 15,
          courses: coursesRes.courses ? coursesRes.courses.length : 6,
          cutoffs: 35, // From seeded records
        });
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How does AdmitWise predict college admission chances?',
      a: 'AdmitWise uses an explainable, deterministic rule-based evaluation engine. It first validates mandatory university eligibility criteria (such as minimum HSC % and compulsory Mathematics requirements for B.Sc. IT). It then retrieves the most recent verified historical cutoff data for your course and admission category (Open, OBC, SC, ST, etc.), compares your academic score against past merit lists, and categorizes colleges into High Chance, Moderate Chance, Low Chance, Insufficient Data, or Not Eligible with clear mathematical rationale.',
    },
    {
      q: 'Does AdmitWise fabricate or guess admission chances if cutoff data is missing?',
      a: 'Never. In accordance with strict academic guidelines, if authentic cutoff data is unavailable for a college, course, or category, AdmitWise explicitly labels the result as "Insufficient Data" rather than inventing misleading numbers or black-box artificial percentages.',
    },
    {
      q: 'Which geographic regions and courses are currently supported?',
      a: 'AdmitWise focuses primarily on colleges across Mumbai, Navi Mumbai, Thane, and Pune affiliated with the University of Mumbai, autonomous institutions, and Maharashtra State CET Cell engineering colleges. Supported programs include B.Sc. Information Technology, B.Sc. Computer Science, B.Tech. Computer Engineering, B.Tech. AI & Data Science, BMS, and B.Com.',
    },
    {
      q: 'Is admission guaranteed if a college is marked "High Chance"?',
      a: 'No. AdmitWise is a decision-support advisory tool built for student guidance. Merit cutoffs fluctuate every year based on total applicant volume, exam board performance, and reservation seat distribution. You must always confirm official allotments via Maharashtra State CET Cell and college portals.',
    },
    {
      q: 'Can I download a report of my admission prediction results?',
      a: 'Yes! Registered students can generate and download a comprehensive PDF prediction report detailing academic scores, matching colleges, cutoff differentials, and advisory remarks for submission or counselling reference.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--slate-border)', padding: '4.5rem 0 3.5rem 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            {/* Project Tag & Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <Sparkles size={15} color="#2563eb" />
              BSc IT Academic Project • Viva-Ready Edition
            </div>

            {/* Headline */}
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: 'var(--navy-dark)', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Find Your College. <br />
              <span style={{ color: 'var(--primary)' }}>Plan Your Future.</span>
            </h1>

            {/* Supporting Description */}
            <p style={{ fontSize: '1.15rem', color: 'var(--slate-muted)', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '680px', margin: '0 auto 2.25rem auto' }}>
              AdmitWise is an intelligent admission prediction and recommendation system for students seeking admission to top colleges across Mumbai and Maharashtra. Powered by authentic historical cutoffs and rule-based academic evaluation.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/predict" className="btn btn-primary btn-lg" style={{ boxShadow: '0 8px 20px -4px rgba(37, 99, 235, 0.4)' }}>
                <Sparkles size={18} />
                Predict My Admission
              </Link>
              <Link to="/colleges" className="btn btn-secondary btn-lg">
                <Compass size={18} />
                Explore Colleges
              </Link>
            </div>

            {/* Micro trust highlights */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--navy-light)', fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} color="#16a34a" /> Transparent Rule-Based Engine
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} color="#16a34a" /> Mumbai University & CET Data
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle size={16} color="#16a34a" /> Downloadable PDF Reports
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Genuine Database Counts Banner */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '2.25rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8' }}>{stats.colleges}+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Colleges in Database
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8' }}>{stats.courses}+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Degree Programs
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8' }}>{stats.cutoffs}+</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Historical Cutoff Records
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#38bdf8' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explainable Logic
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three-Step Prediction Workflow */}
      <section className="py-16" style={{ backgroundColor: 'var(--slate-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How AdmitWise Works</h2>
            <p style={{ color: 'var(--slate-muted)', fontSize: '1rem' }}>
              A straightforward three-step process built to guide your higher education decisions with precision.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid var(--primary)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Provide Academic Profile</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Submit your HSC percentage, SSC percentage, stream, Maths marks, category, and entrance examination scores (MHT-CET/JEE) if applicable.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid #0ea5e9' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Rule-Based Evaluation</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Our backend verifies university prerequisites (e.g. Maths for B.Sc. IT), checks genuine round cutoffs by quota, and calculates exact score margins.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ position: 'relative', borderTop: '4px solid #10b981' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.25rem' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.65rem' }}>Transparent Recommendations</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Review categorized colleges (High, Moderate, Low Chance), compare up to 4 colleges side-by-side, and download your personalized PDF report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="py-16" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--slate-border)', borderBottom: '1px solid var(--slate-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Verified Database</div>
              <h2 style={{ fontSize: '1.9rem' }}>Featured Mumbai & Maharashtra Colleges</h2>
              <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                Prominent autonomous institutions, government-aided colleges, and accredited universities.
              </p>
            </div>
            <Link to="/colleges" className="btn btn-outline">
              View All Colleges <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-muted)' }}>
              Loading featured colleges...
            </div>
          ) : featuredColleges.length > 0 ? (
            <div className="grid grid-cols-3 gap-6">
              {featuredColleges.slice(0, 6).map((college) => (
                <CollegeCard key={college._id} college={college} />
              ))}
            </div>
          ) : (
            <div className="card text-center" style={{ padding: '3rem' }}>
              <p style={{ color: 'var(--slate-muted)' }}>No colleges found. Run the seed script to load sample colleges.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-16" style={{ backgroundColor: 'var(--slate-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Why Choose AdmitWise?</h2>
            <p style={{ color: 'var(--slate-muted)', fontSize: '1rem' }}>
              Engineered specifically to overcome the opacity, unverified claims, and commercial biases of conventional education portals.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="card">
              <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><FileText size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Honest & Explainable</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Every recommendation provides the exact mathematical rationale: score difference against historical cutoffs, category benchmarks, and academic year.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#0ea5e9', marginBottom: '1rem' }}><Layers size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Multi-College Comparison</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Compare up to 4 colleges in a side-by-side comparison matrix evaluating cutoffs, approximate fees, NAAC grades, and facilities.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#16a34a', marginBottom: '1rem' }}><ShieldCheck size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Mandatory Eligibility Enforcement</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Prevents misleading students by checking mandatory subjects (such as HSC Mathematics for B.Sc. IT) before predicting competitiveness.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}><BarChart2 size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Visual Cutoff Analytics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Interactive charts built with Recharts illustrate chance breakdowns, fees distribution, and historical cutoff comparisons.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#f59e0b', marginBottom: '1rem' }}><GraduationCap size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Category & Quota Aware</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Evaluates candidates against Open, OBC, SC, ST, and other reservation quotas according to official Maharashtra State rules.
              </p>
            </div>

            <div className="card">
              <div style={{ color: '#ec4899', marginBottom: '1rem' }}><Award size={28} /></div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>PDF Report Generation</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                Generate clean, branded, downloadable PDF reports ready for college counselling, parents, or academic submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16" style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--slate-border)' }}>
        <div className="container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Clear answers regarding AdmitWise algorithms, data integrity, and viva evaluation standards.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--slate-border)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: openFaq === index ? '#f8fafc' : '#ffffff',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '1.1rem 1.25rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    color: 'var(--navy-dark)',
                  }}
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#64748b" />}
                </button>
                {openFaq === index && (
                  <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', fontSize: '0.9rem', color: 'var(--slate-muted)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Action Callout */}
      <section style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.75rem' }}>
            Ready to Discover Your Best-Fit Colleges?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#e0e7ff', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Start your admission prediction now. It takes less than 2 minutes and requires no credit card.
          </p>
          <Link
            to="/predict"
            className="btn"
            style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700, padding: '0.85rem 2rem', fontSize: '1.05rem', borderRadius: 'var(--radius-full)', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
          >
            Start Free Prediction <Sparkles size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
