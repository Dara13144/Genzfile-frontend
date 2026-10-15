import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  X, 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function KhqrPaymentModal({ plan, onClose, onSuccess }) {
  const { refreshUser } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [status, setStatus] = useState('pending'); // 'pending' | 'scanned' | 'paid' | 'expired' | 'failed'
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default

  // Initialize CutLuy live payment
  useEffect(() => {
    let isMounted = true;
    async function initPayment() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.createPayment(plan.id);
        if (isMounted) {
          if (res.success && res.payment) {
            setPayment(res.payment);
            setStatus(res.payment.status || 'pending');
            if (res.payment.expires_at) {
              const diffSec = Math.max(0, Math.floor((new Date(res.payment.expires_at) - Date.now()) / 1000));
              setTimeLeft(diffSec > 0 ? diffSec : 300);
            }
          } else {
            throw new Error(res.error || 'Failed to initialize CutLuy payment gateway');
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Payment service unavailable');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initPayment();
    return () => { isMounted = false; };
  }, [plan.id]);

  // Expiration countdown timer
  useEffect(() => {
    if (status === 'paid' || status === 'expired' || status === 'failed') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setStatus('expired');
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Auto-polling CutLuy status every 2.5 seconds
  useEffect(() => {
    if (!payment || status === 'paid' || status === 'expired' || status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const res = await api.checkPaymentStatus(payment.id);
        if (res.success) {
          if (res.status === 'paid') {
            setStatus('paid');
            await refreshUser();
            if (onSuccess) onSuccess(res);
            clearInterval(interval);
          } else if (res.status && res.status !== status) {
            setStatus(res.status);
          }
        }
      } catch (err) {
        console.warn('Status poll warning:', err.message);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [payment, status, refreshUser, onSuccess]);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm flex flex-col items-center">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-12 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-10 h-10 animate-spin text-red-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t('generatingKhqr')}
              </p>
              <p className="text-xs text-slate-400">
                {t('connectingCutluy')}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('paymentFailed')}
              </h3>
              <p className="text-xs text-red-500 font-medium">{error}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {t('close')}
            </button>
          </div>
        ) : status === 'paid' ? (
          /* Payment Success State */
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {t('paymentReceived')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('paymentReceivedSub')}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-bold">
              ✓ {plan.name} ({plan.storageQuotaGb} GB Storage Active)
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              {t('close')}
            </button>
          </div>
        ) : status === 'expired' ? (
          /* Expired State */
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {t('paymentExpired')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('paymentExpired')}
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              {t('close')}
            </button>
          </div>
        ) : (
          /* Clean Official ABA KHQR Card without animations */
          <div className="w-full max-w-[310px] mx-auto">
            <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative">
              
              {/* 1. Official ABA' PAY Header Bar */}
              <div className="bg-white pt-4 pb-3 px-5 flex items-center justify-center border-b border-slate-100">
                <img
                  src="/aba_pay.png"
                  alt="ABA' PAY"
                  className="h-8 w-auto object-contain select-none"
                />
              </div>

              {/* 2. Merchant Name & Amount */}
              <div className="px-5 pt-3 pb-1.5 text-left bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
                    {payment.merchant_name || 'MAO DARA imsara CO STORE'}
                  </p>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-600 border border-cyan-200">
                    VERIFIED
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {payment.amount}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {payment.currency || 'USD'}
                  </span>
                </div>
              </div>

              {/* 3. Dashed Divider Line */}
              <div className="border-b border-dashed border-slate-200 mx-5 my-1" />

              {/* 4. Full Sharp QR Code (Clean & Static) */}
              <div className="p-5 pt-2 pb-3 bg-white relative flex items-center justify-center">
                <div className="relative w-full aspect-square bg-white rounded-xl flex items-center justify-center p-1.5">
                  {/* Pure High-Resolution QR Vector */}
                  {payment?.qr_string ? (
                    <QRCodeSVG
                      value={payment.qr_string}
                      size={250}
                      level="M"
                      includeMargin={false}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Bottom Brand Footnote */}
              <div className="px-4 pb-3.5 pt-1 text-center bg-white">
                <p className="text-[10px] font-semibold text-slate-400">
                  Scan with ABA Mobile or any KHQR Banking App
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

