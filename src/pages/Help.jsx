import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Shield, FileCheck, Zap, Lock } from 'lucide-react';

export default function Help() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What file types are supported on GenZ File?',
      a: 'We support all major image formats (PNG, JPG, JPEG, GIF, WebP, SVG with sandboxed execution), video formats (MP4, WebM, MOV), documents (PDF, DOCX, XLSX, TXT, CSV), and archives (ZIP, RAR, 7Z, TAR).',
    },
    {
      q: 'How does link expiration and password protection work?',
      a: 'When generating a shareable link, you can optionally configure an auto-expiration duration (e.g. 1 hour, 24 hours, 7 days, 30 days), an optional maximum download limit, and a custom password encrypted using bcrypt. Anyone attempting to access a password-protected link must unlock it before viewing or downloading.',
    },
    {
      q: 'How are videos and large files streamed without buffering?',
      a: 'Our backend supports HTTP 206 Partial Content Range streaming. When playing a video or audio file, your browser requests byte ranges on demand, allowing instant seek and scrubbing without loading the entire multi-gigabyte file into memory.',
    },
    {
      q: 'How is file privacy and ownership enforced?',
      a: 'Files are completely private by default. In our Supabase PostgreSQL database, strict Row Level Security (RLS) policies ensure that only the owner can view, rename, move, or delete files. Public access is granted exclusively through verified share tokens.',
    },
    {
      q: 'Can I restore files if I accidentally delete them?',
      a: 'Yes! Deleted files are first moved to the Trash Bin with a soft-delete timestamp. You can review and restore your files at any time, or choose to permanently purge them from object storage.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-slate-400">
          Everything you need to know about uploading, hosting, and securing files on GenZ File.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${openIdx === idx ? 'rotate-180 text-brand-500' : ''}`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
