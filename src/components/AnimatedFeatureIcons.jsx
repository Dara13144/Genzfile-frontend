import React from 'react';

/**
 * Animated CDN Icon
 * Matches Image 1: Cloud with CDN letters and 3 connected server racks with blinking LED lights & traveling data packets
 */
export function CdnAnimatedIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className} group`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-indigo-500/15 dark:bg-indigo-400/20 rounded-2xl blur-lg transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

      <svg
        viewBox="0 0 88 88"
        className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cdnCloudGrad" x1="20" y1="12" x2="68" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="cdnLineGrad" x1="44" y1="44" x2="44" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366f1" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Floating Cloud */}
        <g className="animate-cdn-cloud">
          {/* Cloud Body Outline */}
          <path
            d="M30 40 C24 40 20 35 20 29 C20 23.5 24 19 29.5 18.5 C32 13 38 9 44 9 C51.5 9 57.5 14.5 59 21.5 C64 22 68 26 68 31 C68 36 64 40 58 40 Z"
            className="stroke-indigo-600 dark:stroke-indigo-400 fill-white/80 dark:fill-slate-900/90"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* CDN Text */}
          <text
            x="44"
            y="29"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-indigo-900 dark:fill-indigo-100 font-black text-[12px] tracking-wider select-none"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            CDN
          </text>
        </g>

        {/* Connection Network Lines */}
        {/* Center Trunk to Middle Server */}
        <path d="M44 40 L44 58" className="stroke-indigo-400 dark:stroke-indigo-500/70" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left Branch */}
        <path d="M44 46 L24 46 L24 58" className="stroke-indigo-400 dark:stroke-indigo-500/70" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Right Branch */}
        <path d="M44 46 L64 46 L64 58" className="stroke-indigo-400 dark:stroke-indigo-500/70" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Animated Data Packets Flowing Down from Cloud */}
        <circle className="animate-cdn-packet-center" cx="44" cy="48" r="2.5" fill="#38bdf8" />
        <circle className="animate-cdn-packet-left" cx="24" cy="50" r="2.5" fill="#818cf8" />
        <circle className="animate-cdn-packet-right" cx="64" cy="50" r="2.5" fill="#38bdf8" />

        {/* 3 Connected Servers */}
        {/* Left Server */}
        <g transform="translate(14, 58)">
          <rect x="0" y="0" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="8" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="16" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          {/* LED lights */}
          <circle cx="4" cy="3.25" r="1.2" className="fill-emerald-400 animate-pulse" />
          <circle cx="4" cy="11.25" r="1.2" className="fill-emerald-400" />
          <circle cx="4" cy="19.25" r="1.2" className="fill-cyan-400 animate-ping opacity-75" />
        </g>

        {/* Center Server */}
        <g transform="translate(34, 58)">
          <rect x="0" y="0" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="8" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="16" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          {/* LED lights */}
          <circle cx="4" cy="3.25" r="1.2" className="fill-emerald-400" />
          <circle cx="4" cy="11.25" r="1.2" className="fill-emerald-400 animate-pulse" />
          <circle cx="4" cy="19.25" r="1.2" className="fill-indigo-400" />
        </g>

        {/* Right Server */}
        <g transform="translate(54, 58)">
          <rect x="0" y="0" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="8" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          <rect x="0" y="16" width="20" height="6.5" rx="2.5" className="stroke-indigo-700 dark:stroke-indigo-400 fill-white dark:fill-slate-800" strokeWidth="2" />
          {/* LED lights */}
          <circle cx="4" cy="3.25" r="1.2" className="fill-emerald-400 animate-pulse" />
          <circle cx="4" cy="11.25" r="1.2" className="fill-cyan-400" />
          <circle cx="4" cy="19.25" r="1.2" className="fill-emerald-400" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Animated Row-Level Security Icon
 * Matches Image 2: Client dashboard panels connecting via padlock to tiered database cylinder
 */
export function SecurityAnimatedIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className} group`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-cyan-500/15 dark:bg-cyan-400/20 rounded-2xl blur-lg transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

      <svg
        viewBox="0 0 100 68"
        className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="lockGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0284c7" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Dashed Connecting Stream Rays with moving dash animation */}
        <g className="animate-sec-rays stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" strokeDasharray="3 3">
          {/* Card 1 to Lock */}
          <line x1="28" y1="14" x2="44" y2="34" />
          {/* Card 2 to Lock */}
          <line x1="28" y1="34" x2="44" y2="34" />
          {/* Card 3 to Lock */}
          <line x1="28" y1="54" x2="44" y2="34" />

          {/* Lock to Database */}
          <line x1="56" y1="34" x2="72" y2="34" />
        </g>

        {/* 3 Left Client Cards with Avatars */}
        {/* Top Card (Orange Avatar) */}
        <g transform="translate(4, 6)">
          <rect x="0" y="0" width="24" height="15" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
          <path d="M0 3 Q0 0 3 0 L21 0 Q24 0 24 3 L24 4 L0 4 Z" className="fill-slate-600 dark:fill-slate-400" />
          {/* Chart lines */}
          <line x1="4" y1="7" x2="14" y2="7" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="10" x2="11" y2="10" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="13" x2="16" y2="13" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          {/* Avatar circle */}
          <circle cx="20" cy="11" r="4.5" fill="#f97316" />
          <circle cx="20" cy="10" r="1.5" fill="white" />
          <path d="M17.5 13.5 C17.5 12 18.5 11.5 20 11.5 C21.5 11.5 22.5 12 22.5 13.5" fill="white" />
        </g>

        {/* Middle Card (Gray Avatar) */}
        <g transform="translate(4, 26)">
          <rect x="0" y="0" width="24" height="15" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
          <path d="M0 3 Q0 0 3 0 L21 0 Q24 0 24 3 L24 4 L0 4 Z" className="fill-slate-600 dark:fill-slate-400" />
          <line x1="4" y1="7" x2="14" y2="7" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="10" x2="11" y2="10" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="13" x2="16" y2="13" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="11" r="4.5" fill="#94a3b8" />
          <circle cx="20" cy="10" r="1.5" fill="white" />
          <path d="M17.5 13.5 C17.5 12 18.5 11.5 20 11.5 C21.5 11.5 22.5 12 22.5 13.5" fill="white" />
        </g>

        {/* Bottom Card (Peach Avatar) */}
        <g transform="translate(4, 46)">
          <rect x="0" y="0" width="24" height="15" rx="2" className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
          <path d="M0 3 Q0 0 3 0 L21 0 Q24 0 24 3 L24 4 L0 4 Z" className="fill-slate-600 dark:fill-slate-400" />
          <line x1="4" y1="7" x2="14" y2="7" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="10" x2="11" y2="10" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="13" x2="16" y2="13" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="11" r="4.5" fill="#fca5a5" />
          <circle cx="20" cy="10" r="1.5" fill="white" />
          <path d="M17.5 13.5 C17.5 12 18.5 11.5 20 11.5 C21.5 11.5 22.5 12 22.5 13.5" fill="white" />
        </g>

        {/* Center Padlock with subtle pulse */}
        <g transform="translate(42, 22)" className="animate-sec-lock">
          {/* Shackle */}
          <path
            d="M5 10 V5 A4 4 0 0 1 13 5 V10"
            className="stroke-slate-800 dark:stroke-slate-200"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Body */}
          <rect x="0" y="9" width="18" height="17" rx="3.5" className="fill-slate-800 dark:fill-slate-200" filter="url(#lockGlow)" />
          {/* Keyhole */}
          <circle cx="9" cy="15" r="2.2" className="fill-white dark:fill-slate-900" />
          <polygon points="7.8,15 10.2,15 9.8,20.5 8.2,20.5" className="fill-white dark:fill-slate-900" />
        </g>

        {/* Right Database Cylinder with 3 Tiers */}
        <g transform="translate(72, 16)">
          {/* Base bottom tier */}
          <ellipse cx="12" cy="34" rx="12" ry="4" fill="#ffedd5" />
          <path d="M0 24 C0 26.5 5.5 28.5 12 28.5 C18.5 28.5 24 26.5 24 24 V34 C24 36.5 18.5 38.5 12 38.5 C5.5 38.5 0 36.5 0 34 Z" fill="#fed7aa" />

          {/* Middle tier */}
          <ellipse cx="12" cy="24" rx="12" ry="4" fill="#e2e8f0" />
          <path d="M0 14 C0 16.5 5.5 18.5 12 18.5 C18.5 18.5 24 16.5 24 14 V24 C24 26.5 18.5 28.5 12 28.5 C5.5 28.5 0 26.5 0 24 Z" fill="#cbd5e1" />

          {/* Top tier (Vibrant Orange) */}
          <path d="M0 4 C0 6.5 5.5 8.5 12 8.5 C18.5 8.5 24 6.5 24 4 V14 C24 16.5 18.5 18.5 12 18.5 C5.5 18.5 0 16.5 0 14 Z" fill="#ea580c" />
          <ellipse cx="12" cy="4" rx="12" ry="4.5" fill="#f97316" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Animated Auto-Thumbnails & Previews Icon
 * Matches Image 3: Gradient squircle thumbnail with mountains, sun, and floating spinning star badge
 */
export function PreviewsAnimatedIcon({ className = "w-14 h-14" }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className} group`}>
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-teal-500/20 dark:bg-teal-400/25 rounded-2xl blur-lg transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

      <svg
        viewBox="0 0 80 80"
        className="w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Squircle Teal/Cyan Gradient */}
          <linearGradient id="prevBgGrad" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0d9488" />
            <stop offset="0.5" stopColor="#06b6d4" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>

          {/* Star Gradient */}
          <linearGradient id="starGrad" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0891b2" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>

          {/* Badge Shadow */}
          <filter id="badgeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Squircle Container with Gradient */}
        <rect x="6" y="6" width="68" height="68" rx="20" fill="url(#prevBgGrad)" />

        {/* Inner White Photo Card Frame */}
        <g transform="translate(16, 16)">
          <rect x="0" y="0" width="48" height="48" rx="14" fill="white" />

          {/* Circular Cyan Sun */}
          <circle cx="12" cy="13" r="5" fill="#06b6d4" className="animate-pulse" />

          {/* Mountains */}
          {/* Back Mountain (Light Cyan / Blue) */}
          <path d="M8 38 L22 20 L36 38 Z" fill="#7dd3fc" />
          {/* Front Mountain (Deep Cyan) */}
          <path d="M18 38 L31 24 L44 38 Z" fill="#06b6d4" />
        </g>

        {/* Floating Circular Star Badge with Smooth Twinkle/Rotation */}
        <g transform="translate(56, 56)">
          {/* Badge Circle Background */}
          <circle cx="0" cy="0" r="14" fill="white" filter="url(#badgeShadow)" />

          {/* Spinning / Twinkling 4-Point Star */}
          <g className="animate-spin-star">
            <path
              d="M0 -9 C0 -1 -1 0 -9 0 C-1 0 0 1 0 9 C0 1 1 0 9 0 C1 0 0 -1 0 -9 Z"
              fill="url(#starGrad)"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
