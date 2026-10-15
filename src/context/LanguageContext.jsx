import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'GenZ File',
    tagline: 'High-Performance Cloud File & Media Hosting',
    uploadTitle: 'Upload Your Files Instantly',
    uploadSubtitle: 'Fast, secure and permanent hosting with instant shareable links and online media previews.',
    dropFilesHere: 'Drag & drop files here or browse',
    chooseFiles: 'Browse Files',
    maxSizeNotice: 'Supports images, videos, documents & archives up to 500 MB',
    recentUploads: 'Recent Uploads',
    myFiles: 'My Files',
    fileManager: 'File Manager',
    searchPlaceholder: 'Search files by name or tag...',
    allFiles: 'All Files',
    images: 'Images',
    videos: 'Videos',
    documents: 'Documents',
    archives: 'Archives',
    trash: 'Trash Bin',
    newFolder: 'New Folder',
    storageUsed: 'Storage Used',
    pricing: 'Pricing & Plans',
    helpFaq: 'Help & FAQ',
    adminDashboard: 'Admin Center',
    profile: 'Profile',
    login: 'Sign In',
    register: 'Create Account',
    logout: 'Sign Out',
    copyLink: 'Copy Link',
    download: 'Download',
    preview: 'Preview',
    share: 'Share',
    rename: 'Rename',
    delete: 'Delete',
    restore: 'Restore',
    permanentDelete: 'Permanently Delete',
    linkCopied: 'Link copied to clipboard!',
    passwordProtected: 'Password Protected',
    enterPassword: 'Enter password to access this file',
    unlock: 'Unlock File',
    totalUsers: 'Total Users',
    totalFiles: 'Total Files',
    totalStorage: 'Total Storage',
    maintenanceMode: 'Maintenance Mode',
    reportAbuse: 'Report Abuse',
    submitReport: 'Submit Report',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    quickShare: 'Quick Share',
    qrCode: 'QR Code',
    directLink: 'Direct Link',
    shareOnSocial: 'Share on Social Media',
    upgradePlan: 'Upgrade Plan',
    quotaWarning: 'Approaching storage limit',
    khmer: 'ភាសាខ្មែរ',
    english: 'English',

    // Pricing & Plans (English)
    pricingTitle: 'Flexible Storage Plans for Every Creator',
    pricingSubtitle: 'Expand your cloud storage limit with high-performance global infrastructure, instant sharing, and zero transfer throttling.',
    genzStoragePlans: 'GenZ File Storage Plans',
    yourActiveTier: 'Your Active Tier',
    activeQuota: 'Active Quota',
    selectPlan: 'Select',
    currentActivePlan: 'Current Active Plan',
    instantActivation: 'Instant Activation & Secure Guarantee',
    instantActivationDesc: 'Your quota updates immediately after subscription with zero downtime or migration needed.',
    secureCheckout: '256-bit SSL Secure Checkout',
    needMoreVaultSpace: 'Need More Cloud Vault Space?',
    homePricingPromoDesc: 'Upgrade your quota starting from 1 Month for $2.99 (500 GB), 3 Months for $5.99 (1 TB), or 1 Year for $9.99 (2 TB).',
    exploreStoragePlans: 'Explore Storage Plans',

    plan1MonthTitle: '1 Month Plan',
    plan1MonthDesc: '500 GB High-Speed Secure Cloud Storage for 1 Month',
    plan1MonthCycle: '1 MONTH',
    plan1MonthStorage: '500 GB Storage',

    plan3MonthTitle: '3 Month Plan',
    plan3MonthDesc: '1 TB (1,000 GB) Ultra Storage with Multi-Month Savings',
    plan3MonthCycle: '3 MONTHS',
    plan3MonthStorage: '1000 GB Storage',
    badgeMostPopular: 'MOST POPULAR',

    plan1YearTitle: '1 Year Plan',
    plan1YearDesc: '2 TB (2,000 GB) Maximum Storage — Best Value for 1 Full Year',
    plan1YearCycle: '1 YEAR',
    plan1YearStorage: '2000 GB Storage',
    badgeBestValue: 'BEST VALUE',

    feat1M_1: '500 GB High-Speed Cloud Storage',
    feat1M_2: 'Instant fast sharing links',
    feat1M_3: 'Up to 10 GB per file upload',
    feat1M_4: 'Zero ads & no download wait times',
    feat1M_5: 'Password protection on shared links',
    feat1M_6: '24/7 Standard Support',

    feat3M_1: '1 TB (1,000 GB) Ultra Cloud Storage',
    feat3M_2: 'Save over 33% compared to monthly',
    feat3M_3: 'Up to 25 GB per file upload',
    feat3M_4: 'High-speed global CDN delivery',
    feat3M_5: 'Custom expiration timers on links',
    feat3M_6: 'Priority media streaming & conversion',
    feat3M_7: '24/7 Priority Support',

    feat1Y_1: '2 TB (2,000 GB) Maximum Cloud Vault',
    feat1Y_2: 'Only $9.99 for an entire year (Unbeatable value)',
    feat1Y_3: 'Up to 50 GB per file upload',
    feat1Y_4: 'Full speed uncapped bandwidth',
    feat1Y_5: 'Team sub-accounts & audit logs',
    feat1Y_6: 'Permanent file preservation guarantee',
    feat1Y_7: '24/7 Dedicated VIP Support',

    // KHQR Payment Modal
    generatingKhqr: 'Generating KHQR Payment...',
    connectingCutluy: 'Connecting securely to CutLuy Payment Gateway',
    merchantName: 'Merchant Name',
    merchantVal: 'GenZ File Cloud Store',
    amountDue: 'Amount Due',
    quotaUpgrade: 'Quota Upgrade',
    scanKhqrTitle: 'Scan to Pay with Any Banking App',
    scanKhqrSub: 'Supports ABA, Bakong, Wing, ACLEDA & all KHQR mobile banking apps in Cambodia.',
    expiresIn: 'Expires in',
    paymentReceived: 'Payment Received!',
    paymentReceivedSub: 'Your storage quota has been upgraded instantly. Thank you for subscribing!',
    paymentExpired: 'Payment Expired',
    paymentFailed: 'Payment Failed',
    simulateSuccessDev: 'Simulate KHQR Payment (Instant Test)',
    close: 'Close',
  },
  km: {
    appName: 'GenZ File',
    tagline: 'សេវាកម្មបង្ហោះឯកសារ រូបភាព និងវីដេអូល្បឿនលឿន GenZ File',
    uploadTitle: 'បង្ហោះឯកសាររបស់អ្នកភ្លាមៗ',
    uploadSubtitle: 'មានសុវត្ថិភាពខ្ពស់ ផ្តល់នូវតំណភ្ជាប់ចែករំលែកភ្លាមៗ និងអាចមើលមុនបានយ៉ាងរលូន។',
    dropFilesHere: 'អូសនិងទម្លាក់ឯកសារនៅទីនេះ ឬជ្រើសរើស',
    chooseFiles: 'ជ្រើសរើសឯកសារ',
    maxSizeNotice: 'គាំទ្ររូបភាព វីដេអូ ឯកសារ និងបណ្ណសាររហូតដល់ 500 MB',
    recentUploads: 'ឯកសារទើបបង្ហោះថ្មីៗ',
    myFiles: 'ឯកសាររបស់ខ្ញុំ',
    fileManager: 'កម្មវិធីគ្រប់គ្រងឯកសារ',
    searchPlaceholder: 'ស្វែងរកឯកសារតាមឈ្មោះ...',
    allFiles: 'ឯកសារទាំងអស់',
    images: 'រូបភាព',
    videos: 'វីដេអូ',
    documents: 'ឯកសារការងារ',
    archives: 'ឯកសារបណ្ណសារ (ZIP/RAR)',
    trash: 'ធុងសំរាម',
    newFolder: 'ថតថ្មី',
    storageUsed: 'ទំហំផ្ទុកបានប្រើ',
    pricing: 'កញ្ចប់តម្លៃ & ទំហំផ្ទុក',
    helpFaq: 'ជំនួយ & សំណួរញឹកញាប់',
    adminDashboard: 'ផ្ទាំងគ្រប់គ្រងអ្នកគ្រប់គ្រង',
    profile: 'គណនីរបស់ខ្ញុំ',
    login: 'ចូលគណនី',
    register: 'ចុះឈ្មោះ',
    logout: 'ចាកចេញ',
    copyLink: 'ចម្លងតំណភ្ជាប់',
    download: 'ទាញយក',
    preview: 'មើលជាមុន',
    share: 'ចែករំលែក',
    rename: 'ប្តូរឈ្មោះ',
    delete: 'លុប',
    restore: 'ស្តារឡើងវិញ',
    permanentDelete: 'លុបជារៀងរហូត',
    linkCopied: 'បានចម្លងតំណភ្ជាប់!',
    passwordProtected: 'ការពារដោយពាក្យសម្ងាត់',
    enterPassword: 'បញ្ចូលពាក្យសម្ងាត់ដើម្បីមើលឯកសារនេះ',
    unlock: 'ដោះសោឯកសារ',
    totalUsers: 'អ្នកប្រើប្រាស់សរុប',
    totalFiles: 'ឯកសារសរុប',
    totalStorage: 'ទំហំផ្ទុកសរុប',
    maintenanceMode: 'ដំណើរការជួសជុល',
    reportAbuse: 'រាយការណ៍ភាពមិនប្រក្រតី',
    submitReport: 'ផ្ញើរបាយការណ៍',
    termsOfService: 'លក្ខខណ្ឌប្រើប្រាស់',
    privacyPolicy: 'គោលការណ៍ឯកជនភាព',
    quickShare: 'ចែករំលែករហ័ស',
    qrCode: 'កូដ QR',
    directLink: 'តំណភ្ជាប់ផ្ទាល់',
    shareOnSocial: 'ចែករំលែកតាមបណ្តាញសង្គម',
    upgradePlan: 'ដំឡើងគម្រោង',
    quotaWarning: 'ជិតអស់ទំហំផ្ទុកហើយ',
    khmer: 'ភាសាខ្មែរ',
    english: 'English',

    // Pricing & Plans (Khmer)
    pricingTitle: 'កញ្ចប់ទំហំផ្ទុកទិន្នន័យសម្រាប់អ្នកបង្កើតមាតិកា',
    pricingSubtitle: 'បង្កើនទំហំផ្ទុក Cloud របស់អ្នកជាមួយនឹងប្រព័ន្ធល្បឿនលឿនកម្រិតពិភពលោក ចែករំលែកឯកសាររហ័សទាន់ចិត្ត និងគ្មានការកាត់បន្ថយល្បឿន។',
    genzStoragePlans: 'កញ្ចប់ទំហំផ្ទុក GenZ File',
    yourActiveTier: 'កញ្ចប់កំពុងប្រើប្រាស់',
    activeQuota: 'ទំហំផ្ទុកសកម្ម',
    selectPlan: 'ជ្រើសរើសកញ្ចប់',
    currentActivePlan: 'កញ្ចប់សកម្មបច្ចុប្បន្ន',
    instantActivation: 'ដំណើរការភ្លាមៗ & ធានាសុវត្ថិភាព 100%',
    instantActivationDesc: 'ទំហំផ្ទុករបស់អ្នកនឹងត្រូវបានដំឡើងភ្លាមៗបន្ទាប់ពីទូទាត់ ដោយមិនបាច់រង់ចាំ ឬផ្ទេរទិន្នន័យឡើយ។',
    secureCheckout: 'ការទូទាត់ប្រកបដោយសុវត្ថិភាព 256-bit SSL',
    needMoreVaultSpace: 'ត្រូវការទំហំផ្ទុក Cloud បន្ថែមមែនទេ?',
    homePricingPromoDesc: 'ដំឡើងទំហំផ្ទុករបស់អ្នកចាប់ពី ១ ខែ ត្រឹមតែ $2.99 (500 GB), ៣ ខែ ត្រឹមតែ $5.99 (1 TB) ឬ ១ ឆ្នាំ ត្រឹមតែ $9.99 (2 TB)។',
    exploreStoragePlans: 'មើលកញ្ចប់ទំហំផ្ទុកទាំងអស់',

    plan1MonthTitle: 'កញ្ចប់ ១ ខែ',
    plan1MonthDesc: 'ទំហំផ្ទុក Cloud ល្បឿនលឿន និងសុវត្ថិភាព 500 GB សម្រាប់ ១ ខែ',
    plan1MonthCycle: '១ ខែ',
    plan1MonthStorage: 'ទំហំផ្ទុក 500 GB',

    plan3MonthTitle: 'កញ្ចប់ ៣ ខែ',
    plan3MonthDesc: 'ទំហំផ្ទុកកម្រិតខ្ពស់ 1 TB (1,000 GB) ជាមួយការបញ្ចុះតម្លៃពិសេស',
    plan3MonthCycle: '៣ ខែ',
    plan3MonthStorage: 'ទំហំផ្ទុក 1000 GB',
    badgeMostPopular: 'ពេញនិយមបំផុត',

    plan1YearTitle: 'កញ្ចប់ ១ ឆ្នាំ',
    plan1YearDesc: 'ទំហំផ្ទុកអតិបរមា 2 TB (2,000 GB) — តម្លៃចំណេញដាច់គេសម្រាប់ពេញ ១ ឆ្នាំ',
    plan1YearCycle: '១ ឆ្នាំ',
    plan1YearStorage: 'ទំហំផ្ទុក 2000 GB',
    badgeBestValue: 'តម្លៃល្អបំផុត',

    feat1M_1: 'ទំហំផ្ទុក Cloud ល្បឿនលឿន 500 GB',
    feat1M_2: 'តំណភ្ជាប់ចែករំលែកឯកសាររហ័សទាន់ចិត្ត',
    feat1M_3: 'ផ្ទុកឯកសារបានរហូតដល់ 10 GB ក្នុងមួយឯកសារ',
    feat1M_4: 'គ្មានការផ្សាយពាណិជ្ជកម្ម និងមិនបាច់រង់ចាំ',
    feat1M_5: 'ការពារតំណភ្ជាប់ដោយលេខកូដសម្ងាត់',
    feat1M_6: 'សេវាគាំទ្របម្រើ ២៤/៧',

    feat3M_1: 'ទំហំផ្ទុក Cloud កម្រិតខ្ពស់ 1 TB (1,000 GB)',
    feat3M_2: 'សន្សំបានជាង 33% ធៀបនឹងការបង់ប្រចាំខែ',
    feat3M_3: 'ផ្ទុកឯកសារបានរហូតដល់ 25 GB ក្នុងមួយឯកសារ',
    feat3M_4: 'ប្រព័ន្ធចែកចាយ CDN ល្បឿនលឿនសកល',
    feat3M_5: 'កំណត់ពេលវេលាហួសកំណត់លើតំណចែករំលែក',
    feat3M_6: 'ការបញ្ជូន និងបម្លែងវីដេអូ/មេឌៀអាទិភាព',
    feat3M_7: 'សេវាគាំទ្រអាទិភាព ២៤/៧',

    feat1Y_1: 'ទំហំផ្ទុក Cloud អតិបរមា 2 TB (2,000 GB)',
    feat1Y_2: 'ត្រឹមតែ $9.99 សម្រាប់ពេញមួយឆ្នាំ (តម្លៃចំណេញដាច់គេ)',
    feat1Y_3: 'ផ្ទុកឯកសារបានរហូតដល់ 50 GB ក្នុងមួយឯកសារ',
    feat1Y_4: 'ល្បឿនបញ្ជូនពេញទំហំគ្មានដែនកំណត់',
    feat1Y_5: 'គណនីរងសម្រាប់ក្រុមការងារ និងកំណត់ត្រាត្រួតពិនិត្យ',
    feat1Y_6: 'ការធានារក្សាទុកឯកសារជាអចិន្ត្រៃយ៍',
    feat1Y_7: 'សេវាគាំទ្រ VIP ពិសេស ២៤/៧',

    // KHQR Payment Modal
    generatingKhqr: 'កំពុងបង្កើតកូដ KHQR សម្រាប់ទូទាត់...',
    connectingCutluy: 'កំពុងភ្ជាប់ទៅកាន់ច្រកទូទាត់ CutLuy ដោយសុវត្ថិភាព',
    merchantName: 'ឈ្មោះអាជីវកម្ម',
    merchantVal: 'GenZ File Cloud Store',
    amountDue: 'ចំនួនទឹកប្រាក់ត្រូវបង់',
    quotaUpgrade: 'ដំឡើងទំហំផ្ទុក',
    scanKhqrTitle: 'ស្កេនដើម្បីទូទាត់ជាមួយកម្មវិធីធនាគារណាក៏បាន',
    scanKhqrSub: 'គាំទ្រ ABA Mobile, Bakong, Wing, ACLEDA និងកម្មវិធីធនាគារ KHQR ទាំងអស់នៅកម្ពុជា។',
    expiresIn: 'ផុតកំណត់ក្នុងរយៈពេល',
    paymentReceived: 'ទទួលបានការទូទាត់ជោគជ័យ!',
    paymentReceivedSub: 'ទំហំផ្ទុករបស់អ្នកត្រូវបានដំឡើងភ្លាមៗ។ សូមអរគុណចំពោះការជាវគម្រោង!',
    paymentExpired: 'កូដទូទាត់បានផុតកំណត់',
    paymentFailed: 'ការទូទាត់មិនជោគជ័យ',
    simulateSuccessDev: 'សាកល្បងទូទាត់ប្រាក់ KHQR (សាកល្បងភ្លាមៗ)',
    close: 'បិទ',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('medialink_lang') || 'en';
  });

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'km' : 'en';
    setLang(next);
    localStorage.setItem('medialink_lang', next);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
