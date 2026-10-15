import React from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full glass-panel border-t border-white/10 dark:border-white/5 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img
              src="/genz-logo.png"
              alt="GenZ File"
              className="h-9 w-auto object-contain drop-shadow"
            />
            <span className="font-black text-xl text-white">
              GenZ <span className="text-red-500">File</span>
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Enterprise cloud hosting for images, videos, audio, and documents. Lightning-fast global delivery with zero quality degradation.
          </p>

        </div>

        {/* Quick Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/" className="hover:text-white transition-colors">Upload Center</Link></li>
            <li><Link to="/files" className="hover:text-white transition-colors">{t('myFiles')}</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">{t('helpFaq')}</Link></li>
            <li>
              <a
                href="https://discord.gg/bEmU6VzSu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#5865F2] hover:text-[#7983f5] font-bold transition-colors"
              >
                <img src="/discord-icon.png" alt="Discord" className="w-4 h-4 object-contain rounded-full shadow-sm" />
                <span>Discord Server</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Trust */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Trust & Safety</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/terms" className="hover:text-white transition-colors">{t('termsOfService')}</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">DMCA Notice</span></li>
            <li><span className="cursor-pointer hover:text-white transition-colors">Abuse Reporting</span></li>
          </ul>
        </div>

        {/* Infrastructure & Status */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">System Architecture</h4>
          <p className="text-xs text-slate-400 mb-2">Powered by Supabase PostgreSQL, Object Storage, and Express Engine.</p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} GenZ File. Built for creators, developers, and modern teams.</p>
      </div>
    </footer>
  );
}
