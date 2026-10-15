import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, HardDrive, Shield, Mail, Check, AlertCircle, Save, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await api.updateProfile({ display_name: displayName.trim() });
      setSuccess(true);
      refreshUser();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign In Required</h2>
          <p className="text-xs text-slate-500">Please sign in to view and manage your profile settings.</p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md">Sign In</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-indigo-500 font-bold text-xs text-slate-700 dark:text-slate-200">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account & Profile</h2>
        <p className="text-xs text-slate-400 mt-1">Manage personal credentials and review quota allocation.</p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-5">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`}
          alt={user.displayName}
          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-brand-500/20"
        />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.displayName}</h3>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-brand-500" /> {user.email}
          </p>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-500/10 text-brand-500">
            {user.role} tier
          </span>
        </div>
      </div>

      {/* Subscription Plan Card */}
      <div className="p-6 rounded-3xl glass-card border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Subscription Plan
            </h4>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{user.planName || 'Standard Tier'}</span>
            {user.planPrice && user.planPrice !== '$0' && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {user.planPrice}
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Storage Quota: <strong className="text-slate-800 dark:text-slate-200">{user.storageQuotaFormatted}</strong>
            {user.planExpiresAt && (
              <> • Renews / Expires: <strong className="text-slate-800 dark:text-slate-200">{new Date(user.planExpiresAt).toLocaleDateString()}</strong></>
            )}
          </p>
        </div>

        <Link
          to="/pricing"
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <span>Upgrade / Change Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Storage Quota Usage Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-brand-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Storage Quota Consumption</h4>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {user.storageUsedFormatted} used of {user.storageQuotaFormatted}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(user.usagePercentage || 0, 100)}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400">
          Your account has {100 - (user.usagePercentage || 0)}% available free space remaining. Upgrading grants up to 500 GB, 1 TB, or 2 TB capacity.
        </p>
      </div>

      {/* Edit Display Name Form */}
      <form onSubmit={handleUpdate} className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Profile Details</h4>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          />
        </div>

        {success && (
          <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </p>
        )}

        {error && (
          <p className="text-xs text-red-500 font-semibold flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
}
