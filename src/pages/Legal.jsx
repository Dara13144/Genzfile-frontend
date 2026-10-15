import React from 'react';

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-700 dark:text-slate-300">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Terms of Service</h1>
      <p className="text-xs text-slate-400">Effective Date: October 2026</p>
      
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h3>
        <p>By accessing and using GenZ File, you agree to be bound by these terms. If you do not agree with any part, you may not use the service.</p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Permitted Use & Upload Guidelines</h3>
        <p>You may upload media files for storage and sharing. You must not upload malware, illicit or infringing content, copyrighted files without authorization, or material that violates local or international laws.</p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">3. DMCA & Copyright Policy</h3>
        <p>GenZ File respects intellectual property. DMCA reports submitted via our abuse reporting tools are actively reviewed and offending files will be taken down immediately.</p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Storage Quotas & Service Limits</h3>
        <p>User accounts are subject to configured storage quotas and rate limits to ensure reliable availability for all users.</p>
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-6 text-slate-700 dark:text-slate-300">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last Updated: October 2026</p>
      
      <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Data Collected</h3>
        <p>We collect essential account information (email address, display name) and technical logs required for secure file delivery and rate limiting.</p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Private File Protection</h3>
        <p>Files uploaded to private folders are strictly restricted to your account using PostgreSQL Row Level Security (RLS). We never sell your personal information or file metadata to third parties.</p>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Cookies & Local Storage</h3>
        <p>Local storage is utilized only for preserving user preferences such as your active theme (Dark/Light) and language preference.</p>
      </div>
    </div>
  );
}
