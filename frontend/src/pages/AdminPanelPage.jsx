import React, { useState, useEffect } from 'react';
import { getActionWeights, updateActionWeights, getAnomalies, updateAnomalyStatus, requestBooking } from '../api/client';
import { ShieldAlert, Settings, Save, CheckCircle, RotateCcw, AlertTriangle } from 'lucide-react';

export default function AdminPanelPage() {
  const [weights, setWeights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loadingWeights, setLoadingWeights] = useState(true);
  const [loadingAnomalies, setLoadingAnomalies] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [newBookingId, setNewBookingId] = useState('');
  const [newEnquiry, setNewEnquiry] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);

  const handleRequestBooking = (e) => {
    e.preventDefault();
    if (!newBookingId.trim()) return;
    setRequestStatus('submitting');
    requestBooking(newBookingId.trim(), newEnquiry.trim() || null, 'u1')
      .then(res => {
        if (res.success) {
          setRequestStatus('success');
          setNewBookingId('');
          setNewEnquiry('');
          setTimeout(() => setRequestStatus(null), 3000);
        } else {
          setRequestStatus('error');
          setTimeout(() => setRequestStatus(null), 4000);
        }
      })
      .catch(() => {
        setRequestStatus('error');
        setTimeout(() => setRequestStatus(null), 4000);
      });
  };

  useEffect(() => {
    loadWeights();
    loadAnomalies();
  }, []);

  const loadWeights = () => {
    setLoadingWeights(true);
    getActionWeights()
      .then(data => {
        setWeights(data);
        setLoadingWeights(false);
      })
      .catch(err => {
        setError("Failed to load weights");
        setLoadingWeights(false);
      });
  };

  const loadAnomalies = () => {
    setLoadingAnomalies(true);
    getAnomalies()
      .then(data => {
        setAnomalies(data);
        setLoadingAnomalies(false);
      })
      .catch(err => {
        setError("Failed to load anomalies");
        setLoadingAnomalies(false);
      });
  };

  const handleWeightChange = (index, value) => {
    const parsed = parseInt(value, 10);
    const updated = [...weights];
    updated[index].points = isNaN(parsed) ? 0 : parsed;
    setWeights(updated);
  };

  const handleSaveWeights = () => {
    setSaveStatus('saving');
    updateActionWeights(weights)
      .then(() => {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
      })
      .catch(() => {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      });
  };

  const handleResolveAnomaly = (id) => {
    updateAnomalyStatus(id, 'Resolved')
      .then(() => {
        loadAnomalies();
      })
      .catch(() => {
        setError("Failed to update anomaly status");
      });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-primary" />
          Admin Console
        </h1>
        <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">
          Configure action scoring weights and audit anti-gaming system anomalies.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weight Editor Panel (takes 2/3 of grid space) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                Workflow Action Weight Editor
              </h2>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                Adjust points awarded to employee milestones (maximum of 20 active scoring actions).
              </p>
            </div>
            <button
              onClick={handleSaveWeights}
              disabled={saveStatus === 'saving' || loadingWeights}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg text-sm font-bold shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Weights'}
            </button>
          </div>

          {saveStatus === 'success' && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-400 px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4" />
              <span>Weights updated successfully across all client instances.</span>
            </div>
          )}

          {loadingWeights ? (
            <div className="space-y-4 py-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-neutral-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-slate-800 text-xs font-semibold text-neutral-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 pl-2">Action Code</th>
                    <th className="pb-3">Display Name</th>
                    <th className="pb-3 pr-2 text-right w-32">Weight (XP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-slate-800 text-sm">
                  {weights.map((row, idx) => (
                    <tr key={row.action} className="hover:bg-neutral-50/50 dark:hover:bg-slate-800/20 transition">
                      <td className="py-3.5 pl-2 font-mono text-xs font-bold text-neutral-500 dark:text-slate-400">{row.action}</td>
                      <td className="py-3.5 font-medium text-neutral-700 dark:text-slate-300">{row.label}</td>
                      <td className="py-3.5 pr-2 text-right">
                        <input
                          type="number"
                          value={row.points}
                          onChange={(e) => handleWeightChange(idx, e.target.value)}
                          className="w-20 px-2 py-1 text-right bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded text-sm font-bold font-numeric focus:outline-none focus:border-brand-primary"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right side vertical panels */}
        <div className="space-y-8">
          {/* Anomaly Review Panel (takes 1/3 of grid space) */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">
            <div className="pb-4 border-b border-neutral-100 dark:border-slate-800">
              <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                Anti-Gaming Audit Panel
              </h2>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                Live anomaly detection logs catching points spamming or cap limits.
              </p>
            </div>

            {loadingAnomalies ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-neutral-100 dark:bg-slate-800 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {anomalies.map((anom) => {
                  const isHigh = anom.severity === 'High';
                  const isMedium = anom.severity === 'Medium';
                  const isResolved = anom.status === 'Resolved';
                  
                  return (
                    <div 
                      key={anom.id} 
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        isResolved 
                          ? 'bg-neutral-50/50 dark:bg-slate-800/10 border-neutral-100 dark:border-slate-800 opacity-60' 
                          : isHigh 
                            ? 'bg-red-50/30 dark:bg-red-950/5 border-red-100 dark:border-red-900/30' 
                            : isMedium
                              ? 'bg-amber-50/30 dark:bg-amber-950/5 border-amber-100 dark:border-amber-900/30'
                              : 'bg-blue-50/30 dark:bg-blue-950/5 border-blue-100 dark:border-blue-900/30'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className={`w-4 h-4 shrink-0 ${
                            isResolved ? 'text-neutral-400' : isHigh ? 'text-red-500' : 'text-amber-500'
                          }`} />
                          <span className="text-xs font-extrabold uppercase tracking-wider font-mono">
                            {anom.severity} Risk
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-medium">
                          {new Date(anom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <p className="font-semibold text-neutral-800 dark:text-slate-200">
                          {anom.employeeName} <span className="font-normal text-neutral-400">({anom.role})</span>
                        </p>
                        <p className="text-neutral-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {anom.reason}
                        </p>
                        <p className="font-mono text-[10px] text-neutral-400 mt-1">
                          Booking ID: {anom.bookingId} | Location: {anom.location}
                        </p>
                      </div>

                      <div className="mt-3.5 pt-3.5 border-t border-dashed border-neutral-100 dark:border-slate-800 flex justify-between items-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isResolved ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                        }`}>
                          {anom.status}
                        </span>
                        {!isResolved && (
                          <button
                            type="button"
                            onClick={() => handleResolveAnomaly(anom.id)}
                            className="text-[10px] font-bold text-brand-primary hover:text-brand-primary-dark transition uppercase tracking-wider"
                          >
                            Resolve Action
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Booking Creator */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-100 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-4">
            <div className="pb-3 border-b border-neutral-100 dark:border-slate-800">
              <h2 className="text-lg font-bold font-heading text-neutral-900 dark:text-white flex items-center gap-2">
                Quick Booking Request Creator
              </h2>
              <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
                Simulate a new booking creation request from the Sales DSE (Asha).
              </p>
            </div>

            <form onSubmit={handleRequestBooking} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Booking ID (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={newBookingId}
                  onChange={(e) => setNewBookingId(e.target.value)}
                  placeholder="e.g. b105"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Enquiry Number (Optional)
                </label>
                <input
                  type="text"
                  value={newEnquiry}
                  onChange={(e) => setNewEnquiry(e.target.value)}
                  placeholder="e.g. ENQ998"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:outline-none focus:border-brand-primary"
                />
              </div>

              <button
                type="submit"
                disabled={requestStatus === 'submitting'}
                className="w-full py-2 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
              >
                {requestStatus === 'submitting' ? 'Requesting...' : 'Submit Request'}
              </button>
            </form>

            {requestStatus === 'success' && (
              <p className="text-xs text-green-500 font-semibold animate-pulse text-center">
                Booking requested successfully under DSE (Asha)!
              </p>
            )}
            {requestStatus === 'error' && (
              <p className="text-xs text-red-500 font-semibold text-center">
                Failed to request booking. Booking ID may already exist.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
