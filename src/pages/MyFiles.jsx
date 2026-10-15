import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Folder,
  FolderPlus,
  Search,
  Grid,
  List,
  Filter,
  Trash2,
  RefreshCw,
  Edit2,
  FolderInput,
  Share2,
  UploadCloud,
  ChevronRight,
  HardDrive,
  FileText,
  Image,
  Video,
  Archive,
  MoreVertical,
  X,
  Check,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import FileItem from '../components/FileItem.jsx';
import ShareModal from '../components/ShareModal.jsx';
import ImageViewerModal from '../components/ImageViewerModal.jsx';
import VideoPlayerModal from '../components/VideoPlayerModal.jsx';
import GifMakerModal from '../components/GifMakerModal.jsx';
import CyberUploadBadge from '../components/CyberUploadBadge.jsx';

export default function MyFiles() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();

  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState('root');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [viewMode, setViewMode] = useState('grid');
  const [isTrashView, setIsTrashView] = useState(false);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedFileIds, setSelectedFileIds] = useState([]);

  // Modals & Action Dialogs
  const [activeShareFile, setActiveShareFile] = useState(null);
  const [activeImagePreview, setActiveImagePreview] = useState(null);
  const [activeVideoPreview, setActiveVideoPreview] = useState(null);
  const [isGifModalOpen, setIsGifModalOpen] = useState(false);
  const [gifModalInitialFile, setGifModalInitialFile] = useState(null);

  // New Folder Modal
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Rename Modal
  const [fileToRename, setFileToRename] = useState(null);
  const [newFilename, setNewFilename] = useState('');

  // Move Modal
  const [fileToMove, setFileToMove] = useState(null);
  const [targetFolderId, setTargetFolderId] = useState('root');

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    loadFiles();
  }, [currentFolderId, activeCategory, sortBy, isTrashView]);

  const loadFolders = async () => {
    try {
      const res = await api.getFolders();
      if (res.success) setFolders(res.folders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = {
        category: activeCategory,
        sort: sortBy,
        trash: isTrashView ? 'true' : 'false',
      };
      if (!isTrashView) {
        params.folder_id = currentFolderId;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.getFiles(params);
      if (res.success) {
        setFiles(res.files || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFiles();
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const res = await api.createFolder(newFolderName.trim(), currentFolderId === 'root' ? null : currentFolderId);
      if (res.success) {
        setFolders(prev => [...prev, res.folder]);
        setNewFolderName('');
        setShowFolderModal(false);
      }
    } catch (err) {
      alert('Failed to create folder: ' + err.message);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder? Contained files will be moved to root.')) return;
    try {
      await api.deleteFolder(folderId);
      setFolders(prev => prev.filter(f => f.id !== folderId));
      if (currentFolderId === folderId) setCurrentFolderId('root');
      loadFiles();
    } catch (err) {
      alert('Failed to delete folder: ' + err.message);
    }
  };

  const handleRenameFile = async (e) => {
    e.preventDefault();
    if (!fileToRename || !newFilename.trim()) return;
    try {
      await api.updateFile(fileToRename.id, { original_filename: newFilename.trim() });
      setFiles(prev => prev.map(f => f.id === fileToRename.id ? { ...f, original_filename: newFilename.trim() } : f));
      setFileToRename(null);
    } catch (err) {
      alert('Failed to rename file: ' + err.message);
    }
  };

  const handleMoveFile = async (e) => {
    e.preventDefault();
    if (!fileToMove) return;
    try {
      await api.updateFile(fileToMove.id, { folder_id: targetFolderId });
      setFiles(prev => prev.filter(f => f.id !== fileToMove.id));
      setFileToMove(null);
    } catch (err) {
      alert('Failed to move file: ' + err.message);
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await api.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      refreshUser();
    } catch (err) {
      alert('Error moving file to trash: ' + err.message);
    }
  };

  const handleRestoreFile = async (id) => {
    try {
      await api.restoreFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      refreshUser();
    } catch (err) {
      alert('Error restoring file: ' + err.message);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!confirm('Permanently delete this file? This action is irreversible.')) return;
    try {
      await api.permanentDeleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
      refreshUser();
    } catch (err) {
      alert('Error deleting file: ' + err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFileIds.length === 0) return;
    if (!confirm(`Move ${selectedFileIds.length} selected files to trash?`)) return;
    try {
      await api.bulkDeleteFiles(selectedFileIds);
      setFiles(prev => prev.filter(f => !selectedFileIds.includes(f.id)));
      setSelectedFileIds([]);
      refreshUser();
    } catch (err) {
      alert('Bulk delete failed: ' + err.message);
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm('Are you sure you want to empty the trash? All trashed files will be permanently deleted and cannot be recovered.')) return;
    try {
      const res = await api.emptyTrash();
      if (res.success) {
        setFiles([]);
        setSelectedFileIds([]);
        refreshUser();
      }
    } catch (err) {
      alert('Failed to empty trash: ' + err.message);
    }
  };

  const handleBulkPermanentDelete = async () => {
    if (selectedFileIds.length === 0) return;
    if (!confirm(`Permanently delete ${selectedFileIds.length} selected file(s)? This cannot be undone.`)) return;
    try {
      for (const id of selectedFileIds) {
        await api.permanentDeleteFile(id);
      }
      setFiles(prev => prev.filter(f => !selectedFileIds.includes(f.id)));
      setSelectedFileIds([]);
      refreshUser();
    } catch (err) {
      alert('Permanent delete failed: ' + err.message);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedFileIds.length === 0) return;
    try {
      for (const id of selectedFileIds) {
        await api.restoreFile(id);
      }
      setFiles(prev => prev.filter(f => !selectedFileIds.includes(f.id)));
      setSelectedFileIds([]);
      refreshUser();
    } catch (err) {
      alert('Restore failed: ' + err.message);
    }
  };

  const toggleSelectAll = () => {
    if (selectedFileIds.length === files.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map(f => f.id));
    }
  };

  const toggleSelectFile = (id) => {
    setSelectedFileIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const currentFolder = folders.find(f => f.id === currentFolderId);

  if (!user && !loading) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <HardDrive className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to View Files</h2>
          <p className="text-xs text-slate-500">Please sign in or register to access and manage your cloud media vault.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">Sign In</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 font-bold text-xs text-slate-700 dark:text-slate-200">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Storage Quota & Plan Status Banner */}
      {user && (
        <div className="p-4 rounded-2xl glass-card border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider text-[10px]">
                    {user.planName || 'Standard Tier'}
                  </span>
                  <span>{user.storageUsedFormatted} used of {user.storageQuotaFormatted}</span>
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {user.usagePercentage || 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(user.usagePercentage || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            to="/pricing"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade Storage</span>
          </Link>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <span
              onClick={() => { setIsTrashView(false); setCurrentFolderId('root'); }}
              className="cursor-pointer hover:text-brand-500 transition-colors"
            >
              Root
            </span>
            {currentFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-800 dark:text-white font-bold">{currentFolder.folder_name}</span>
              </>
            )}
            {isTrashView && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-red-500 font-bold">{t('trash')}</span>
              </>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {isTrashView ? t('trash') : (currentFolder ? currentFolder.folder_name : t('myFiles'))}
          </h2>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          {!isTrashView ? (
            <>
              <button
                onClick={() => {
                  setGifModalInitialFile(null);
                  setIsGifModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-500/10 to-indigo-500/10 hover:from-teal-500 hover:to-indigo-500 text-teal-600 dark:text-teal-400 hover:text-white transition-all border border-teal-500/30"
                title="Create animated GIFs from videos or images"
              >
                <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
                <span>GIF Studio</span>
              </button>
              <button
                onClick={() => setShowFolderModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-brand-500" />
                <span>{t('newFolder')}</span>
              </button>
              <button
                onClick={() => { setIsTrashView(true); setSelectedFileIds([]); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t('trash')}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEmptyTrash}
                disabled={files.length === 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-500/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
                title="Permanently remove all items in trash"
              >
                <Trash2 className="w-4 h-4" />
                <span>Empty Trash</span>
              </button>
              <button
                onClick={() => { setIsTrashView(false); setSelectedFileIds([]); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-500 transition-colors"
              >
                Back to Files
              </button>
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-500' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-500' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs & Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: t('allFiles') },
            { id: 'image', label: t('images') },
            { id: 'video', label: t('videos') },
            { id: 'document', label: t('documents') },
            { id: 'archive', label: t('archives') },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </form>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="size_desc">Size (Large)</option>
            <option value="size_asc">Size (Small)</option>
          </select>
        </div>
      </div>

      {/* Folders List (if not in trash) */}
      {!isTrashView && currentFolderId === 'root' && folders.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Folders</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setCurrentFolderId(folder.id)}
                className="group relative flex items-center gap-2.5 p-3 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 cursor-pointer transition-all shadow-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 group-hover:scale-105 transition-transform">
                  <Folder className="w-4 h-4 fill-brand-500/20" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex-1">
                  {folder.folder_name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                  title="Delete Folder"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Operations Toolbar */}
      {selectedFileIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-600 dark:text-brand-300">
          <span>{selectedFileIds.length} item(s) selected</span>
          <div className="flex items-center gap-2">
            {!isTrashView ? (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Move to Trash
              </button>
            ) : (
              <>
                <button
                  onClick={handleBulkRestore}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Restore Selected
                </button>
                <button
                  onClick={handleBulkPermanentDelete}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                </button>
              </>
            )}
            <button
              onClick={() => setSelectedFileIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Files Grid / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-brand-500 mb-2" />
          <p className="text-xs font-semibold">Loading your files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <CyberUploadBadge size="md" className="mb-4" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {isTrashView ? 'Trash is empty' : 'No files found'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {isTrashView
              ? 'Files deleted from your storage will appear here.'
              : 'Upload images, videos, documents, and archives to get started.'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'space-y-2'}>
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              viewMode={viewMode}
              isSelected={selectedFileIds.includes(file.id)}
              onToggleSelect={toggleSelectFile}
              onPreview={(f) => {
                if (f.file_category === 'image') setActiveImagePreview(f);
                else if (f.file_category === 'video') setActiveVideoPreview(f);
                else window.open(`/view/${f.shareToken || f.activeShareToken}`, '_blank');
              }}
              onShare={(f) => setActiveShareFile(f)}
              onMakeGif={(f) => {
                setGifModalInitialFile(f);
                setIsGifModalOpen(true);
              }}
              onRename={(f) => { setFileToRename(f); setNewFilename(f.original_filename); }}
              onMove={(f) => { setFileToMove(f); setTargetFolderId(f.folder_id || 'root'); }}
              onDelete={handleDeleteFile}
              onRestore={handleRestoreFile}
              onPermanentDelete={handlePermanentDelete}
              isTrash={isTrashView}
            />
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleCreateFolder} className="w-full max-w-sm rounded-2xl glass-card border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rename File Modal */}
      {fileToRename && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleRenameFile} className="w-full max-w-sm rounded-2xl glass-card border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Rename File</h3>
            <input
              type="text"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToRename(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Move File Modal */}
      {fileToMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleMoveFile} className="w-full max-w-sm rounded-2xl glass-card border border-slate-200 dark:border-slate-700 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Move to Folder</h3>
            <select
              value={targetFolderId}
              onChange={(e) => setTargetFolderId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="root">Root Directory</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.folder_name}</option>
              ))}
            </select>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToMove(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-500"
              >
                Move
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modals */}
      {activeShareFile && (
        <ShareModal
          file={activeShareFile}
          onClose={() => setActiveShareFile(null)}
          onUpdated={loadFiles}
        />
      )}

      {activeImagePreview && (
        <ImageViewerModal
          file={activeImagePreview}
          onClose={() => setActiveImagePreview(null)}
          onDelete={handleDeleteFile}
        />
      )}

      {activeVideoPreview && (
        <VideoPlayerModal
          file={activeVideoPreview}
          onClose={() => setActiveVideoPreview(null)}
          onDelete={handleDeleteFile}
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
          onSuccess={() => {
            loadFiles();
            refreshUser();
          }}
        />
      )}
    </div>
  );
}
