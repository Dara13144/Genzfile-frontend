import React, { useState, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  Download,
  Copy,
  Check,
  Expand,
  Info,
  Sparkles,
  Trash2,
} from 'lucide-react';
import GifMakerModal from './GifMakerModal.jsx';

export default function ImageViewerModal({ file, onClose, onDelete }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMeta, setShowMeta] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const containerRef = useRef(null);

  if (!file) return null;

  const imageUrl = file.directUrl || `/api/files/stream/${encodeURIComponent(file.storage_key || file.id)}`;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleOriginalSize = () => setZoom(1.5);
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-md select-none animate-in fade-in duration-200"
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 text-white z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">
              {file.original_filename}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>{(file.file_size_bytes / 1024).toFixed(1)} KB</span>
              {file.width && file.height && (
                <span>• {file.width} × {file.height} px</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-400 px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetZoom}
            className="hidden sm:inline-flex px-2 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
            title="Fit to Screen"
          >
            Fit
          </button>

          <button
            onClick={handleOriginalSize}
            className="hidden sm:inline-flex px-2 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:text-white"
            title="100% Size"
          >
            1:1
          </button>

          <button
            onClick={handleRotate}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Rotate 90deg"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          <button
            onClick={() => setShowGifModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-sm"
            title="Convert this image into an animated GIF"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Make GIF</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <a
            href={imageUrl}
            download={file.original_filename}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Delete this file?')) {
                  onDelete(file.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-xs font-semibold text-red-400 hover:text-white transition-colors border border-red-500/30"
              title="Delete File"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Image Stage Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4 cursor-grab active:cursor-grabbing">
        <img
          src={imageUrl}
          alt={file.original_filename}
          loading="lazy"
          className="transition-transform duration-150 ease-out max-h-full max-w-full object-contain shadow-2xl rounded"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
          }}
          draggable={false}
        />
      </div>

      {showGifModal && (
        <GifMakerModal
          isOpen={showGifModal}
          onClose={() => setShowGifModal(false)}
          initialFile={file}
        />
      )}
    </div>
  );
}
