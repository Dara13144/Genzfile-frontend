import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  Users,
  Files,
  HardDrive,
  AlertTriangle,
  Settings,
  Search,
  Check,
  X,
  Trash2,
  Lock,
  Activity,
  CheckCircle2,
  Wrench,
  Clock,
  CreditCard,
  DollarSign,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  UserX,
  Sparkles,
  Eye,
  Download,
  LogIn,
  ArrowRight,
  Server,
  Database,
  Filter,
  Sliders,
  CheckCircle,
  UserPlus,
  Calendar,
  Award,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AdminDashboard() {
  const { isAdmin, user, loginWithCredentials } = useAuth();
  const { lang } = useLanguage();
  const isKm = lang === 'km';

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'payments' | 'users' | 'moderation' | 'reports' | 'settings' | 'audit'

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [quickAdminLoggingIn, setQuickAdminLoggingIn] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [fileSearch, setFileSearch] = useState('');
  const [fileCategoryFilter, setFileCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'paid' | 'pending'

  // Settings form
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxFileSizeMb, setMaxFileSizeMb] = useState(500);
  const [defaultQuotaMb, setDefaultQuotaMb] = useState(51200);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Edit Quota Modal
  const [editingUserQuota, setEditingUserQuota] = useState(null);
  const [newQuotaGb, setNewQuotaGb] = useState(50);

  // Assign Plan Modal
  const [assigningPlanUser, setAssigningPlanUser] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('1month');
  const [selectedDurationDays, setSelectedDurationDays] = useState(30);
  const [customPlanQuotaGb, setCustomPlanQuotaGb] = useState(2500);
  const [assignPlanLoading, setAssignPlanLoading] = useState(false);

  // Create User with Plan Modal
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('GenZ@123456');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserPlanId, setNewUserPlanId] = useState('1month');
  const [newUserDurationDays, setNewUserDurationDays] = useState(30);
  const [createUserLoading, setCreateUserLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, filesRes, reportsRes, settingsRes, auditRes, paymentsRes] = await Promise.all([
        api.getAdminStats().catch(() => ({ success: false })),
        api.getAdminUsers().catch(() => ({ success: false })),
        api.getAdminFiles().catch(() => ({ success: false })),
        api.getAdminReports().catch(() => ({ success: false })),
        api.getAdminSettings().catch(() => ({ success: false })),
        api.getAdminAuditLogs().catch(() => ({ success: false })),
        api.getAdminPayments().catch(() => ({ success: false })),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsersList(usersRes.users || []);
      if (filesRes.success) setFilesList(filesRes.files || []);
      if (reportsRes.success) setReportsList(reportsRes.reports || []);
      if (auditRes.success) setAuditLogs(auditRes.logs || []);
      if (paymentsRes.success) setPaymentsList(paymentsRes.payments || []);
      if (settingsRes.success && settingsRes.settings) {
        setSystemSettings(settingsRes.settings);
        setMaintenanceMode(settingsRes.settings.maintenance_mode || false);
        setMaxFileSizeMb(settingsRes.settings.max_file_size_mb || 500);
        setDefaultQuotaMb(settingsRes.settings.default_user_quota_mb || 51200);
      }
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    loadAllAdminData();
  };

  const handleQuickAdminLogin = async () => {
    try {
      setQuickAdminLoggingIn(true);
      await loginWithCredentials('genzfile@gmail.com', 'genzfile123', true);
      showToast(isKm ? 'បានចូលគណនី Admin ដោយជោគជ័យ' : 'Signed in as Admin successfully');
    } catch (err) {
      alert(err.message || 'Login failed');
    } finally {
      setQuickAdminLoggingIn(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.updateAdminUser(userId, { role: newRole });
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      showToast(isKm ? `បានប្ដូរតួនាទីទៅ ${newRole}` : `Updated role to ${newRole}`);
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  const handleOpenQuotaModal = (u) => {
    setEditingUserQuota(u);
    const gb = Math.round((Number(u.storage_quota_bytes || 0) / (1024 * 1024 * 1024))) || 50;
    setNewQuotaGb(gb);
  };

  const handleSaveUserQuota = async () => {
    if (!editingUserQuota) return;
    try {
      const bytes = Number(newQuotaGb) * 1024 * 1024 * 1024;
      await api.updateAdminUser(editingUserQuota.id, { storage_quota_bytes: bytes });
      setUsersList((prev) =>
        prev.map((u) => (u.id === editingUserQuota.id ? { ...u, storage_quota_bytes: bytes } : u))
      );
      showToast(isKm ? `បានកំណត់ទំហំផ្ទុក ${newQuotaGb} GB` : `Quota updated to ${newQuotaGb} GB`);
      setEditingUserQuota(null);
    } catch (err) {
      alert('Failed to update storage quota: ' + err.message);
    }
  };

  // Open Assign Plan Modal for a User
  const handleOpenAssignPlanModal = (u) => {
    setAssigningPlanUser(u);
    setSelectedPlanId(u.plan_id || '1month');
    setSelectedDurationDays(30);
  };

  // Save Plan Assignment
  const handleSavePlanAssignment = async () => {
    if (!assigningPlanUser) return;
    try {
      setAssignPlanLoading(true);
      const res = await api.adminAssignPlan(assigningPlanUser.id, {
        planId: selectedPlanId,
        durationDays: selectedDurationDays,
        customQuotaGb: customPlanQuotaGb,
      });

      if (res.success && res.user) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === assigningPlanUser.id ? { ...u, ...res.user } : u))
        );
        showToast(res.message || (isKm ? 'បានកំណត់កញ្ចប់ Plan ជូនអ្នកប្រើប្រាស់ជោគជ័យ!' : 'Plan successfully assigned to user!'));
        setAssigningPlanUser(null);
      }
    } catch (err) {
      alert('Failed to assign plan: ' + err.message);
    } finally {
      setAssignPlanLoading(false);
    }
  };

  // Create User With Plan
  const handleCreateUserWithPlan = async (e) => {
    e.preventDefault();
    if (!newUserEmail) {
      alert('Please enter an email address.');
      return;
    }
    try {
      setCreateUserLoading(true);
      const res = await api.adminCreateUser({
        email: newUserEmail,
        displayName: newUserName,
        password: newUserPassword,
        role: newUserRole,
        planId: newUserPlanId,
        durationDays: newUserDurationDays,
      });

      if (res.success && res.user) {
        setUsersList((prev) => [res.user, ...prev]);
        showToast(res.message || (isKm ? 'បានបង្កើតគណនីថ្មីជាមួយ Plan ជោគជ័យ!' : 'User created with plan!'));
        setCreateUserModalOpen(false);
        setNewUserName('');
        setNewUserEmail('');
      }
    } catch (err) {
      alert('Failed to create user: ' + err.message);
    } finally {
      setCreateUserLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === user?.id) {
      alert(isKm ? 'មិនអាចលុបគណនី Admin ផ្ទាល់ខ្លួនរបស់អ្នកបានទេ' : 'Cannot delete your own active administrator account');
      return;
    }
    if (!confirm(isKm ? `តើអ្នកប្រាកដថាចង់លុបគណនី ${targetUser.email} ទេ?` : `Are you sure you want to delete user ${targetUser.email}?`)) {
      return;
    }
    try {
      await api.adminDeleteUser(targetUser.id);
      setUsersList((prev) => prev.filter((u) => u.id !== targetUser.id));
      showToast(isKm ? 'បានលុបគណនីអ្នកប្រើប្រាស់' : 'User account removed');
    } catch (err) {
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleFulfillPayment = async (paymentId) => {
    try {
      const res = await api.fulfillAdminPayment(paymentId);
      if (res.success) {
        setPaymentsList((prev) =>
          prev.map((p) =>
            p.paymentId === paymentId ? { ...p, status: 'paid', fulfilled: true, paidAt: new Date().toISOString() } : p
          )
        );
        showToast(res.message || (isKm ? 'ការជាវត្រូវបានបើកដំណើរការដោយជោគជ័យ!' : 'Order manually activated!'));
        // Refresh users list so quota is visibly updated
        api.getAdminUsers().then((uRes) => {
          if (uRes.success) setUsersList(uRes.users || []);
        });
      }
    } catch (err) {
      alert('Failed to fulfill payment: ' + err.message);
    }
  };

  const handleModerateDeleteFile = async (fileId) => {
    if (!confirm(isKm ? 'តើអ្នកប្រាកដថាចង់លុបឯកសារនេះជារៀងរហូតទេ?' : 'Are you sure you want to permanently remove this file for violation?')) return;
    try {
      await api.adminDeleteFile(fileId);
      setFilesList((prev) => prev.filter((f) => f.id !== fileId));
      showToast(isKm ? 'បានលុបឯកសារបំពាន' : 'File removed from system');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await api.updateAdminReport(reportId, {
        status: action === 'dismiss' ? 'dismissed' : 'actioned',
        admin_notes: `Processed by admin on ${new Date().toLocaleDateString()}`,
      });
      setReportsList((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'actioned' } : r))
      );
      showToast(isKm ? 'របាយការណ៍ត្រូវបានដំណើរការ' : 'Report updated');
    } catch (err) {
      alert('Report update failed: ' + err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateAdminSettings({
        maintenance_mode: maintenanceMode,
        max_file_size_mb: parseInt(maxFileSizeMb, 10),
        default_user_quota_mb: parseInt(defaultQuotaMb, 10),
      });
      setSettingsSuccess(true);
      showToast(isKm ? 'បានរក្សាទុកការកំណត់ប្រព័ន្ធ' : 'System configuration saved');
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    }
  };

  // Filtered lists
  const filteredUsers = useMemo(() => {
    if (!userSearch) return usersList;
    const q = userSearch.toLowerCase();
    return usersList.filter(
      (u) =>
        (u.display_name && u.display_name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q))
    );
  }, [usersList, userSearch]);

  const filteredFiles = useMemo(() => {
    return filesList.filter((f) => {
      const matchCategory =
        fileCategoryFilter === 'all' || f.file_category === fileCategoryFilter;
      const matchSearch =
        !fileSearch ||
        (f.original_filename && f.original_filename.toLowerCase().includes(fileSearch.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [filesList, fileSearch, fileCategoryFilter]);

  const filteredPayments = useMemo(() => {
    return paymentsList.filter((p) => {
      if (paymentFilter === 'all') return true;
      if (paymentFilter === 'paid') return p.status === 'paid';
      if (paymentFilter === 'pending') return p.status === 'pending';
      return true;
    });
  }, [paymentsList, paymentFilter]);

  const totalProcessedRevenue = useMemo(() => {
    return paymentsList
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
      .toFixed(2);
  }, [paymentsList]);

  const formatStorage = (bytes) => {
    if (!bytes || bytes === 0) return '0 MB';
    if (bytes >= 1024 * 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024 * 1024)).toFixed(2) + ' TB';
    }
    if (bytes >= 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Available Plan Options for Admin Assignment
  const planOptions = [
    {
      id: 'free',
      name: 'Standard Free Tier',
      quotaGb: 50,
      price: '$0',
      badge: 'Default',
      desc: '50 GB Standard Storage Quota',
      color: 'border-slate-500/30 text-slate-400',
    },
    {
      id: '1month',
      name: '1 Month Plan',
      quotaGb: 500,
      price: '$2.99',
      badge: '500 GB',
      desc: '500 GB High-Speed Secure Cloud Storage',
      color: 'border-brand-500/40 text-brand-500',
    },
    {
      id: '3months',
      name: '3 Month Plan',
      quotaGb: 1000,
      price: '$5.99',
      badge: '1 TB',
      desc: '1,000 GB Ultra Fast Storage',
      color: 'border-indigo-500/40 text-indigo-400',
    },
    {
      id: '1year',
      name: '1 Year Plan',
      quotaGb: 2000,
      price: '$9.99',
      badge: '2 TB',
      desc: '2,000 GB Maximum Storage for 1 Year',
      color: 'border-emerald-500/40 text-emerald-400',
    },
    {
      id: 'custom',
      name: 'Custom VIP Tier',
      quotaGb: customPlanQuotaGb,
      price: 'Admin Assigned',
      badge: 'VIP',
      desc: 'Specify custom storage size and lifetime guarantee',
      color: 'border-amber-500/40 text-amber-400',
    },
  ];

  // Unauthenticated / Non-Admin Lock Screen
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full p-8 text-center rounded-3xl glass-card border border-red-500/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 shadow-lg shadow-red-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              {isKm ? 'ទាមទារសិទ្ធិ Admin' : 'Admin Privileges Required'}
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-3">
              {isKm ? 'ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ GenZ File' : 'GenZ File Control Center'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {isKm
                ? 'គណនីបច្ចុប្បន្នរបស់អ្នកមិនមានសិទ្ធិចូលដំណើរការផ្ទាំងគ្រប់គ្រង Admin ទេ។ សូមចូលគណនី Admin ឬប្រើប៊ូតុងខាងក្រោមដើម្បីចូលភ្លាមៗ។'
                : 'Your current account does not have administrator privileges. Sign in as the official system administrator to access all management tools.'}
            </p>
          </div>

          {/* Quick 1-Click Admin Access */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isKm ? 'ចូលជា Admin ភ្លាមៗ (GenzFile)' : 'Instant Admin Test Access'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Account: <strong className="text-slate-700 dark:text-slate-300">genzfile@gmail.com</strong>
            </p>
            <button
              onClick={handleQuickAdminLogin}
              disabled={quickAdminLoggingIn}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {quickAdminLoggingIn
                  ? (isKm ? 'កំពុងចូល...' : 'Signing in...')
                  : (isKm ? 'ចូលគណនី Admin (GenzFile)' : 'Sign In as GenzFile Admin')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 text-red-500 text-[10px] font-black uppercase tracking-wider border border-red-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isKm ? 'ប្រព័ន្ធគ្រប់គ្រងបន្តផ្ទាល់' : 'Live Control Plane'}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Admin: <span className="text-slate-800 dark:text-slate-200">{user?.displayName || user?.email}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>GenZ File</span>
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {isKm ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'Master Dashboard'}
            </span>
          </h1>
        </div>

        {/* Global Controls & Tab Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCreateUserModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isKm ? '+ បន្ថែមអ្នកប្រើជាមួយ Plan' : '+ Add User with Plan'}</span>
          </button>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold glass-card border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isKm ? 'ផ្ទុកឡើងវិញ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: isKm ? 'ទិដ្ឋភាពទូទៅ' : 'Overview', icon: Activity },
          { id: 'payments', label: isKm ? 'ការទូទាត់ KHQR' : 'Payments & Subscriptions', icon: CreditCard, count: paymentsList.length },
          { id: 'users', label: isKm ? 'អ្នកប្រើប្រាស់ & Plans' : 'Users & Plans', icon: Users, count: usersList.length },
          { id: 'moderation', label: isKm ? 'គ្រប់គ្រងឯកសារ' : 'Files Moderation', icon: Files, count: filesList.length },
          { id: 'reports', label: isKm ? 'របាយការណ៍បំពាន' : 'Abuse Reports', icon: AlertTriangle, count: reportsList.filter(r => r.status === 'pending').length, alert: reportsList.filter(r => r.status === 'pending').length > 0 },
          { id: 'settings', label: isKm ? 'ការកំណត់ប្រព័ន្ធ' : 'System Settings', icon: Settings },
          { id: 'audit', label: isKm ? 'កំណត់ហេតុសកម្មភាព' : 'Audit Logs', icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    tab.alert
                      ? 'bg-amber-500 text-white'
                      : active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 hover:border-brand-500/40 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>{isKm ? 'អ្នកប្រើប្រាស់សរុប' : 'Total Users'}</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalUsers || usersList.length}</p>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-emerald-500 font-semibold">{usersList.filter(u => u.role === 'admin').length} Admins</span>
                <span className="text-slate-400">{usersList.filter(u => u.role !== 'admin').length} Standard</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>{isKm ? 'ឯកសារសរុប' : 'Active Files'}</span>
                <Files className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{stats?.totalFiles || filesList.length}</p>
              <p className="text-[11px] text-slate-400">
                {stats?.recentUploadsCount || 0} {isKm ? 'បានផ្ទុកឡើងក្នុងរយៈពេល 24 ម៉ោង' : 'uploaded in last 24h'}
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>{isKm ? 'ទំហំផ្ទុកប្រើប្រាស់' : 'Storage Used'}</span>
                <HardDrive className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {formatStorage(stats?.totalStorageBytes)}
              </p>
              <p className="text-[11px] text-slate-400">
                {isKm ? 'ម៉ាស៊ីនផ្ទុកល្បឿនលឿន' : 'Distributed storage cluster'}
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>{isKm ? 'ចំណូល Subscriptions' : 'KHQR Revenue'}</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-emerald-500">${totalProcessedRevenue}</p>
              <p className="text-[11px] text-slate-400">
                {paymentsList.filter(p => p.status === 'paid').length} {isKm ? 'ប្រតិបត្តិការជោគជ័យ' : 'paid transactions'}
              </p>
            </div>
          </div>

          {/* Category Distribution and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isKm ? 'ការបែងចែកប្រភេទឯកសារ' : 'File Categories Distribution'}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {filesList.length} {isKm ? 'ឯកសារសរុប' : 'total items'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
                  <span className="text-xs font-bold text-indigo-400 block">{isKm ? 'រូបភាព' : 'Images'}</span>
                  <span className="text-2xl font-black text-indigo-500">{stats?.categories?.image || 0}</span>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <span className="text-xs font-bold text-cyan-400 block">{isKm ? 'វីដេអូ' : 'Videos'}</span>
                  <span className="text-2xl font-black text-cyan-500">{stats?.categories?.video || 0}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <span className="text-xs font-bold text-emerald-400 block">{isKm ? 'ឯកសារ' : 'Docs'}</span>
                  <span className="text-2xl font-black text-emerald-500">{stats?.categories?.document || 0}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <span className="text-xs font-bold text-amber-400 block">{isKm ? 'កម្រង Zip' : 'Archives'}</span>
                  <span className="text-2xl font-black text-amber-500">{stats?.categories?.archive || 0}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-500/10 border border-slate-500/20 text-center">
                  <span className="text-xs font-bold text-slate-400 block">{isKm ? 'ផ្សេងៗ' : 'Other'}</span>
                  <span className="text-2xl font-black text-slate-400">{stats?.categories?.other || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isKm ? 'ផ្លូវកាត់គ្រប់គ្រងរហ័ស' : 'Quick Actions'}
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => setCreateUserModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-brand-600/10 to-indigo-600/10 hover:from-brand-600/20 hover:to-indigo-600/20 border border-brand-500/20 transition-all text-xs font-bold text-brand-500 dark:text-brand-400"
                >
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span>{isKm ? '+ បន្ថែមអ្នកប្រើប្រាស់ជាមួយ Plan' : '+ Add User with Subscription Plan'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                    <span>{isKm ? 'ពិនិត្យការទូទាត់ CutLuy KHQR' : 'Review CutLuy KHQR Orders'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-500" />
                    <span>{isKm ? 'គ្រប់គ្រងអ្នកប្រើប្រាស់ & Quota' : 'Manage Users & Quota'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-500" />
                    <span>{isKm ? 'ការកំណត់ម៉ាស៊ីនបម្រើ' : 'System Configuration'}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAYMENTS & SUBSCRIPTIONS TAB ================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payments Header & Quick KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase">{isKm ? 'ចំណូលជោគជ័យសរុប' : 'Total Revenue'}</span>
              <p className="text-2xl font-black text-emerald-500">${totalProcessedRevenue}</p>
              <p className="text-[11px] text-slate-400">{isKm ? 'ទូទាត់តាម ABA KHQR' : 'Via ABA KHQR CutLuy'}</p>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase">{isKm ? 'ការជាវសកម្ម (Paid)' : 'Active Subscriptions'}</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {paymentsList.filter(p => p.status === 'paid').length}
              </p>
              <p className="text-[11px] text-emerald-500 font-semibold">{isKm ? 'ដំណើរការដោយស្វ័យប្រវត្តិ' : 'Fulfilled'}</p>
            </div>
            <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-xs font-bold uppercase">{isKm ? 'រង់ចាំការទូទាត់' : 'Pending Invoices'}</span>
              <p className="text-2xl font-black text-amber-500">
                {paymentsList.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-[11px] text-slate-400">{isKm ? 'អាចចុចបើកដំណើរការដោយផ្ទាល់' : 'Can be manually approved'}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card border border-slate-200 dark:border-slate-800">
              {['all', 'paid', 'pending'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setPaymentFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    paymentFilter === filterKey
                      ? 'bg-brand-500 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {filterKey} ({paymentsList.filter(p => filterKey === 'all' ? true : p.status === filterKey).length})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isKm ? 'ប្រព័ន្ធ CutLuy Webhook & Polling បន្តផ្ទាល់' : 'CutLuy Webhook & Realtime Auto-Polling active'}</span>
            </div>
          </div>

          {/* Payments Orders Table */}
          <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">{isKm ? 'លេខកូដកុម្ម៉ង់' : 'Order ID / Ref'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'អ្នកជាវ' : 'Customer'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'កញ្ចប់' : 'Plan'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'ចំនួនទឹកប្រាក់' : 'Amount'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'វិធីទូទាត់' : 'Gateway'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'ស្ថានភាព' : 'Status'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'កាលបរិច្ឆេទ' : 'Created At'}</th>
                    <th className="px-6 py-3.5 text-right">{isKm ? 'សកម្មភាព' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-slate-400">
                        {isKm ? 'មិនទាន់មានប្រតិបត្តិការទូទាត់ទេ' : 'No payment sessions found in this category.'}
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.paymentId || p.referenceId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-3.5 font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                          {p.paymentId}
                          <span className="block text-[10px] text-slate-400 font-normal">{p.referenceId}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-semibold text-slate-900 dark:text-white block">{p.userName || 'Customer'}</span>
                          <span className="text-[11px] text-slate-400">{p.userEmail || p.userId}</span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-bold text-indigo-500">{p.planName || p.planId}</span>
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          ${Number(p.amount).toFixed(2)} {p.currency || 'USD'}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            {p.paymentMethod || 'ABA KHQR'}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          {p.status === 'paid' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" /> Paid & Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              <Clock className="w-3 h-3 animate-spin" /> Pending Payment
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                          {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          {p.status !== 'paid' ? (
                            <button
                              onClick={() => handleFulfillPayment(p.paymentId)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors shadow-sm"
                            >
                              {isKm ? 'អនុម័ត & បើកដំណើរការ' : 'Approve & Fulfill'}
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Fulfilled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= USERS & PLANS MANAGEMENT TAB ================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search bar & Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={isKm ? 'ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល...' : 'Search by name or email...'}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-card border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">
                {filteredUsers.length} {isKm ? 'គណនីបានរកឃើញ' : 'registered accounts'}
              </span>
              <button
                onClick={() => setCreateUserModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isKm ? 'បង្កើត User ជាមួយ Plan' : 'Create User'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">{isKm ? 'អ្នកប្រើប្រាស់' : 'User'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'តួនាទី' : 'Role'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'កញ្ចប់សកម្ម & រយៈពេល' : 'Active Plan & Expiry'}</th>
                    <th className="px-6 py-3.5">{isKm ? 'ទំហំផ្ទុកប្រើប្រាស់' : 'Storage Quota'}</th>
                    <th className="px-6 py-3.5 text-right">{isKm ? 'សកម្មភាព' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredUsers.map((u) => {
                    const quotaBytes = Number(u.storage_quota_bytes || 50 * 1024 * 1024 * 1024);
                    const usedBytes = Number(u.storage_used_bytes || 0);
                    const percent = quotaBytes > 0 ? Math.min(100, Math.round((usedBytes / quotaBytes) * 100)) : 0;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={u.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.id}`}
                              alt={u.display_name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                            />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white block">{u.display_name}</span>
                              <span className="text-[11px] text-slate-400">{u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1.5 font-bold text-indigo-500 text-xs">
                              <Sparkles className="w-3 h-3 text-amber-400" />
                              {u.plan_name || 'Standard Tier'}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {u.plan_expires_at
                                ? `Expires: ${new Date(u.plan_expires_at).toLocaleDateString()}`
                                : 'Lifetime / Permanent'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="space-y-1 max-w-xs">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span>{(usedBytes / (1024 * 1024)).toFixed(1)} MB</span>
                              <span className="text-slate-400 font-semibold">{formatStorage(quotaBytes)}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Assign Plan Button */}
                            <button
                              onClick={() => handleOpenAssignPlanModal(u)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 text-indigo-400 hover:text-white hover:from-indigo-600 hover:to-purple-600 text-[11px] font-bold transition-all shadow-sm"
                              title="Assign or upgrade user plan"
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Plan</span>
                            </button>

                            {/* Edit Quota Button */}
                            <button
                              onClick={() => handleOpenQuotaModal(u)}
                              className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                              title="Edit storage quota"
                            >
                              Quota
                            </button>

                            {/* Promote / Demote */}
                            {u.role !== 'admin' ? (
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'admin')}
                                className="px-2 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white text-[11px] font-bold transition-colors"
                              >
                                Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'user')}
                                className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200 text-[11px] font-bold transition-colors"
                              >
                                User
                              </button>
                            )}

                            {/* Delete User */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={u.id === user?.id}
                              className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= MODAL: ASSIGN PLAN TO USER ================= */}
          {assigningPlanUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="max-w-lg w-full p-6 rounded-2xl glass-card border border-indigo-500/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {isKm ? 'កំណត់កញ្ចប់ Plan ជូនអ្នកប្រើប្រាស់' : 'Assign Subscription Plan'}
                    </h3>
                  </div>
                  <button onClick={() => setAssigningPlanUser(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected User</span>
                    <strong className="text-slate-900 dark:text-white">{assigningPlanUser.display_name}</strong>
                    <span className="text-slate-400 block text-[11px]">{assigningPlanUser.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Plan</span>
                    <span className="font-bold text-indigo-400">{assigningPlanUser.plan_name || 'Standard Tier'}</span>
                  </div>
                </div>

                {/* Plan Options Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isKm ? 'ជ្រើសរើសកញ្ចប់ Plan' : 'Select Target Plan'}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {planOptions.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
                              : 'glass-card border-slate-200 dark:border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">{plan.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-black bg-indigo-500/20 text-indigo-400">
                                {plan.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{plan.desc}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-sm text-slate-900 dark:text-white">{plan.price}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom GB Input if Custom Plan */}
                {selectedPlanId === 'custom' && (
                  <div className="space-y-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <label className="text-xs font-bold text-amber-400 block">
                      Custom Storage Quota (GB)
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="100000"
                      value={customPlanQuotaGb}
                      onChange={(e) => setCustomPlanQuotaGb(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg glass-card border border-amber-500/30 text-white"
                      placeholder="e.g. 5000 for 5 TB"
                    />
                  </div>
                )}

                {/* Duration Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isKm ? 'សុពលភាព / រយៈពេល' : 'Plan Duration / Validity'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '30 Days', days: 30 },
                      { label: '90 Days', days: 90 },
                      { label: '1 Year', days: 365 },
                      { label: 'Lifetime', days: 9999 },
                    ].map((d) => (
                      <button
                        key={d.days}
                        type="button"
                        onClick={() => setSelectedDurationDays(d.days)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          selectedDurationDays === d.days
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'glass-card border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setAssigningPlanUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePlanAssignment}
                    disabled={assignPlanLoading}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{assignPlanLoading ? 'Applying...' : 'Apply Plan to User'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= MODAL: CREATE USER WITH PLAN ================= */}
          {createUserModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <form
                onSubmit={handleCreateUserWithPlan}
                className="max-w-md w-full p-6 rounded-2xl glass-card border border-brand-500/30 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-brand-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {isKm ? 'បង្កើតគណនីថ្មីជាមួយ Plan' : 'Create New User with Plan'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCreateUserModalOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="user">Standard User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subscription Plan</label>
                    <select
                      value={newUserPlanId}
                      onChange={(e) => setNewUserPlanId(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      <option value="free">Standard (50 GB)</option>
                      <option value="1month">1 Month (500 GB)</option>
                      <option value="3months">3 Months (1 TB)</option>
                      <option value="1year">1 Year (2 TB)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCreateUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createUserLoading}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20"
                  >
                    {createUserLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= MODAL: EDIT USER STORAGE QUOTA ================= */}
          {editingUserQuota && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="max-w-md w-full p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isKm ? 'កែប្រែទំហំផ្ទុករបស់អ្នកប្រើ' : 'Adjust Storage Quota'}
                  </h3>
                  <button onClick={() => setEditingUserQuota(null)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  Target user: <strong className="text-slate-200">{editingUserQuota.display_name}</strong> ({editingUserQuota.email})
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isKm ? 'ជ្រើសរើសទំហំកំណត់ (GB)' : 'Storage Quota (GB)'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 500, 1000].map((gb) => (
                      <button
                        key={gb}
                        type="button"
                        onClick={() => setNewQuotaGb(gb)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          newQuotaGb === gb
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'glass-card border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {gb >= 1000 ? `${gb / 1000} TB` : `${gb} GB`}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={newQuotaGb}
                    onChange={(e) => setNewQuotaGb(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 mt-2"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingUserQuota(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUserQuota}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md"
                  >
                    Save Quota
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= CONTENT MODERATION TAB ================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {['all', 'image', 'video', 'document', 'archive'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFileCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    fileCategoryFilter === cat
                      ? 'bg-brand-500 text-white'
                      : 'glass-card border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fileSearch}
                onChange={(e) => setFileSearch(e.target.value)}
                placeholder="Filter files..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl glass-card border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-6 py-3.5">Filename</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Size</th>
                    <th className="px-6 py-3.5">Uploaded</th>
                    <th className="px-6 py-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                        No files matching current moderation query.
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                          {file.original_filename}
                        </td>
                        <td className="px-6 py-3.5 uppercase text-[10px] font-bold text-slate-400">
                          {file.file_category}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-[11px]">
                          {(Number(file.file_size_bytes || 0) / (1024 * 1024)).toFixed(2)} MB
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 text-[11px]">
                          {file.created_at ? new Date(file.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <button
                            onClick={() => handleModerateDeleteFile(file.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Infringing</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= ABUSE REPORTS TAB ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reportsList.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-card text-slate-400 text-xs font-semibold space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p>No abuse or DMCA takedown reports in queue. Everything clean!</p>
            </div>
          ) : (
            reportsList.map((rep) => (
              <div
                key={rep.id}
                className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rep.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-500'
                        : 'bg-emerald-500/20 text-emerald-500'
                    }`}
                  >
                    {rep.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rep.created_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Reason:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{rep.reason}</p>
                </div>
                {rep.status === 'pending' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'action')}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                    >
                      Action & Take Down
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                    >
                      Dismiss Report
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= SYSTEM SETTINGS TAB ================= */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl rounded-2xl glass-card border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isKm ? 'ការកំណត់ប្រព័ន្ធម៉ាស៊ីនបម្រើ' : 'Platform & Storage Configuration'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isKm ? 'គ្រប់គ្រងដែនកំណត់ និងស្ថានភាពដំណើរការនៃប្រព័ន្ធទាំងមូល' : 'Configure platform-wide limits and maintenance modes.'}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {isKm ? 'របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)' : 'Maintenance Mode'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isKm ? 'ផ្អាកការផ្ទុកឯកសារថ្មីៗជាបណ្ដោះអាសន្នពេលកំពុងជួសជុល' : 'Temporarily prevent new uploads during server upgrades'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKm ? 'ទំហំឯកសារអតិបរមាក្នុងមួយឯកសារ (MB)' : 'Max Single File Size (MB)'}
            </label>
            <input
              type="number"
              value={maxFileSizeMb}
              onChange={(e) => setMaxFileSizeMb(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isKm ? 'ទំហំផ្ទុកលំនាំដើមសម្រាប់អ្នកចុះឈ្មោះថ្មី (MB)' : 'Default Storage Quota for New Users (MB)'}
            </label>
            <input
              type="number"
              value={defaultQuotaMb}
              onChange={(e) => setDefaultQuotaMb(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-card border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">51,200 MB = 50 GB standard free tier quota.</p>
          </div>

          {settingsSuccess && (
            <p className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> System settings updated successfully!
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01]"
          >
            {isKm ? 'រក្សាទុកការកំណត់ប្រព័ន្ធ' : 'Save Platform Configuration'}
          </button>
        </form>
      )}

      {/* ================= AUDIT LOGS TAB ================= */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Administrative Audit Stream</h3>
            <span className="text-xs text-slate-400">{auditLogs.length} events logged</span>
          </div>
          <div className="p-4 space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No administrative audit events recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-500 uppercase text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10">
                        {log.action}
                      </span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium">
                        Target: <span className="font-mono text-slate-400">{log.target_type} ({log.target_id || 'system'})</span>
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-[11px] text-slate-400 font-mono">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                      </p>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
