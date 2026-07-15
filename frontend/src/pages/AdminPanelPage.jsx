import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getActionWeights, 
  updateActionWeights, 
  getAnomalies, 
  updateAnomalyStatus, 
  requestBooking,
  getRouletteQueue,
  approveRouletteItem
} from '../api/client';
import { 
  ShieldAlert, 
  Settings, 
  Save, 
  CheckCircle, 
  RotateCcw, 
  AlertTriangle, 
  ShieldX, 
  ArrowLeft,
  Swords,
  Clock,
  UserCheck,
  Check
} from 'lucide-react';

export default function AdminPanelPage() {
  const currentUserId = localStorage.getItem('dealerxp_user_id') || '';
  const isAdmin = currentUserId === 'u3';

  const [weights, setWeights] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [rouletteItems, setRouletteItems] = useState([]);
  const [loadingWeights, setLoadingWeights] = useState(true);
  const [loadingAnomalies, setLoadingAnomalies] = useState(true);
  const [loadingRoulette, setLoadingRoulette] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [newBookingId, setNewBookingId] = useState('');
  const [newEnquiry, setNewEnquiry] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadWeights();
      loadAnomalies();
      loadRoulette();
    }
  }, [isAdmin]);

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

  const loadRoulette = () => {
    setLoadingRoulette(true);
    getRouletteQueue()
      .then(data => {
        setRouletteItems(data);
        setLoadingRoulette(false);
      })
      .catch(err => {
        console.error("Failed to load roulette queue", err);
        setLoadingRoulette(false);
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

  const handleApproveRoulette = (id) => {
    approveRouletteItem(id)
      .then(res => {
        if (res.success) {
          loadRoulette();
        }
      })
      .catch(err => {
        console.error("Failed to approve roulette item", err);
      });
  };

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
        setRequestStatus(null);
      });
  };

  // Lock down: show 403 access denied for u1 and u2
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-rose-500/30 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-3xl mb-6 shadow-lg shadow-rose-500/15 animate-pulse">
            <ShieldX size={32} />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">
            Security Clearance Fault
          </h2>
          <p className="text-neutral-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
            Access to <strong>/admin/actions/weights</strong> is restricted. This page is locked down and requires Level 3 Branch Manager credentials.
          </p>
          <div className="mt-8 border-t border-neutral-100 dark:border-slate-850 pt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white text-xs font-bold rounded-xl uppercase tracking-wider transition-all duration-150"
            >
              <ArrowLeft size={14} />
              Return to Lobby Hub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-neutral-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm dark:shadow-2xl">
        <h1 className="text-2xl font-black font-heading text-neutral-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-primary" />
          Admin Console
        </h1>
        <p className="text-sm text-neutral-500 dark:text-slate-400 mt-1">
          Lockdown Active • Authorized: Vikram (Branch Manager)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Reviewer Roulette Audits Queue */}
      <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Swords className="w-5 h-5 text-indigo-500" />
            <span>Reviewer Roulette Audits</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5">
            Flagged ~2% of high-value events randomly for manual confirmation before scoring points are released.
          </p>
        </div>

        {loadingRoulette ? (
          <p className="text-sm font-semibold text-neutral-450 py-4 text-center">Loading audit queue...</p>
        ) : rouletteItems.filter(r => !r.approved).length === 0 ? (
          <div className="p-6 bg-neutral-50 dark:bg-slate-950/40 rounded-xl border border-neutral-100 dark:border-slate-850 text-center text-xs text-neutral-450 dark:text-slate-500 font-semibold">
            All roulette audits completed. Current queue is empty.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rouletteItems.filter(item => !item.approved).map((item) => (
              <div 
                key={item.id} 
                className="p-4 bg-neutral-50 dark:bg-slate-950/40 border border-neutral-150 dark:border-slate-850 rounded-xl flex justify-between items-start gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold text-[9px] uppercase tracking-wider">
                      Audit Flagged
                    </span>
                    <span className="text-[10px] text-neutral-450 dark:text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock size={11} />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {item.action.replace(/_/g, ' ')}
                  </h4>
                  <div className="text-xs text-neutral-500 dark:text-slate-400">
                    Employee: <strong className="text-neutral-850 dark:text-white">{item.employeeName}</strong> • Stake: <strong className="text-teal-650 dark:text-teal-400">+{item.points} XP</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleApproveRoulette(item.id)}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md shadow-emerald-500/10 shrink-0 self-center"
                >
                  <Check size={14} />
                  Approve Points
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weight Editor Panel (takes 2/3 of grid space) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
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

          {saveStatus === 'error' && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-red-750 dark:text-red-400 px-4 py-2.5 rounded-lg flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Failed to update weights on database storage.</span>
            </div>
          )}

          {loadingWeights ? (
            <p className="text-sm font-semibold text-neutral-500">Loading action weights...</p>
          ) : (
            <div className="space-y-4">
              {weights.map((w, idx) => (
                <div key={w.action} className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-slate-850/60 text-sm">
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-white block">{w.label || w.action}</span>
                    <span className="text-[10px] text-neutral-450 dark:text-slate-500 font-mono tracking-wider">{w.action}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={w.points}
                      onChange={(e) => handleWeightChange(idx, e.target.value)}
                      className="w-20 text-center font-bold px-2 py-1 bg-neutral-50 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <span className="text-xs font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest">XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Anomalies & Quick demo builder */}
        <div className="space-y-8">
          
          {/* Audit Log / Anomalies */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              Anti-Gaming Anomalies
            </h2>

            {loadingAnomalies ? (
              <p className="text-sm font-semibold text-neutral-500">Loading anomaly logs...</p>
            ) : anomalies.length === 0 ? (
              <p className="text-xs text-neutral-400 dark:text-slate-500 py-4 text-center font-semibold bg-neutral-50 dark:bg-slate-950/20 border border-neutral-100 dark:border-slate-850 rounded-xl">
                No active collusions or caps flagged.
              </p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {anomalies.map((anom) => (
                  <div 
                    key={anom.id} 
                    className={`p-3 border rounded-xl space-y-2 text-xs transition duration-150 ${
                      anom.status === 'Resolved' 
                        ? 'bg-neutral-50/50 dark:bg-slate-950/20 border-neutral-200 dark:border-slate-850 opacity-60' 
                        : 'bg-red-500/5 border-red-500/20 dark:border-red-950/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        anom.type === 'COLLUSION' 
                          ? 'bg-red-500/10 text-red-500' 
                          : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {anom.type}
                      </span>
                      <span className="text-[10px] text-neutral-450 dark:text-slate-500 font-bold uppercase tracking-wider">{anom.status}</span>
                    </div>
                    
                    <p className="text-neutral-750 dark:text-slate-350 leading-relaxed">{anom.message}</p>
                    <div className="text-[10px] text-neutral-400 dark:text-slate-550 font-bold uppercase tracking-wide">
                      Time: {new Date(anom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {anom.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveAnomaly(anom.id)}
                        className="w-full mt-2 py-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded font-bold transition text-[10px] uppercase tracking-wider"
                      >
                        Acknowledge & Clear Anomaly
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Mock Enquiry Requestor (Demo tool) */}
          <div className="bg-white dark:bg-slate-900 border border-neutral-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-teal-500" />
              Demo: Trigger Booking Enquiry
            </h2>
            <p className="text-xs text-neutral-500 dark:text-slate-400 mt-1 leading-relaxed">
              Submit a new booking request to populate the Race Track timeline queue for testing.
            </p>

            <form onSubmit={handleRequestBooking} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Booking ID</label>
                <input
                  type="text"
                  placeholder="e.g. b101, b102"
                  value={newBookingId}
                  onChange={(e) => setNewBookingId(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-bold text-neutral-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Enquiry / Car Model</label>
                <input
                  type="text"
                  placeholder="e.g. Hyundai Tucson"
                  value={newEnquiry}
                  onChange={(e) => setNewEnquiry(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-slate-950 border border-neutral-200 dark:border-slate-800 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs font-bold text-neutral-800 dark:text-white"
                />
              </div>

              {requestStatus === 'success' && (
                <div className="p-2.5 bg-green-500/10 text-green-600 rounded text-xs font-bold">
                  Enquiry booking created! Switch to Race Track tab.
                </div>
              )}

              {requestStatus === 'error' && (
                <div className="p-2.5 bg-red-500/10 text-red-600 rounded text-xs font-bold">
                  Failed to create enquiry.
                </div>
              )}

              <button
                type="submit"
                disabled={requestStatus === 'submitting'}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl font-bold transition text-xs uppercase tracking-wider"
              >
                Submit Demo Enquiry
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
