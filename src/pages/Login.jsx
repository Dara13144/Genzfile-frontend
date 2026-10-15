import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Sparkles, ShieldCheck, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

// Animated Isometric 3D Security & Authentication Illustration matching the user's mockup
function IsometricIllustration() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">
      {/* Dynamic Keyframes for Isometric 3D Animations */}
      <style>{`
        @keyframes isoFloatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-9px);
          }
        }
        @keyframes isoFloatDocument {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-13px) rotate(-1deg);
          }
        }
        @keyframes isoFloatCoral {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1.5deg);
          }
        }
        @keyframes isoPadlockPulse {
          0%, 100% {
            transform: translateY(0px);
            filter: drop-shadow(0 10px 18px rgba(6, 182, 212, 0.45));
          }
          50% {
            transform: translateY(-7px);
            filter: drop-shadow(0 18px 28px rgba(34, 211, 238, 0.75));
          }
        }
        @keyframes isoCheckmarkBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1) translateY(-2px);
          }
        }
        @keyframes isoDiamondPulse {
          0%, 100% {
            opacity: 0.35;
            transform: translateY(0px) scale(0.95);
          }
          50% {
            opacity: 0.95;
            transform: translateY(-6px) scale(1.08);
          }
        }
        @keyframes genzLogoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(239, 68, 68, 0.45));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 24px rgba(239, 68, 68, 0.85)) drop-shadow(0 0 40px rgba(220, 38, 38, 0.4));
            transform: scale(1.03);
          }
        }
      `}</style>

      <svg
        viewBox="0 0 520 440"
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft isometric drop shadows */}
          <filter id="isoShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#1e1b4b" floodOpacity="0.18" />
          </filter>
          <linearGradient id="planeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8faff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#eef2ff" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4338ca" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="padlockGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="coralGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
          <linearGradient id="tealBadgeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        {/* Isometric Floor Grid & Shadow Base matching the image */}
        <g opacity="0.9">
          <path
            d="M260 70 L480 190 L260 310 L40 190 Z"
            fill="url(#planeGrad)"
            stroke="#c7d2fe"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          {/* Floor grid isometric lines */}
          <path d="M150 130 L370 250" stroke="#e0e7ff" strokeWidth="1.5" />
          <path d="M370 130 L150 250" stroke="#e0e7ff" strokeWidth="1.5" />
          <path d="M95 160 L315 280" stroke="#e0e7ff" strokeWidth="1" />
          <path d="M425 160 L205 280" stroke="#e0e7ff" strokeWidth="1" />
        </g>

        {/* Floating Animated Isometric Diamonds / Accents */}
        <path
          d="M90 170 L110 180 L90 190 L70 180 Z"
          fill="#818cf8"
          style={{ animation: 'isoDiamondPulse 2.8s ease-in-out infinite' }}
        />
        <path
          d="M210 330 L230 340 L210 350 L190 340 Z"
          fill="#a5b4fc"
          style={{ animation: 'isoDiamondPulse 3.4s ease-in-out infinite 0.6s' }}
        />
        <path
          d="M380 160 L400 170 L380 180 L360 170 Z"
          fill="#c4b5fd"
          style={{ animation: 'isoDiamondPulse 2.5s ease-in-out infinite 1.2s' }}
        />
        <path
          d="M440 280 L460 290 L440 300 L420 290 Z"
          fill="#818cf8"
          style={{ animation: 'isoDiamondPulse 3.8s ease-in-out infinite 0.3s' }}
        />

        {/* Main Floating Profile Card (Animated Up & Down) */}
        <g
          filter="url(#isoShadow)"
          style={{ animation: 'isoFloatSlow 4s ease-in-out infinite', transformOrigin: 'center' }}
        >
          {/* Card Base */}
          <polygon
            points="150,150 305,75 305,210 150,285"
            fill="url(#cardGrad)"
            rx="12"
          />
          {/* Card header light line */}
          <polygon points="150,150 305,75 305,95 150,170" fill="#818cf8" opacity="0.45" />

          {/* User Avatar Circle on Card */}
          <ellipse cx="195" cy="205" rx="18" ry="24" fill="#818cf8" opacity="0.6" />
          <circle cx="195" cy="195" r="9" fill="#ffffff" opacity="0.95" />
          <path d="M184 216 Q195 208 206 216" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Profile Card Stylized Content Lines */}
          <line x1="225" y1="140" x2="280" y2="112" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.95" />
          <line x1="225" y1="158" x2="265" y2="138" stroke="#c7d2fe" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
          <line x1="225" y1="172" x2="250" y2="160" stroke="#c7d2fe" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
          <line x1="225" y1="186" x2="242" y2="178" stroke="#c7d2fe" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        </g>

        {/* Teal Verified Checkmark Badge with Pulse Animation */}
        <g
          filter="url(#isoShadow)"
          style={{ animation: 'isoCheckmarkBounce 3s ease-in-out infinite', transformOrigin: '156px 176px' }}
        >
          <ellipse cx="156" cy="176" rx="20" ry="22" fill="url(#tealBadgeGrad)" />
          <circle cx="156" cy="176" r="16" fill="#14b8a6" />
          <path
            d="M149 176 L154 181 L164 170"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Floating White Paper Document with Orange/Blue Details (Animated) */}
        <g
          filter="url(#isoShadow)"
          style={{ animation: 'isoFloatDocument 3.4s ease-in-out infinite 0.3s', transformOrigin: 'center' }}
        >
          {/* White Sheet */}
          <polygon points="170,230 220,205 220,305 170,330" fill="#ffffff" />
          {/* Folded Sheet Top Tab */}
          <polygon points="170,230 190,220 190,240 170,230" fill="#e2e8f0" />
          {/* Accent Orange Header bar */}
          <line x1="178" y1="245" x2="208" y2="230" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" />
          {/* Text lines */}
          <line x1="178" y1="262" x2="212" y2="245" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="178" y1="274" x2="204" y2="261" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="178" y1="286" x2="198" y2="276" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          <line x1="178" y1="298" x2="190" y2="292" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Floating Coral ID Card (Animated) */}
        <g
          filter="url(#isoShadow)"
          style={{ animation: 'isoFloatCoral 4.2s ease-in-out infinite 0.7s', transformOrigin: 'center' }}
        >
          <polygon points="245,245 285,225 285,280 245,300" fill="url(#coralGrad)" rx="6" />
          {/* Avatar badge on coral card */}
          <ellipse cx="265" cy="256" rx="8" ry="9" fill="#ffffff" opacity="0.95" />
          <line x1="255" y1="272" x2="275" y2="262" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="257" y1="282" x2="271" y2="275" stroke="#ffe4e6" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* Standing 3D Isometric Cyan Padlock with Glowing Pulse Animation */}
        <g
          style={{ animation: 'isoPadlockPulse 2.8s ease-in-out infinite', transformOrigin: 'center' }}
        >
          {/* Metallic Shackle */}
          <path
            d="M320 205 C320 180 345 180 345 205"
            stroke="#94a3b8"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M322 205 C322 184 343 184 343 205"
            stroke="#f8fafc"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Padlock 3D Front Face */}
          <polygon points="310,210 335,210 335,270 310,270" fill="url(#padlockGrad)" />
          {/* Padlock 3D Side Face */}
          <polygon points="335,210 355,198 355,258 335,270" fill="#0891b2" />
          {/* Padlock Top Face */}
          <polygon points="310,210 330,198 355,198 335,210" fill="#67e8f9" />

          {/* Keyhole */}
          <circle cx="323" cy="235" r="3.5" fill="#042f2e" />
          <polygon points="321.5,235 324.5,235 324,245 322,245" fill="#042f2e" />
        </g>
      </svg>
    </div>
  );
}

export default function Login({ defaultIsRegister = false }) {
  const {
    loginWithCredentials,
    registerWithCredentials,
    loginWithSocial,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine initial mode (from props or location path)
  const isInitialRegister = defaultIsRegister || location.pathname === '/register';
  const [isRegister, setIsRegister] = useState(isInitialRegister);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberAccount, setRememberAccount] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          throw new Error('Please enter your full name');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        await registerWithCredentials(name, email, password, rememberAccount);
        setSuccessMsg('Account created and saved successfully! Redirecting...');
        setTimeout(() => navigate('/files'), 600);
      } else {
        await loginWithCredentials(email, password, rememberAccount);
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => navigate('/files'), 600);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setLoading(true);
    try {
      await loginWithSocial(provider, null, null, rememberAccount);
      navigate('/files');
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950/30 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Decorative Ambient Shapes & Dots */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Decorative Dot Matrix in corners */}
      <div
        className="absolute top-6 right-6 w-32 h-32 opacity-25 pointer-events-none hidden sm:block"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div
        className="absolute bottom-6 left-6 w-32 h-32 opacity-20 pointer-events-none hidden sm:block"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Main Split Container matching the exact screenshot design */}
      <div className="relative z-10 max-w-[1020px] w-full bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[580px] border border-white/60 dark:border-slate-700/60 transition-colors">
        
        {/* LEFT COLUMN: Official GENZ FILE Crest Logo + Animated Isometric 3D Illustration */}
        <div className="relative bg-gradient-to-b from-[#f8faff] to-[#eef2ff] dark:from-slate-900 dark:to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
          
          {/* GENZ FILE Official Logo & Brand Header */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src="/genz-logo.png"
                alt="GenZ File"
                className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_16px_rgba(239,68,68,0.5)]"
                style={{ animation: 'genzLogoGlow 3s ease-in-out infinite' }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-red-600 via-rose-500 to-red-400 dark:from-red-500 dark:via-rose-400 dark:to-white bg-clip-text text-transparent">
                  GENZ <span className="text-red-500">FILE</span>
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
                Next-Gen Cloud Storage
              </span>
            </div>
          </div>

          {/* Animated Isometric Visual */}
          <div className="my-auto py-6">
            <IsometricIllustration />
          </div>

          {/* Subtle bottom security note */}
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center lg:text-left flex items-center justify-center lg:justify-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>GenZ 256-bit Encrypted Cloud Media Vault</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Register / Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
          {/* Top Switcher Button Row */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={handleToggleMode}
              className="rounded-full border border-slate-300 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-400 px-4 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-sm"
            >
              {isRegister ? 'SIGN IN' : 'REGISTER'}
            </button>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-sm mx-auto my-auto py-2">
            {/* Header Titles */}
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isRegister ? 'Welcome to GenZ File!' : 'Welcome Back to GenZ!'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium mt-1">
                {isRegister ? 'Register your GenZ cloud storage account' : 'Sign in to access your GenZ media vault'}
              </p>
            </div>

            {/* Error / Success Feedback Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field (Register only) */}
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="GenzFile"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-indigo-500 ring-2 ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Email Field with genzfile@gmail.com placeholder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="genzfile@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Password Field with Eye Toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="8+ characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Save Account / Remember Me Checkbox */}
              <div className="flex items-center justify-between py-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberAccount}
                    onChange={(e) => setRememberAccount(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-700 cursor-pointer accent-red-600"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#5b5ff5] to-[#7c3aed] hover:from-[#4f46e5] hover:to-[#6d28d9] text-white font-bold text-xs shadow-[0_8px_25px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_30px_rgba(99,102,241,0.5)] transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{isRegister ? 'Create GenZ Account' : 'Login to GenZ'}</span>
                )}
              </button>
            </form>
          </div>

          {/* Social Auth Footer with Facebook, LinkedIn, Google */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-3">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {isRegister ? 'Create account with' : 'Sign in with'}
            </span>
            <div className="flex items-center gap-2">
              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('facebook')}
                disabled={loading}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center text-blue-600 transition-colors shadow-sm"
                title="Sign in with Facebook"
              >
                <span className="font-bold text-sm leading-none">f</span>
              </button>

              {/* LinkedIn Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('linkedin')}
                disabled={loading}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:border-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center justify-center text-sky-600 transition-colors shadow-sm"
                title="Sign in with LinkedIn"
              >
                <span className="font-bold text-xs leading-none">in</span>
              </button>

              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('google')}
                disabled={loading}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shadow-sm"
                title="Sign in with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
