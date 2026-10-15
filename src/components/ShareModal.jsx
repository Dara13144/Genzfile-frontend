import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Copy,
  Check,
  QrCode,
  Share2,
  Lock,
  Clock,
  Download,
  Eye,
  ExternalLink,
  Shield,
  Send,
  Facebook,
  Twitter,
} from 'lucide-react';
import { api } from '../services/api.js';

export default function ShareModal({ file, onClose, onUpdated }) {
  const [copiedField, setCopiedField] = useState(null);
  const [activeTab, setActiveTab] = useState('links'); // 'links', 'qrcode', 'settings'
  const [password, setPassword] = useState('');
  const [expiryHours, setExpiryHours] = useState('0');
  const [maxDownloads, setMaxDownloads] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!file) return null;

  const origin = window.location.origin;
  const token = file.publicToken || file.activeShareToken || file.shareToken || 'demo-token';

  const shareUrl = `${origin}/f/${token}`;
  const viewUrl = `${origin}/view/${token}`;
  const downloadUrl = `${origin}/download/${token}`;
  const directUrl = file.directUrl ? `${origin}${file.directUrl}` : `${origin}/api/files/stream/${encodeURIComponent(file.storage_key || file.id)}`;

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.createShareLink(file.id, {
        password: password.trim() ? password.trim() : null,
        expires_in_hours: parseInt(expiryHours, 10) > 0 ? parseInt(expiryHours, 10) : null,
        max_downloads: parseInt(maxDownloads, 10) > 0 ? parseInt(maxDownloads, 10) : null,
      });
      setSaveSuccess(true);
      if (onUpdated) onUpdated();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert('Failed to update share link settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Social share urls
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(`Check out ${file.original_filename} on GenZ File!`);

  const telegramUrl = `https://t.me/share/url?url=${encodedShareUrl}&text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${shareText}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}%20${encodedShareUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl glass-card shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Share File</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[260px]">
                {file.original_filename}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-700/80 px-6 pt-2">
          <button
            onClick={() => setActiveTab('links')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'links'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Share Links
          </button>
          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'qrcode'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Security & Expiry
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Primary Share Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Public Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 select-all font-mono"
                  />
                  <button
                    onClick={() => handleCopy(shareUrl, 'share')}
                    className="flex items-center gap-1 px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-sm"
                  >
                    {copiedField === 'share' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedField === 'share' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Preview Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Online Media Preview URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={viewUrl}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 select-all font-mono"
                  />
                  <button
                    onClick={() => handleCopy(viewUrl, 'view')}
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedField === 'view' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Direct Download URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Direct Download URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={downloadUrl}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 select-all font-mono"
                  />
                  <button
                    onClick={() => handleCopy(downloadUrl, 'download')}
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {copiedField === 'download' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="pt-2">
                <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                  Quick Share to Socials
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 font-semibold text-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> Telegram
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-semibold text-xs transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 font-semibold text-xs transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" /> Facebook
                  </a>
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" /> X / Twitter
                  </a>
                  <a
                    href="https://discord.gg/bEmU6VzSu"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] font-semibold text-xs transition-colors"
                    title="Copy share link & open Discord community"
                  >
                    <img src="/discord-icon.png" alt="Discord" className="w-3.5 h-3.5 rounded-full object-contain" /> Discord
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qrcode' && (
            <div className="flex flex-col items-center justify-center py-2 text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Scan with camera to view on mobile
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Universal link for iOS, Android, and tablets
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Lock className="w-3.5 h-3.5 text-brand-500" />
                  Password Protection (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank for no password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Clock className="w-3.5 h-3.5 text-brand-500" />
                  Auto-Expiration
                </label>
                <select
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  <option value="0">Never expires (Permanent)</option>
                  <option value="1">Expires in 1 Hour</option>
                  <option value="24">Expires in 24 Hours</option>
                  <option value="168">Expires in 7 Days</option>
                  <option value="720">Expires in 30 Days</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Download className="w-3.5 h-3.5 text-brand-500" />
                  Maximum Download Limit (Optional)
                </label>
                <input
                  type="number"
                  placeholder="Unlimited downloads"
                  min="1"
                  value={maxDownloads}
                  onChange={(e) => setMaxDownloads(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                />
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                  <Check className="w-4 h-4" /> Link settings updated successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Apply Security Rules'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
