import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Shield, 
  HardDrive, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  Star, 
  Award, 
  ShieldCheck, 
  Clock, 
  X, 
  Lock, 
  ChevronRight, 
  TrendingUp, 
  QrCode,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import KhqrPaymentModal from '../components/KhqrPaymentModal.jsx';

export default function Pricing() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [khqrModalPlan, setKhqrModalPlan] = useState(null);

  // Default plans matching user specifications
  const fallbackPlans = [
    {
      id: '1month',
      price: '$2.99',
      priceNumber: 2.99,
      durationDays: 30,
      storageQuotaGb: 500,
      storageQuotaFormatted: '500 GB',
      highlighted: false,
    },
    {
      id: '3months',
      price: '$5.99',
      priceNumber: 5.99,
      durationDays: 90,
      storageQuotaGb: 1000,
      storageQuotaFormatted: '1 TB',
      highlighted: true,
    },
    {
      id: '1year',
      price: '$9.99',
      priceNumber: 9.99,
      durationDays: 365,
      storageQuotaGb: 2000,
      storageQuotaFormatted: '2 TB',
      highlighted: false,
    },
  ];

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoadingPlans(true);
        const res = await api.getPlans();
        if (res.success && res.plans && res.plans.length > 0) {
          setPlans(res.plans);
        } else {
          setPlans(fallbackPlans);
        }
      } catch {
        setPlans(fallbackPlans);
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  // Localized plan attributes according to current lang
  const getLocalizedPlan = (p) => {
    if (p.id === '1month') {
      return {
        ...p,
        name: t('plan1MonthTitle'),
        description: t('plan1MonthDesc'),
        billingCycle: t('plan1MonthCycle'),
        storageDisplay: t('plan1MonthStorage'),
        badge: null,
        features: [
          t('feat1M_1'),
          t('feat1M_2'),
          t('feat1M_3'),
          t('feat1M_4'),
          t('feat1M_5'),
          t('feat1M_6'),
        ],
      };
    }
    if (p.id === '3months') {
      return {
        ...p,
        name: t('plan3MonthTitle'),
        description: t('plan3MonthDesc'),
        billingCycle: t('plan3MonthCycle'),
        storageDisplay: t('plan3MonthStorage'),
        badge: t('badgeMostPopular'),
        features: [
          t('feat3M_1'),
          t('feat3M_2'),
          t('feat3M_3'),
          t('feat3M_4'),
          t('feat3M_5'),
          t('feat3M_6'),
          t('feat3M_7'),
        ],
      };
    }
    if (p.id === '1year') {
      return {
        ...p,
        name: t('plan1YearTitle'),
        description: t('plan1YearDesc'),
        billingCycle: t('plan1YearCycle'),
        storageDisplay: t('plan1YearStorage'),
        badge: t('badgeBestValue'),
        features: [
          t('feat1Y_1'),
          t('feat1Y_2'),
          t('feat1Y_3'),
          t('feat1Y_4'),
          t('feat1Y_5'),
          t('feat1Y_6'),
          t('feat1Y_7'),
        ],
      };
    }
    return {
      ...p,
      storageDisplay: p.storageQuotaFormatted || '500 GB',
      features: p.features || [],
    };
  };

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setKhqrModalPlan(plan);
  };

  const isCurrentPlan = (planId) => {
    return user && user.planId === planId;
  };

  return (
    <div className="min-h-screen text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Animated Ambient Background Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-40 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{t('genzStoragePlans')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {t('pricingTitle')}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            {t('pricingSubtitle')}
          </p>

          {/* Active Subscription Banner if user is logged in */}
          {user && (
            <div className="mt-4 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 max-w-xl mx-auto text-left shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/30">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{t('yourActiveTier')}</p>
                  <p className="text-sm font-bold text-white">
                    {user.planName || 'Standard Tier'} ({user.storageQuotaFormatted})
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {t('activeQuota')}: {user.storageQuotaFormatted}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch pt-4">
          {plans.map((rawPlan) => {
            const p = getLocalizedPlan(rawPlan);
            const isUserPlan = isCurrentPlan(p.id);
            const isPopular = p.id === '3months';
            const isBestValue = p.id === '1year';

            return (
              <div
                key={p.id}
                className={`rounded-3xl p-8 flex flex-col justify-between relative pricing-card-interactive group ${
                  isPopular
                    ? 'bg-[#0e1326] border-2 border-purple-500/80 ring-2 ring-purple-500/30 animate-glow-purple z-10 scale-[1.02]'
                    : isBestValue
                    ? 'bg-[#0f1523] border-2 border-amber-500/70 shadow-xl shadow-amber-950/40 animate-glow-gold'
                    : 'bg-[#0b0f19] border border-slate-800 shadow-xl hover:border-slate-700'
                }`}
              >
                {/* Floating Badge Header */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-purple-500/40 flex items-center gap-1.5 animate-float-badge z-20">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>{p.badge}</span>
                  </div>
                )}

                {isBestValue && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1.5 animate-float-badge z-20">
                    <Award className="w-3.5 h-3.5 text-slate-950" />
                    <span>{p.badge}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Plan Name & Tagline */}
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center justify-between">
                      <span>{p.name}</span>
                      {isUserPlan && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {t('currentActivePlan')}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 min-h-[34px] leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="p-4 rounded-2xl bg-[#080d1a]/80 border border-slate-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {p.price}
                      </span>
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        / {p.billingCycle}
                      </span>
                    </div>

                    {/* Storage Badge Pill */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-700/40 text-indigo-400 text-xs font-bold">
                      <HardDrive className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                      <span>{p.storageDisplay}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 pt-2 text-xs">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Action Button */}
                <div className="pt-8">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(p)}
                    className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 group btn-shimmer ${
                      isUserPlan
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 cursor-default'
                        : isPopular
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-purple-500/30'
                        : isBestValue
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/30'
                        : 'bg-white hover:bg-slate-100 text-slate-950 shadow-slate-900/50'
                    }`}
                  >
                    {isUserPlan ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{t('currentActivePlan')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('selectPlan')} {p.name}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-4xl mx-auto rounded-3xl p-6 bg-[#0b0f19] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t('instantActivation')}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('instantActivationDesc')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>{t('secureCheckout')}</span>
          </div>
        </div>
      </div>

      {/* CutLuy Auto KHQR Payment Modal */}
      {khqrModalPlan && (
        <KhqrPaymentModal
          plan={khqrModalPlan}
          onClose={() => setKhqrModalPlan(null)}
          onSuccess={() => {
            refreshUser();
          }}
        />
      )}
    </div>
  );
}
