import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Film,
  Images,
  Sliders,
  Play,
  Pause,
  Download,
  Copy,
  Check,
  RefreshCw,
  FolderPlus,
  ArrowRight,
  UploadCloud,
  Clock,
  Eye,
} from 'lucide-react';
import { api } from '../services/api.js';

export default function GifMakerModal({
  isOpen,
  onClose,
  initialFile = null,
  onSuccess = null,
}) {
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'images'
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  // Video Settings
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [fps, setFps] = useState(12);
  const [width, setWidth] = useState(480);
  const [videoDuration, setVideoDuration] = useState(0);

  // Images Settings
  const [frameDelay, setFrameDelay] = useState(250); // ms per frame

  // Conversion Status
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [convertError, setConvertError] = useState(null);
  const [resultGif, setResultGif] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Handle initialFile if opened from a file item or viewer
  useEffect(() => {
    if (initialFile) {
      if (initialFile.file_category === 'video') {
        setActiveTab('video');
        setVideoFile(null); // will use initialFile.id
        setVideoPreviewUrl(initialFile.directUrl || `/api/files/stream/${encodeURIComponent(initialFile.storage_key)}`);
      } else if (initialFile.file_category === 'image') {
        setActiveTab('images');
        setImageFiles([]);
        setImagePreviewUrls([initialFile.directUrl || `/api/files/stream/${encodeURIComponent(initialFile.storage_key)}`]);
      }
    }
  }, [initialFile]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (videoPreviewUrl && videoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      imagePreviewUrls.forEach((url) => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [videoPreviewUrl, imagePreviewUrls]);

  if (!isOpen) return null;

  const handleVideoSelect = (file) => {
    if (!file) return;
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);
    setResultGif(null);
    setConvertError(null);
  };

  const handleImagesSelect = (files) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files);
    setImageFiles(newFiles);
    const urls = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviewUrls(urls);
    setResultGif(null);
    setConvertError(null);
  };

  const handleRemoveImage = (index) => {
    const nextFiles = [...imageFiles];
    nextFiles.splice(index, 1);
    setImageFiles(nextFiles);

    const nextUrls = [...imagePreviewUrls];
    if (nextUrls[index] && nextUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(nextUrls[index]);
    }
    nextUrls.splice(index, 1);
    setImagePreviewUrls(nextUrls);
  };

  const handleConvert = async () => {
    try {
      setIsConverting(true);
      setConvertError(null);
      setConvertProgress(10);

      let res;
      if (activeTab === 'video') {
        const formData = new FormData();
        formData.append('startTime', startTime);
        formData.append('duration', duration);
        formData.append('fps', fps);
        formData.append('width', width);

        if (videoFile) {
          formData.append('video', videoFile);
          res = await api.convertVideoToGif(formData, (p) => setConvertProgress(p));
        } else if (initialFile && initialFile.file_category === 'video') {
          res = await api.convertFileToGif(initialFile.id, {
            startTime,
            duration,
            fps,
            width,
          });
        } else {
          throw new Error('Please select a video to convert');
        }
      } else {
        // Images to GIF
        if (imageFiles.length > 0) {
          const formData = new FormData();
          formData.append('delay', frameDelay);
          formData.append('width', width);
          imageFiles.forEach((file) => formData.append('images', file));
          res = await api.convertImagesToGif(formData, (p) => setConvertProgress(p));
        } else if (initialFile && initialFile.file_category === 'image') {
          res = await api.convertFileToGif(initialFile.id, {
            delay: frameDelay,
            width,
          });
        } else {
          throw new Error('Please select at least one image');
        }
      }

      if (res && res.success && res.file) {
        setResultGif(res.file);
        setConvertProgress(100);
        if (onSuccess) onSuccess(res.file);
      } else {
        throw new Error(res.error || 'Conversion failed');
      }
    } catch (err) {
      setConvertError(err.message || 'Error converting to GIF');
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyLink = () => {
    if (!resultGif) return;
    const origin = window.location.origin;
    const link = `${origin}${resultGif.shareUrl || `/f/${resultGif.publicToken}`}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    setResultGif(null);
    setVideoFile(null);
    setImageFiles([]);
    setVideoPreviewUrl('');
    setImagePreviewUrls([]);
    setConvertError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                GIF Studio <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20">Pro Maker</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transform videos & images into high-fps looping animated GIFs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Result View */}
          {resultGif ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between">
                <span>✨ GIF generated successfully and saved to your files!</span>
                <span className="font-bold">{(resultGif.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              {/* Animated GIF Player Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center min-h-[260px] shadow-inner">
                <img
                  src={resultGif.directUrl || `/api/files/stream/${encodeURIComponent(resultGif.storage_key)}`}
                  alt="Converted Animated GIF"
                  className="max-h-[340px] w-auto object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={resultGif.directUrl || `/api/files/stream/${encodeURIComponent(resultGif.storage_key)}?download=1`}
                  download={resultGif.original_filename}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
                >
                  <Download className="w-4 h-4" /> Download GIF
                </a>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Make Another
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tabs: Video to GIF vs Images to GIF */}
              {!initialFile && (
                <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveTab('video')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'video'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Film className="w-4 h-4" /> Video to GIF
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('images')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'images'
                        ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Images className="w-4 h-4" /> Images to GIF
                  </button>
                </div>
              )}

              {/* VIDEO TO GIF MODE */}
              {activeTab === 'video' && (
                <div className="space-y-5">
                  {!videoPreviewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-3xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center space-y-3"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                        onChange={(e) => handleVideoSelect(e.target.files?.[0])}
                        className="hidden"
                      />
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                        <Film className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Click or drag video file here
                        </p>
                        <p className="text-xs text-slate-400">
                          Supports MP4, WebM, MOV, and MKV
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Video Player Preview */}
                      <div className="relative rounded-2xl overflow-hidden bg-black max-h-[240px] flex items-center justify-center">
                        <video
                          ref={videoRef}
                          src={videoPreviewUrl}
                          controls
                          onLoadedMetadata={(e) => {
                            const d = e.target.duration;
                            setVideoDuration(d);
                            if (duration > d) setDuration(Math.min(d, 5));
                          }}
                          className="w-full max-h-[240px] object-contain"
                        />
                      </div>

                      {/* Video Trimming Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                        {/* Start Time */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>Start Offset</span>
                            <span className="text-brand-500">{startTime}s</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={Math.max(0, videoDuration - 1)}
                            step="0.5"
                            value={startTime}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setStartTime(val);
                              if (videoRef.current) videoRef.current.currentTime = val;
                            }}
                            className="w-full accent-brand-500 cursor-pointer"
                          />
                        </div>

                        {/* Duration */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>Clip Duration</span>
                            <span className="text-brand-500">{duration}s</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max={Math.min(15, Math.max(1, videoDuration - startTime))}
                            step="0.5"
                            value={duration}
                            onChange={(e) => setDuration(parseFloat(e.target.value))}
                            className="w-full accent-brand-500 cursor-pointer"
                          />
                        </div>

                        {/* FPS */}
                        <div className="space-y-1.5">
                          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Frame Rate
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[10, 15, 20].map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => setFps(f)}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  fps === f
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {f} FPS
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Resolution Width */}
                        <div className="space-y-1.5">
                          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Resolution
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[320, 480, 640].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() => setWidth(w)}
                                className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  width === w
                                    ? 'bg-brand-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {w}p
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* IMAGES TO GIF MODE */}
              {activeTab === 'images' && (
                <div className="space-y-5">
                  <div
                    onClick={() => imagesInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-3xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center space-y-2"
                  >
                    <input
                      ref={imagesInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImagesSelect(e.target.files)}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                      <Images className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Select or drop multiple images to animate
                    </p>
                    <p className="text-[11px] text-slate-400">
                      PNG, JPG, WebP, SVG supported
                    </p>
                  </div>

                  {/* Frame Sequence Preview */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Frame Sequence ({imagePreviewUrls.length} frames)</span>
                        <span className="text-teal-500">Speed: {frameDelay}ms / frame</span>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {imagePreviewUrls.map((url, idx) => (
                          <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                            <img src={url} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-black/60 text-white">
                              {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Speed Slider */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span>Frame Delay Speed</span>
                          <span className="text-brand-500">{frameDelay} ms</span>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="800"
                          step="20"
                          value={frameDelay}
                          onChange={(e) => setFrameDelay(parseInt(e.target.value, 10))}
                          className="w-full accent-brand-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                          <span>Fast (80ms)</span>
                          <span>Normal (250ms)</span>
                          <span>Slow (800ms)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Alert */}
              {convertError && (
                <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                  ⚠️ {convertError}
                </div>
              )}

              {/* Progress Bar when Converting */}
              {isConverting && (
                <div className="space-y-2 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
                  <div className="flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Rendering high-quality GIF with palette generation...
                    </span>
                    <span>{convertProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${convertProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting || (activeTab === 'video' && !videoPreviewUrl) || (activeTab === 'images' && imagePreviewUrls.length === 0)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 hover:from-brand-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Converting to GIF...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Animated GIF
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
