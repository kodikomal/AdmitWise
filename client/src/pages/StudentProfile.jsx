import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, coursesAPI, collegesAPI } from '../services/api';
import { User, CheckCircle2, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [hscPercentage, setHscPercentage] = useState('');
  const [sscPercentage, setSscPercentage] = useState('');
  const [mathsMarks, setMathsMarks] = useState('');
  const [stream, setStream] = useState('Science');
  const [board, setBoard] = useState('Maharashtra State Board');
  const [passingYear, setPassingYear] = useState('2024');
  const [entranceExam, setEntranceExam] = useState('None / Merit Based');
  const [entranceScore, setEntranceScore] = useState('');
  const [category, setCategory] = useState('Open/General');
  const [preferredCourse, setPreferredCourse] = useState('');
  const [preferredCity, setPreferredCity] = useState('Mumbai');
  const [annualFeeBudget, setAnnualFeeBudget] = useState('200000');
  const [collegeTypePreference, setCollegeTypePreference] = useState('Any');

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const [profRes, crsRes, cityRes] = await Promise.all([
          studentAPI.getProfile(),
          coursesAPI.getAll(),
          collegesAPI.getCities(),
        ]);

        if (profRes.success && profRes.profile) {
          const p = profRes.profile;
          setName(user?.name || '');
          if (p.hscPercentage !== null && p.hscPercentage !== undefined) setHscPercentage(p.hscPercentage);
          if (p.sscPercentage !== null && p.sscPercentage !== undefined) setSscPercentage(p.sscPercentage);
          if (p.mathsMarks !== null && p.mathsMarks !== undefined) setMathsMarks(p.mathsMarks);
          if (p.hscStream) setStream(p.hscStream);
          if (p.board) setBoard(p.board);
          if (p.passingYear) setPassingYear(p.passingYear);
          if (p.entranceExam) setEntranceExam(p.entranceExam);
          if (p.entranceScore !== null && p.entranceScore !== undefined) setEntranceScore(p.entranceScore);
          if (p.category) setCategory(p.category);
          if (p.preferredCourse) setPreferredCourse(p.preferredCourse);
          if (p.preferredCity) setPreferredCity(p.preferredCity);
          if (p.annualFeeBudget) setAnnualFeeBudget(p.annualFeeBudget);
          if (p.collegeTypePreference) setCollegeTypePreference(p.collegeTypePreference);
        }

        if (crsRes.success) setCourses(crsRes.courses || []);
        if (cityRes.success) setCities(cityRes.cities || []);
      } catch (err) {
        setError('Error loading student profile.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validation
    if (hscPercentage !== '') {
      const hsc = parseFloat(hscPercentage);
      if (isNaN(hsc) || hsc < 0 || hsc > 100) {
        setError('HSC percentage must be between 0 and 100.');
        return;
      }
    }

    if (sscPercentage !== '') {
      const ssc = parseFloat(sscPercentage);
      if (isNaN(ssc) || ssc < 0 || ssc > 100) {
        setError('SSC percentage must be between 0 and 100.');
        return;
      }
    }

    if (mathsMarks !== '') {
      const mm = parseFloat(mathsMarks);
      if (isNaN(mm) || mm < 0 || mm > 100) {
        setError('Maths marks must be between 0 and 100.');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        name,
        hscPercentage: hscPercentage !== '' ? parseFloat(hscPercentage) : null,
        sscPercentage: sscPercentage !== '' ? parseFloat(sscPercentage) : null,
        mathsMarks: mathsMarks !== '' ? parseFloat(mathsMarks) : null,
        hscStream: stream,
        board,
        passingYear: parseInt(passingYear, 10),
        entranceExam,
        entranceScore: entranceScore !== '' ? parseFloat(entranceScore) : null,
        category,
        preferredCourse,
        preferredCity,
        annualFeeBudget: annualFeeBudget !== '' ? parseFloat(annualFeeBudget) : null,
        collegeTypePreference,
      };

      const res = await studentAPI.updateProfile(payload);
      if (res.success) {
        setMessage('Your academic profile has been saved successfully.');
        if (res.user) updateUser(res.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to update academic profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)' }}>Loading Academic Profile...</div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/student/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Academic Profile & Preferences</h1>
          <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
            Maintain your educational credentials to automatically populate the prediction form.
          </p>
        </div>

        {message && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <div>{message}</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Personal Info */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Personal Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--slate-border)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Academic Background</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">HSC Aggregate %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 82.5"
                  value={hscPercentage}
                  onChange={(e) => setHscPercentage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SSC Aggregate %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 86.4"
                  value={sscPercentage}
                  onChange={(e) => setSscPercentage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maths Marks (out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 78"
                  value={mathsMarks}
                  onChange={(e) => setMathsMarks(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">HSC Stream</label>
                <select className="form-select" value={stream} onChange={(e) => setStream(e.target.value)}>
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                  <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Education Board</label>
                <select className="form-select" value={board} onChange={(e) => setBoard(e.target.value)}>
                  <option value="Maharashtra State Board">Maharashtra State Board</option>
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="Other State Board">Other State Board</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Entrance Exam (if taken)</label>
                <select className="form-select" value={entranceExam} onChange={(e) => setEntranceExam(e.target.value)}>
                  <option value="None / Merit Based">None / Merit Based</option>
                  <option value="MHT-CET">MHT-CET (Maharashtra)</option>
                  <option value="JEE Main">JEE Main</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Entrance Percentile (0-100)</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 91.24"
                  value={entranceScore}
                  onChange={(e) => setEntranceScore(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Admission Preferences */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Admission Preferences</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Admission Category</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Open/General">Open / General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                  <option value="TFWS">TFWS</option>
                  <option value="VJ/NT">VJ / NT</option>
                  <option value="SBC">SBC</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred City</label>
                <select className="form-select" value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)}>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Thane">Thane</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Annual Fee Budget (₹)</label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 80000"
                  value={annualFeeBudget}
                  onChange={(e) => setAnnualFeeBudget(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">College Type Preference</label>
                <select
                  className="form-select"
                  value={collegeTypePreference}
                  onChange={(e) => setCollegeTypePreference(e.target.value)}
                >
                  <option value="Any">Any</option>
                  <option value="Autonomous">Autonomous</option>
                  <option value="Government">Government / Govt-Aided</option>
                  <option value="Private-Aided">Private-Aided</option>
                  <option value="Private-Unaided">Private-Unaided</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--slate-border)', paddingTop: '1.25rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary btn-lg">
              <Save size={18} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
