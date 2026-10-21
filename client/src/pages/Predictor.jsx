import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, predictionsAPI, collegesAPI } from '../services/api';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';

const Predictor = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [courses, setCourses] = useState([]);
  const [cities, setCities] = useState(['Mumbai', 'Navi Mumbai', 'Thane', 'Pune']);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [hscPercentage, setHscPercentage] = useState('');
  const [sscPercentage, setSscPercentage] = useState('');
  const [mathsMarks, setMathsMarks] = useState('');
  const [stream, setStream] = useState('Science');
  const [board, setBoard] = useState('Maharashtra State Board');
  const [passingYear, setPassingYear] = useState('2024');
  const [category, setCategory] = useState('Open/General');
  const [entranceExam, setEntranceExam] = useState('None / Merit Based');
  const [entranceScore, setEntranceScore] = useState('');
  const [preferredCity, setPreferredCity] = useState('All');
  const [annualFeeBudget, setAnnualFeeBudget] = useState('200000');
  const [collegeTypePreference, setCollegeTypePreference] = useState('Any');
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Load courses and pre-fill from user profile if logged in
  useEffect(() => {
    const init = async () => {
      try {
        const [courseRes, cityRes] = await Promise.all([
          coursesAPI.getAll(),
          collegesAPI.getCities().catch(() => ({ cities: [] })),
        ]);

        if (courseRes.success && courseRes.courses.length > 0) {
          setCourses(courseRes.courses);
          // Default to B.Sc. IT or first course
          const bscIt = courseRes.courses.find((c) => c.shortName === 'B.Sc. IT');
          setSelectedCourseId(bscIt ? bscIt._id : courseRes.courses[0]._id);
        }

        if (cityRes.success && cityRes.cities.length > 0) {
          setCities(cityRes.cities);
        }

        // Prefill from authenticated student profile
        if (user && user.academicProfile) {
          const p = user.academicProfile;
          if (p.hscPercentage) setHscPercentage(p.hscPercentage);
          if (p.sscPercentage) setSscPercentage(p.sscPercentage);
          if (p.mathsMarks !== null && p.mathsMarks !== undefined) setMathsMarks(p.mathsMarks);
          if (p.hscStream) setStream(p.hscStream);
          if (p.board) setBoard(p.board);
          if (p.category) setCategory(p.category);
          if (p.entranceExam) setEntranceExam(p.entranceExam);
          if (p.entranceScore) setEntranceScore(p.entranceScore);
          if (p.preferredCity) setPreferredCity(p.preferredCity);
          if (p.annualFeeBudget) setAnnualFeeBudget(p.annualFeeBudget);
          if (p.collegeTypePreference) setCollegeTypePreference(p.collegeTypePreference);
        }
      } catch (err) {
        setError('Failed to load courses. Please check backend server.');
      } finally {
        setLoadingCourses(false);
      }
    };

    init();
  }, [user]);

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);
  const requiresMaths = selectedCourse?.eligibilityCriteria?.requiresMathsInHsc;
  const requiresEntrance = selectedCourse?.admissionBasis === 'ENTRANCE_EXAM';

  // Automatically update entrance exam selector when engineering course is selected
  useEffect(() => {
    if (requiresEntrance && entranceExam === 'None / Merit Based') {
      setEntranceExam('MHT-CET');
    }
  }, [requiresEntrance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    const hsc = parseFloat(hscPercentage);
    if (isNaN(hsc) || hsc < 0 || hsc > 100) {
      setError('Please provide a valid HSC percentage between 0 and 100.');
      return;
    }

    if (sscPercentage) {
      const ssc = parseFloat(sscPercentage);
      if (isNaN(ssc) || ssc < 0 || ssc > 100) {
        setError('Please provide a valid SSC percentage between 0 and 100.');
        return;
      }
    }

    if (requiresMaths) {
      if (mathsMarks === '' || mathsMarks === null || isNaN(parseFloat(mathsMarks))) {
        setError(
          `Mathematics in HSC is a mandatory requirement for ${selectedCourse?.name || 'this program'}. Please enter your Mathematics marks.`
        );
        return;
      }
      const mm = parseFloat(mathsMarks);
      if (mm < 0 || mm > 100) {
        setError('Mathematics marks must be between 0 and 100.');
        return;
      }
    }

    if (requiresEntrance) {
      const score = parseFloat(entranceScore);
      if (isNaN(score) || score < 0 || score > 100) {
        setError('This engineering program requires an entrance exam percentile (MHT-CET or JEE Main) between 0 and 100.');
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        courseId: selectedCourseId,
        hscPercentage: hsc,
        sscPercentage: sscPercentage ? parseFloat(sscPercentage) : null,
        mathsMarks: mathsMarks !== '' ? parseFloat(mathsMarks) : null,
        stream,
        board,
        passingYear: parseInt(passingYear, 10),
        category,
        entranceExam,
        entranceScore: entranceScore ? parseFloat(entranceScore) : 0,
        preferredCity,
        annualFeeBudget: annualFeeBudget ? parseFloat(annualFeeBudget) : null,
        collegeTypePreference,
        saveToProfile: isAuthenticated && saveToProfile,
      };

      const res = await predictionsAPI.create(payload);

      if (res.success && res.prediction) {
        // Pass prediction result via navigation state or fetch via ID
        navigate('/predict/results', {
          state: {
            prediction: res.prediction,
            predictionId: res.predictionId,
          },
        });
      } else {
        setError(res.message || 'Prediction could not be completed.');
      }
    } catch (err) {
      setError(err.message || 'Error executing admission prediction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourses) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)', fontSize: '1.1rem' }}>Loading AdmitWise Predictor...</div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container-narrow">
        {/* Header Breadcrumb / Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>
            <Sparkles size={14} /> Rule-Based Engine v1.2
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.65rem' }}>College Admission Predictor</h1>
          <p style={{ color: 'var(--slate-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Enter your academic marks and target preferences to receive transparent admission chances benchmarked against historical Mumbai & Maharashtra cutoff records.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.75rem' }}>
            <AlertCircle size={20} />
            <div>
              <strong>Validation Notice:</strong> {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {/* Section 1: Course Selection */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--slate-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                1
              </div>
              <h2 style={{ fontSize: '1.25rem' }}>Select Target Degree Program</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Degree Course *</label>
              <select
                className="form-select"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
                style={{ fontSize: '1rem', fontWeight: 600 }}
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name} ({course.shortName}) — {course.durationYears} Years [{course.admissionBasis === 'ENTRANCE_EXAM' ? 'Entrance Exam Required' : 'HSC Merit Based'}]
                  </option>
                ))}
              </select>
            </div>

            {selectedCourse && (
              <div style={{ backgroundColor: '#f1f5f9', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--navy-light)', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Info size={18} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Official Eligibility Summary:</strong> Minimum {selectedCourse.eligibilityCriteria?.minHscPercentage}% in HSC ({selectedCourse.eligibilityCriteria?.minHscReservedPercentage}% for reserved categories).
                  {requiresMaths && (
                    <span style={{ color: '#b91c1c', fontWeight: 700, marginLeft: '4px' }}>
                      Mathematics is mandatory in HSC.
                    </span>
                  )}
                  {requiresEntrance && (
                    <span style={{ color: '#1e40af', fontWeight: 700, marginLeft: '4px' }}>
                      Admission requires MHT-CET or JEE Main percentile.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Academic Scores */}
          <div style={{ marginBottom: '2rem', paddingBottom: '1.75rem', borderBottom: '1px solid var(--slate-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                2
              </div>
              <h2 style={{ fontSize: '1.25rem' }}>Academic Scores & Background</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">HSC (Class 12) Aggregate % *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 84.50"
                  value={hscPercentage}
                  onChange={(e) => setHscPercentage(e.target.value)}
                  required
                />
                <div className="form-hint">Enter your overall HSC aggregate percentage.</div>
              </div>

              <div className="form-group">
                <label className="form-label">SSC (Class 10) Aggregate %</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="e.g. 88.20"
                  value={sscPercentage}
                  onChange={(e) => setSscPercentage(e.target.value)}
                />
                <div className="form-hint">Used for tie-breaking in merit calculations.</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">HSC Stream *</label>
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
                  <option value="Maharashtra State Board">Maharashtra State Board (HSC)</option>
                  <option value="CBSE">CBSE Board</option>
                  <option value="ICSE">ICSE / ISC Board</option>
                  <option value="Other State Board">Other State Board</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Passing Year</label>
                <select className="form-select" value={passingYear} onChange={(e) => setPassingYear(e.target.value)}>
                  <option value="2025">2025 (Appearing / Passed)</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
            </div>

            {/* Dynamic Field: Mathematics Marks (Compulsory for B.Sc. IT, Engineering, B.Sc. CS) */}
            {requiresMaths && (
              <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bfdbfe', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Mathematics Marks in HSC (Out of 100) *
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      Mandatory Prerequisite
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-input"
                    placeholder="e.g. 78"
                    value={mathsMarks}
                    onChange={(e) => setMathsMarks(e.target.value)}
                    required
                    style={{ borderColor: '#93c5fd', backgroundColor: '#ffffff' }}
                  />
                  <div className="form-hint" style={{ color: '#1e40af' }}>
                    Under Mumbai University circulars, Mathematics in HSC is compulsory for B.Sc. IT and B.Sc. CS.
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Field: Entrance Exam Percentile (for Engineering) */}
            {requiresEntrance && (
              <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                <div className="grid grid-cols-2 gap-4" style={{ marginBottom: 0 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: '#166534' }}>Entrance Examination *</label>
                    <select
                      className="form-select"
                      value={entranceExam}
                      onChange={(e) => setEntranceExam(e.target.value)}
                      required
                    >
                      <option value="MHT-CET">MHT-CET (Maharashtra State CET)</option>
                      <option value="JEE Main">JEE Main</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ color: '#166534' }}>Percentile Score (0-100) *</label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      max="100"
                      className="form-input"
                      placeholder="e.g. 96.4520"
                      value={entranceScore}
                      onChange={(e) => setEntranceScore(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-hint" style={{ color: '#15803d', marginTop: '0.35rem' }}>
                  Engineering admissions in Maharashtra use MHT-CET / JEE Main percentile ranks for CAP allocations.
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Admission Category & Preferences */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                3
              </div>
              <h2 style={{ fontSize: '1.25rem' }}>Category & Location Preferences</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Admission Category *</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                  <option value="Open/General">Open / General (General Merit)</option>
                  <option value="OBC">OBC (Other Backward Classes)</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                  <option value="TFWS">TFWS (Tuition Fee Waiver Scheme)</option>
                  <option value="VJ/NT">VJ / NT (Vimukta Jati / Nomadic Tribes)</option>
                  <option value="SBC">SBC (Special Backward Class)</option>
                </select>
                <div className="form-hint">Evaluates cutoffs against official reservation quotas.</div>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred City / Region</label>
                <select className="form-select" value={preferredCity} onChange={(e) => setPreferredCity(e.target.value)}>
                  <option value="All">All Regions (Mumbai, Navi Mumbai, Thane, Pune)</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Maximum Annual Fee Budget (₹)</label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 80000"
                  value={annualFeeBudget}
                  onChange={(e) => setAnnualFeeBudget(e.target.value)}
                />
                <div className="form-hint">Colleges exceeding this will highlight fee notifications.</div>
              </div>

              <div className="form-group">
                <label className="form-label">College Type Preference</label>
                <select
                  className="form-select"
                  value={collegeTypePreference}
                  onChange={(e) => setCollegeTypePreference(e.target.value)}
                >
                  <option value="Any">Any College Type</option>
                  <option value="Autonomous">Autonomous Colleges</option>
                  <option value="Government">Government / Govt-Aided</option>
                  <option value="Private-Aided">Private-Aided</option>
                  <option value="Private-Unaided">Private-Unaided</option>
                </select>
              </div>
            </div>

            {isAuthenticated && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="saveProfileCheck"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                />
                <label htmlFor="saveProfileCheck" style={{ fontSize: '0.85rem', color: 'var(--navy-light)', cursor: 'pointer' }}>
                  Save these academic scores and preferences to my student profile
                </label>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div style={{ borderTop: '1px solid var(--slate-border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-muted)' }}>
              Deterministic evaluation • Real historical cutoffs • Zero guesswork
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ minWidth: '220px' }}
            >
              {submitting ? 'Evaluating Cutoffs...' : (
                <>
                  <Sparkles size={18} />
                  Run Admission Predictor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Predictor;
