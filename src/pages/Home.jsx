import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  File,
  Image,
  Video,
  FileText,
  Archive,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Eye,
  Download,
  Zap,
  Shield,
  Clock,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import ShareModal from '../components/ShareModal.jsx';
import ImageViewerModal from '../components/ImageViewerModal.jsx';
import VideoPlayerModal from '../components/VideoPlayerModal.jsx';
import GifMakerModal from '../components/GifMakerModal.jsx';
import CyberUploadBadge from '../components/CyberUploadBadge.jsx';
import { CdnAnimatedIcon, SecurityAnimatedIcon, PreviewsAnimatedIcon } from '../components/AnimatedFeatureIcons.jsx';

export default function Home() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('root');

  // Modals state
  const [activeShareFile, setActiveShareFile] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);
  const [activeVideoPreview, setActiveVideoPreview] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [gifModalInitialFile, setGifModalInitialFile] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadFolders();
    } else {
      setFolders([]);
    }
  }, [user]);

  const loadFolders = async () => {
    try {
      const res = await api.getFolders();
      if (res?.success) setFolders(res.folders || []);
    } catch {
      // Ignored
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    if (!user) {
      setUploadError('AUTH_REQUIRED');
      return;
    }
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadProgress(0);

      const res = await api.uploadFiles(files, selectedFolder, (percent) => {
        setUploadProgress(percent);
      });

      if (res.success && res.files) {
        setRecentUploads(prev => [...res.files, ...prev]);
        refreshUser();
      }
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyLink = (file) => {
    const origin = window.location.origin;
    const url = `${origin}/f/${file.publicToken || file.activeShareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePreview = (file) => {
    if (file.file_category === 'image') {
      setActiveImagePreview(file);
    } else if (file.file_category === 'video') {
      setActiveVideoPreview(file);
    } else {
      window.open(`/view/${file.publicToken || file.activeShareToken}`, '_blank');
    }
  };

  const handleDeleteRecent = async (fileId) => {
    try {
      await api.deleteFile(fileId);
    } catch (err) {
      console.warn('Failed to delete recent upload on server:', err);
    }
    setRecentUploads(prev => prev.filter(f => f.id !== fileId));
    refreshUser();
  };

  const handleClearAllRecent = async () => {
    const ids = recentUploads.map(f => f.id);
    try {
      if (ids.length > 0) {
        await api.bulkDeleteFiles(ids);
      }
    } catch (err) {
      console.warn('Clear all recent uploads err:', err);
    }
    setRecentUploads([]);
    refreshUser();
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Headline */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs font-bold animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Next-Gen High-Speed Cloud File Delivery</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Host, Stream & Share Media with{' '}
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Infinite Ease
          </span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('uploadSubtitle')}
        </p>
      </div>

      {/* Main Drag & Drop Upload Stage */}
      <div className="max-w-3xl mx-auto space-y-3">
        {/* Upload Mode Selector / GIF Studio Banner */}
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <UploadCloud className="w-4 h-4 text-brand-500" />
            <span>Fast Upload Center</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setGifModalInitialFile(null);
              setIsGifModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Convert any video or sequence of images into animated GIFs"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>Video & Image to GIF Studio</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/20 uppercase tracking-wider font-extrabold">New</span>
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01] shadow-2xl shadow-brand-500/20'
              : 'border-slate-300 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md hover:border-brand-400 dark:hover:border-brand-500/50 shadow-xl'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <CyberUploadBadge size="lg" isDragging={isDragging} />

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('dropFilesHere')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('maxSizeNotice')}
              </p>
            </div>

            <button
              type="button"
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/25 transition-all"
            >
              {t('chooseFiles')}
            </button>
          </div>

          {/* Folder Target Selector */}
          {folders.length > 0 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <span className="font-semibold text-slate-500">Target Folder:</span>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="bg-transparent font-bold text-brand-600 dark:text-brand-400 focus:outline-none cursor-pointer"
              >
                <option value="root">Root Directory</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.folder_name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-4 p-4 rounded-2xl glass-card border border-brand-500/30 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
                Uploading and encrypting files...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {uploadError === 'AUTH_REQUIRED'
                  ? 'Please sign in or register an account to upload and store files in your vault.'
                  : uploadError}
              </span>
            </div>
            {uploadError === 'AUTH_REQUIRED' && (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded-lg border border-red-400/50 text-red-600 dark:text-red-300 font-bold text-xs hover:bg-red-500/10 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Uploads Section */}
      {recentUploads.length > 0 && (
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {t('recentUploads')}
            </h3>
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-slate-400">{recentUploads.length} item(s)</span>
              <button
                onClick={handleClearAllRecent}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold transition-all border border-red-500/20"
                title="Clear all recent uploads"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {recentUploads.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 shrink-0">
                    {file.file_category === 'image' && <Image className="w-5 h-5 text-indigo-500" />}
                    {file.file_category === 'video' && <Video className="w-5 h-5 text-cyan-500" />}
                    {file.file_category === 'document' && <FileText className="w-5 h-5 text-emerald-500" />}
                    {file.file_category === 'archive' && <Archive className="w-5 h-5 text-amber-500" />}
                    {['other', 'audio'].includes(file.file_category) && <File className="w-5 h-5 text-slate-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {file.original_filename}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {(file.file_size_bytes / (1024 * 1024)).toFixed(2)} MB • Ready to share
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(file)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === file.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handlePreview(file)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveShareFile(file)}
                    className="p-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 transition-colors"
                    title="Share Options"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteRecent(file.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Value Props */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <CdnAnimatedIcon className="w-16 h-16" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
              Instant CDN Delivery
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Files stream immediately across high-speed nodes with HTTP Range partial streaming for instant playback.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <SecurityAnimatedIcon className="w-16 h-16" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
              Strict Row-Level Security
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Files are private by default. Share links can be password-locked, auto-expired, or download-capped.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center">
            <PreviewsAnimatedIcon className="w-16 h-16" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">
              Auto-Thumbnails & Previews
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              High-fidelity WebP thumbnails and interactive full-browser media players with zoom, seek, and speed controls.
            </p>
          </div>
        </div>
      </div>

      {/* Storage Plans Promo CTA Banner */}
      <div className="rounded-3xl p-6 sm:p-8 glass-card border border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{t('genzStoragePlans')}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('needMoreVaultSpace')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            {t('homePricingPromoDesc')}
          </p>
        </div>

        <Link
          to="/pricing"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 shrink-0 active:scale-95 btn-shimmer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('exploreStoragePlans')}</span>
        </Link>
      </div>

      {/* Modals */}
      {activeShareFile && (
        <ShareModal
          file={activeShareFile}
          onClose={() => setActiveShareFile(null)}
          onUpdated={refreshUser}
        />
      )}

      {activeImagePreview && (
        <ImageViewerModal
          file={activeImagePreview}
          onClose={() => setActiveImagePreview(null)}
          onDelete={handleDeleteRecent}
        />
      )}

      {activeVideoPreview && (
        <VideoPlayerModal
          file={activeVideoPreview}
          onClose={() => setActiveVideoPreview(null)}
          onDelete={handleDeleteRecent}
        />
      )}

      {isGifModalOpen && (
        <GifMakerModal
          isOpen={isGifModalOpen}
          onClose={() => {
            setIsGifModalOpen(false);
            setGifModalInitialFile(null);
          }}
          initialFile={gifModalInitialFile}
          onSuccess={(newGif) => {
            setRecentUploads((prev) => [newGif, ...prev]);
            refreshUser();
          }}
        />
      )}
    </div>
  );
}
