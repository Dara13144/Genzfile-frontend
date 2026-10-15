import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Download,
  Share2,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  Eye,
  Flag,
  HardDrive,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import ShareModal from '../components/ShareModal.jsx';
import ImageViewerModal from '../components/ImageViewerModal.jsx';
import VideoPlayerModal from '../components/VideoPlayerModal.jsx';

export default function SharedFile() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Password Unlock
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [authCode, setAuthCode] = useState(null);

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Viewer modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSharedFile();
  }, [token, authCode]);

  const fetchSharedFile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSharedFile(token, authCode);
      setData(res);
    } catch (err) {
      setError(err.message || 'File not available');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockPassword = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    try {
      setUnlocking(true);
      setPasswordError(null);
      const res = await api.verifySharePassword(token, password.trim());
      if (res.success && res.authCode) {
        setAuthCode(res.authCode);
      }
    } catch (err) {
      setPasswordError(err.message || 'Invalid password');
    } finally {
      setUnlocking(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || !data?.file?.id) return;
    try {
      await api.submitAbuseReport(data.file.id, reportReason.trim());
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportReason('');
      }, 2000);
    } catch (err) {
      alert('Report submission failed: ' + err.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Decrypting shared media...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center rounded-3xl glass-card border border-red-500/30">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unavailable Link</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">{error}</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs"
        >
          Go to GenZ File
        </Link>
      </div>
    );
  }

  // Password Prompt Screen
  if (data?.passwordRequired) {
    return (
      <div className="max-w-sm mx-auto my-20 p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-center text-slate-900 dark:text-white">
          Protected File
        </h3>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 mb-6">
          The owner has encrypted this file with a password.
        </p>

        <form onSubmit={handleUnlockPassword} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
            {passwordError && (
              <p className="text-[11px] text-red-500 font-semibold mt-1.5">{passwordError}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={unlocking}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-4 h-4" />
            <span>{unlocking ? 'Verifying...' : 'Unlock & Access'}</span>
          </button>
        </form>
      </div>
    );
  }

  const { file, shareLink } = data;
  const isImage = file.file_category === 'image';
  const isVideo = file.file_category === 'video';
  const downloadUrl = `/api/share/${token}/download${authCode ? `?auth=${authCode}` : ''}`;
  const directStreamUrl = file.directUrl;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Media Preview Card */}
      <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Preview Viewport */}
        <div className="relative bg-slate-950 min-h-[320px] max-h-[500px] flex items-center justify-center overflow-hidden">
          {isImage ? (
            <img
              src={directStreamUrl}
              alt={file.original_filename}
              onClick={() => setShowImageViewer(true)}
              className="max-h-[500px] w-auto object-contain cursor-zoom-in hover:opacity-95 transition-opacity"
            />
          ) : isVideo ? (
            <video
              src={directStreamUrl}
              controls
              playsInline
              className="max-h-[500px] w-full object-contain"
            />
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-400 mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-white">{file.original_filename}</p>
              <p className="text-xs text-slate-400">
                {(file.file_size_bytes / (1024 * 1024)).toFixed(2)} MB • {file.mime_type}
              </p>
            </div>
          )}

          {/* Zoom Overlay for images */}
          {isImage && (
            <button
              onClick={() => setShowImageViewer(true)}
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-900 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Fullscreen View
            </button>
          )}
        </div>

        {/* File Meta & Action Toolbar */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-md">
              {file.original_filename}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-brand-500 uppercase">{file.file_category}</span>
              <span>•</span>
              <span>{(file.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
              {file.width && file.height && (
                <>
                  <span>•</span>
                  <span>{file.width}×{file.height}</span>
                </>
              )}
              {shareLink?.downloadCount !== undefined && (
                <>
                  <span>•</span>
                  <span>{shareLink.downloadCount} downloads</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Share / QR Code"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <a
              href={downloadUrl}
              download={file.original_filename}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </div>

      {/* Trust & Safety info card */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Scanned & verified. Protected by GenZ File Trust Engine.</span>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors font-medium"
        >
          <Flag className="w-3.5 h-3.5" /> Report Content
        </button>
      </div>

      {/* Abuse Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleReport} className="w-full max-w-md rounded-2xl glass-card border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-red-500" /> Report Content or DMCA Violation
            </h3>
            <p className="text-xs text-slate-400">
              Please explain why this content violates GenZ File's Terms of Service or infringes on copyright.
            </p>
            <textarea
              rows="4"
              placeholder="Provide details about the infringement or abuse..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            {reportSuccess && (
              <p className="text-xs text-emerald-500 font-semibold">
                Report submitted! Our moderation team will review this file.
              </p>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      {showShareModal && (
        <ShareModal
          file={{ ...file, publicToken: token }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showImageViewer && (
        <ImageViewerModal
          file={file}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </div>
  );
}
