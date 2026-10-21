import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictionsAPI } from '../services/api';
import { History, Download, Trash2, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchHistory = async (page = 1) => {
    try {
      setLoading(true);
      const res = await predictionsAPI.getHistory({ page, limit: 10 });
      if (res.success) {
        setPredictions(res.predictions || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error fetching prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction run from your history?')) {
      return;
    }

    try {
      await predictionsAPI.delete(id);
      setPredictions((prev) => prev.filter((p) => p._id !== id));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err) {
      alert(err.message || 'Error deleting prediction.');
    }
  };

  const handleDownloadPdf = async (id, courseName) => {
    try {
      setDownloadingId(id);
      const blob = await predictionsAPI.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AdmitWise_Report_${(courseName || 'Prediction').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Error generating PDF report.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading && predictions.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div style={{ color: 'var(--slate-muted)' }}>Loading prediction history...</div>
      </div>
    );
  }

  return (
    <div className="py-12" style={{ backgroundColor: 'var(--slate-bg)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
              <History size={13} /> Saved Evaluations
            </div>
            <h1 style={{ fontSize: '2rem' }}>Prediction History ({pagination.total})</h1>
            <p style={{ color: 'var(--slate-muted)', fontSize: '0.95rem' }}>
              Historical archive of past admission simulations and generated counseling reports.
            </p>
          </div>

          <Link to="/predict" className="btn btn-primary">
            <Sparkles size={16} /> New Prediction
          </Link>
        </div>

        {predictions.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <History size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Saved Predictions</h3>
            <p style={{ color: 'var(--slate-muted)', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              Run the admission predictor while logged in to automatically store your prediction results and download PDF reports.
            </p>
            <Link to="/predict" className="btn btn-primary">
              Run Prediction Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Target Course</th>
                  <th>Date & Time</th>
                  <th>HSC % Snapshot</th>
                  <th>Category</th>
                  <th>High Chance</th>
                  <th>Moderate</th>
                  <th>Low</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((pred) => (
                  <tr key={pred._id}>
                    <td style={{ fontWeight: 700, color: 'var(--navy-dark)' }}>{pred.courseName}</td>
                    <td>{new Date(pred.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{pred.academicSnapshot?.hscPercentage}%</td>
                    <td>
                      <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                        {pred.academicSnapshot?.category || 'Open'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-high" style={{ fontSize: '0.72rem' }}>
                        {pred.summaryCounts?.highChance || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-moderate" style={{ fontSize: '0.72rem' }}>
                        {pred.summaryCounts?.moderateChance || 0}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-low" style={{ fontSize: '0.72rem' }}>
                        {pred.summaryCounts?.lowChance || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Link
                          to={`/predict/results?id=${pred._id}`}
                          className="btn btn-secondary btn-sm"
                          title="Open analysis"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDownloadPdf(pred._id, pred.courseName)}
                          disabled={downloadingId === pred._id}
                          className="btn btn-outline btn-sm"
                          title="Download PDF"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(pred._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete from history"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionHistory;
