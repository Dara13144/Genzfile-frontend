import React, { useState } from 'react';
import {
  FileText,
  Image,
  Video,
  Archive,
  Music,
  File,
  MoreVertical,
  Share2,
  Download,
  Trash2,
  RefreshCw,
  FolderInput,
  Edit2,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function FileItem({
  file,
  viewMode = 'grid', // 'grid' | 'list'
  isSelected = false,
  onToggleSelect,
  onPreview,
  onShare,
  onMakeGif,
  onRename,
  onMove,
  onDelete,
  onRestore,
  onPermanentDelete,
  isTrash = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'image':
        return <Image className="w-5 h-5 text-indigo-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-cyan-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-amber-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-rose-500" />;
      default:
        return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const hasThumbnail = file.file_category === 'image';
  const previewUrl = file.thumbnailUrl || file.directUrl || `/api/files/stream/${encodeURIComponent(file.storage_key || file.id)}`;

  // Grid View Card
  if (viewMode === 'grid') {
    return (
      <div
        className={`group relative rounded-2xl glass-card border transition-all duration-200 overflow-hidden flex flex-col ${
          isSelected
            ? 'border-brand-500 ring-2 ring-brand-500/30'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect && onToggleSelect(file.id)}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur"
          />
        </div>

        {/* Thumbnail Preview Stage */}
        <div
          onClick={() => onPreview && onPreview(file)}
          className="relative h-36 bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {hasThumbnail ? (
            <img
              src={previewUrl}
              alt={file.original_filename}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
              {getCategoryIcon(file.file_category)}
            </div>
          )}

          {/* Quick Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-lg text-xs font-semibold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Preview
            </span>
          </div>
        </div>

        {/* File Metadata & Actions */}
        <div className="p-3.5 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              onClick={() => onPreview && onPreview(file)}
              className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-brand-500 transition-colors"
              title={file.original_filename}
            >
              {file.original_filename}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
              <span>{formatSize(file.file_size_bytes)}</span>
              <span>•</span>
              <span>{formatDate(file.created_at)}</span>
            </div>
          </div>

          {/* Actions Dropdown & Quick Delete */}
          <div className="relative flex items-center gap-0.5">
            {!isTrash ? (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(file.id); }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Move to Trash"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onPermanentDelete && onPermanentDelete(file.id); }}
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Delete Permanently"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-xl glass-card shadow-2xl py-1 z-30 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {!isTrash ? (
                  <>
                    <button
                      onClick={() => { onPreview && onPreview(file); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Eye className="w-3.5 h-3.5 text-brand-500" /> Preview
                    </button>
                    <button
                      onClick={() => { onShare && onShare(file); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-500" /> Share Link
                    </button>
                    {(file.file_category === 'video' || file.file_category === 'image') && (
                      <button
                        onClick={() => { onMakeGif && onMakeGif(file); setMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 font-bold"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Convert to GIF
                      </button>
                    )}
                    <a
                      href={`/api/files/${file.id}/download`}
                      download={file.original_filename}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-500" /> Download
                    </a>
                    <button
                      onClick={() => { onRename && onRename(file); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-amber-500" /> Rename
                    </button>
                    <button
                      onClick={() => { onMove && onMove(file); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <FolderInput className="w-3.5 h-3.5 text-indigo-500" /> Move to Folder
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                    <button
                      onClick={() => { onDelete && onDelete(file.id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Move to Trash
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { onRestore && onRestore(file.id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Restore File
                    </button>
                    <button
                      onClick={() => { onPermanentDelete && onPermanentDelete(file.id); setMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View Row
  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl glass-card border transition-colors ${
        isSelected
          ? 'border-brand-500 ring-1 ring-brand-500/30'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect && onToggleSelect(file.id)}
          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
        />

        <div
          onClick={() => onPreview && onPreview(file)}
          className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center cursor-pointer shrink-0 overflow-hidden"
        >
          {hasThumbnail ? (
            <img src={previewUrl} alt={file.original_filename} className="w-full h-full object-cover" />
          ) : (
            getCategoryIcon(file.file_category)
          )}
        </div>

        <div className="min-w-0">
          <p
            onClick={() => onPreview && onPreview(file)}
            className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:text-brand-500"
          >
            {file.original_filename}
          </p>
          <p className="text-[11px] text-slate-400">
            {formatSize(file.file_size_bytes)} • {formatDate(file.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!isTrash ? (
          <>
            <button
              onClick={() => onShare && onShare(file)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {(file.file_category === 'video' || file.file_category === 'image') && (
              <button
                onClick={() => onMakeGif && onMakeGif(file)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Convert to Animated GIF"
              >
                <Sparkles className="w-4 h-4 text-teal-500" />
              </button>
            )}
            <a
              href={`/api/files/${file.id}/download`}
              download={file.original_filename}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={() => onDelete && onDelete(file.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Trash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRestore && onRestore(file.id)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
            >
              Restore
            </button>
            <button
              onClick={() => onPermanentDelete && onPermanentDelete(file.id)}
              className="px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg"
            >
              Purge
            </button>
          </>
        )}
      </div>
    </div>
  );
}
