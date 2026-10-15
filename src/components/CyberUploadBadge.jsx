import React from 'react';

/**
 * CyberUploadBadge Component
 * Futuristic Sci-Fi Neon Cyberpunk Upload Badge with animated glowing rings,
 * scanlines, and reactive drag-and-drop feedback.
 */
export default function CyberUploadBadge({
  size = 'lg', // 'sm' | 'md' | 'lg' | 'xl'
  isDragging = false,
  className = '',
}) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24 sm:w-28 sm:h-28',
    xl: 'w-36 h-36',
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  return (
    <div className={`relative flex items-center justify-center select-none group ${currentSize} ${className}`}>
      {/* 1. Ambient Dynamic Neon Aura Glow (Cyan + Magenta) */}
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 pointer-events-none ${
          isDragging
            ? 'bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-cyan-300 opacity-90 scale-125 animate-pulse'
            : 'bg-gradient-to-tr from-cyan-500/40 via-fuchsia-500/30 to-blue-500/40 opacity-70 group-hover:opacity-100 group-hover:scale-110'
        }`}
      />

      {/* 2. Rotating Outer Sci-Fi Scanning Radar Ring */}
      <div
        className={`absolute -inset-2 rounded-full border border-dashed border-cyan-400/40 dark:border-cyan-400/60 transition-transform duration-1000 ${
          isDragging ? 'animate-spin-fast scale-110 border-cyan-300' : 'animate-spin-slow'
        }`}
        style={{ animationDuration: isDragging ? '3s' : '12s' }}
      />

      {/* 3. Secondary Counter-Rotating Neon Orbit Ring with Notches */}
      <div
        className="absolute -inset-1 rounded-full border border-fuchsia-500/30 dark:border-fuchsia-400/40 transition-transform duration-1000"
        style={{
          animation: 'spin 18s linear infinite reverse',
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)',
        }}
      />

      {/* 4. Core Cyberpunk Neon Badge Graphic */}
      <div
        className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-300 ${
          isDragging
            ? 'scale-110 rotate-3 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]'
            : 'group-hover:scale-105 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] animate-float'
        }`}
      >
        <img
          src="/neon-upload-badge.png"
          alt="Upload Zone"
          className="w-full h-full object-contain pointer-events-none select-none"
        />

        {/* 5. Center Neon Shimmer Overlay on Drag / Hover */}
        <div
          className={`absolute inset-3 rounded-xl pointer-events-none transition-opacity duration-300 ${
            isDragging
              ? 'opacity-40 bg-cyan-400/20 mix-blend-screen animate-pulse'
              : 'opacity-0 group-hover:opacity-20 bg-fuchsia-400/20'
          }`}
        />
      </div>

      {/* 6. Corner Targeting Reticles */}
      {size === 'lg' && (
        <>
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-fuchsia-500 opacity-60 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </div>
  );
}
