import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkBackendHealth } from '../store/slices/healthSlice';
import { RefreshCw, Database, Server, Clock, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

export default function HealthCard() {
  const dispatch = useDispatch();
  const { data, loading, error, lastChecked } = useSelector((state) => state.health);

  const handleRefresh = () => {
    dispatch(checkBackendHealth());
  };

  const isConnected = data && data.success;
  const dbConnected = data?.database?.connected;

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-md shadow-xl transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Full-Stack Connectivity Monitor</h2>
            <p className="text-xs text-slate-400">Verifying Axios + Redux Toolkit + Express Health API</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Pinging API...' : 'Ping API'}
        </button>
      </div>

      {/* Grid of status items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* API Server Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-slate-400" /> Express Server
            </span>
            {isConnected ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Offline
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-slate-200">
              {isConnected ? data.message : error || 'Connecting...'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Port: 5000 (Env: {data?.environment || 'development'})
            </p>
          </div>
        </div>

        {/* Database Status */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-400" /> MongoDB
            </span>
            {dbConnected ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {data?.database?.status || 'Standby'}
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-slate-200">
              {data?.database?.status === 'Connected'
                ? 'MongoDB Active'
                : 'Mongoose Configured'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {dbConnected
                ? 'Ready for product & user models'
                : 'Configure MONGO_URI in backend/.env'}
            </p>
          </div>
        </div>

        {/* System Uptime */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Uptime & Latency
            </span>
            <span className="text-xs text-slate-500">
              {lastChecked ? `Checked ${lastChecked}` : 'Waiting'}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-sm font-semibold text-slate-200">
              {data?.uptime ? `Uptime: ${data.uptime}` : 'Pending response'}
            </p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              {data?.timestamp || 'Last sync pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Raw Payload Preview */}
      {data && (
        <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400">Response Payload (GET /api/health):</span>
            <span className="text-[10px] text-slate-500">via Redux Toolkit createAsyncThunk</span>
          </div>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 bg-slate-900/50 rounded-lg">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      {error && !loading && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>Error pinging API: <b>{error}</b>. Ensure backend is running on port 5000.</span>
        </div>
      )}
    </div>
  );
}

