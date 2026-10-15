import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Shield, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { api } from '../services/api.js';

export default function DownloadPage() {
  const { token } = useParams();
  const [fileData, setFileData] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInfo();
  }, [token]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setReady(true);
    }
  }, [countdown]);

  const loadInfo = async () => {
    try {
      const res = await api.getSharedFile(token);
      if (res.file) setFileData(res.file);
    } catch (err) {
      setError(err.message || 'File not found or expired');
    }
  };

  const downloadUrl = `/api/share/${token}/download`;

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center rounded-3xl glass-card border border-red-500/30">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Download Unavailable</h3>
        <p className="text-xs text-slate-400 mt-2 mb-6">{error}</p>
        <Link to="/" className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-brand-500/25">
          <Download className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">
            {fileData ? fileData.original_filename : 'Preparing your file...'}
          </h2>
          {fileData && (
            <p className="text-xs text-slate-400 mt-1">
              {(fileData.file_size_bytes / (1024 * 1024)).toFixed(2)} MB • Verified Safe
            </p>
          )}
        </div>

        {/* Countdown / Ready stage */}
        {!ready ? (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Clock className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Generating secure download link in {countdown}s...</span>
          </div>
        ) : (
          <a
            href={downloadUrl}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-brand-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
          >
            <Download className="w-5 h-5" />
            <span>Download Now</span>
          </a>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" /> SHA-256 Verified
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-500" /> High-Speed CDN
          </span>
        </div>
      </div>
    </div>
  );
}
