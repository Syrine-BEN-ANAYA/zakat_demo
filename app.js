/**
 * Demo showcase logic — pure client-side, no backend, no persistence.
 * Mirrors the real zakat-erp Laravel app's screens, roles and approval
 * workflow (see UrgentAid / DistributionCampaign models) with fake data.
 * Refreshing the page resets everything.
 */
function zkApp() {
  return {
    // ---------------------------------------------------------------
    // Session / navigation state
    // ---------------------------------------------------------------
    loggedIn: false,
    selectedRole: 'admin',
    page: 'dashboard',
    collapsed: false,
    mobileOpen: false,
    familyFilter: 'all',
    activeFamily: null,
    activeWorkflow: null,
    toast: null,

    pageTitles: {
      dashboard: 'لوحة التحكم العامة',
      families: 'سجل الأسر',
      'urgent-aid': 'المساعدة العاجلة',
      distribution: 'محرك التوزيع',
      accounting: 'لوحة المحاسبة',
      ledger: 'دفتر الأستاذ العام',
      parcels: 'محطة التسليم والطرود',
    },
    pageSubtitles: {
      dashboard: 'نظرة عامة على النشاط والمؤشرات',
      families: 'إدارة ملفات الأسر المستفيدة',
      'urgent-aid': 'سير الاعتماد متعدد المراحل',
      distribution: 'حملات التوزيع الجماعي',
      accounting: 'الحسابات البنكية والمصاريف',
      ledger: 'جميع الحركات المالية',
      parcels: 'تتبع الطرود حسب الحالة',
    },

    // ---------------------------------------------------------------
    // Roles — mirrors Spatie roles/permissions in the real app
    // ---------------------------------------------------------------
    roles: [
      { key: 'admin',    label: 'مدير النظام',   icon: 'bi-shield-check',  initials: 'مد', demoName: 'مدير النظام (تجريبي)', perms: ['*'] },
      { key: 'deputy',   label: 'نائب المدير',    icon: 'bi-person-badge', initials: 'نم', demoName: 'خالد الشكيلي',         perms: ['families.view','accounting.view','parcels.view'] },
      { key: 'accountant', label: 'المحاسب',      icon: 'bi-calculator',   initials: 'مح', demoName: 'عائشة الرواحية',        perms: ['accounting.view'] },
      { key: 'social',   label: 'باحث اجتماعي',   icon: 'bi-people',       initials: 'با', demoName: 'سارة الحارثية',         perms: ['families.view'] },
      { key: 'entry',    label: 'مدخل بيانات',    icon: 'bi-pencil-square',initials: 'مب', demoName: 'فاطمة البوسعيدية',      perms: ['families.view'] },
      { key: 'parcel',   label: 'موزع الطرود',    icon: 'bi-truck',        initials: 'مط', demoName: 'سعيد الكندي',           perms: ['parcels.view'] },
    ],

    get currentRole() {
      return this.roles.find(r => r.key === this.selectedRole) || this.roles[0];
    },
    can(perm) {
      const p = this.currentRole.perms;
      return p.includes('*') || p.includes(perm);
    },
    login() {
      this.loggedIn = true;
      this.page = 'dashboard';
    },
    logout() {
      this.loggedIn = false;
      this.activeFamily = null;
      this.activeWorkflow = null;
    },

    // ---------------------------------------------------------------
    // Demo dataset (mirrors DemoSeeder.php content/spirit)
    // ---------------------------------------------------------------
    families: [
      { id: 1, name: 'محمد بن سالم الهنائي', civilId: '10201001', priority: 'medium', reviewStatus: 'approved', memberCount: 4, netIncome: 195, incomePerMember: 48.750, marital: 'متزوج', housing: 'إيجار' },
      { id: 2, name: 'فاطمة بنت راشد الكندية', civilId: '10201002', priority: 'urgent', reviewStatus: 'approved', memberCount: 3, netIncome: 50, incomePerMember: 16.667, marital: 'أرملة', housing: 'إيجار' },
      { id: 3, name: 'سعيد بن خميس البلوشي', civilId: '10201003', priority: 'low', reviewStatus: 'approved', memberCount: 2, netIncome: 480, incomePerMember: 240.000, marital: 'متزوج', housing: 'ملك' },
      { id: 4, name: 'خديجة بنت علي المعمرية', civilId: '10201004', priority: 'urgent', reviewStatus: 'approved', memberCount: 3, netIncome: 60, incomePerMember: 20.000, marital: 'مطلقة', housing: 'إيجار' },
      { id: 5, name: 'عبدالله بن حمد الغافري', civilId: '10201005', priority: 'medium', reviewStatus: 'approved', memberCount: 3, netIncome: 220, incomePerMember: 73.333, marital: 'متزوج', housing: 'إيجار' },
      { id: 6, name: 'مريم بنت يوسف الشحية', civilId: '10201006', priority: 'urgent', reviewStatus: 'approved', memberCount: 2, netIncome: 70, incomePerMember: 35.000, marital: 'أرملة', housing: 'ملك وراثة' },
      { id: 7, name: 'ناصر بن سليمان العبري', civilId: '10201007', priority: 'medium', reviewStatus: 'pending_review', memberCount: 2, netIncome: 150, incomePerMember: 75.000, marital: 'متزوج', housing: 'إيجار' },
      { id: 8, name: 'زهرة بنت راشد اليعقوبية', civilId: '10201008', priority: 'low', reviewStatus: 'pending_approval', memberCount: 2, netIncome: 70, incomePerMember: 35.000, marital: 'مطلقة', housing: 'إيجار' },
    ],

    urgentAids: [
      { id: 1, beneficiary: 'محمد بن سالم الهنائي', amount: 80, type: 'مالية', reason: 'مرض', status: 'pending_review' },
      { id: 2, beneficiary: 'فاطمة بنت راشد الكندية', amount: 120, type: 'علاجية', reason: 'حادث', status: 'pending_approval' },
      { id: 3, beneficiary: 'سعيد بن خميس البلوشي', amount: 60, type: 'عينية', reason: 'أخرى', status: 'approved' },
      { id: 4, beneficiary: 'خديجة بنت علي المعمرية', amount: 150, type: 'إسكانية', reason: 'حريق', status: 'disbursed' },
      { id: 5, beneficiary: 'عبدالله بن حمد الغافري', amount: 100, type: 'مالية', reason: 'فقدان عائل', status: 'disbursed' },
      { id: 6, beneficiary: 'مريم بنت يوسف الشحية', amount: 70, type: 'مالية', reason: 'مرض', status: 'rejected', rejectionReason: 'بيانات غير مكتملة' },
    ],

    campaigns: [
      { id: 1, name: 'حملة رمضان ٢٠٢٦ - أسر الأولوية القصوى', supportType: 'تحويل بنكي', familiesCount: 4, amountPerFamily: 60, totalAmount: 240, status: 'disbursed' },
      { id: 2, name: 'توزيع سلال غذائية - الفصل الأول', supportType: 'كوبون شراء', familiesCount: 3, amountPerFamily: 35, totalAmount: 105, status: 'approved' },
      { id: 3, name: 'دعم شهري - كبار السن', supportType: 'شحن محفظة إلكترونية', familiesCount: 2, amountPerFamily: 40, totalAmount: 80, status: 'pending_approval' },
      { id: 4, name: 'مساعدة الأيتام - دفعة تجريبية', supportType: 'نقدي', familiesCount: 2, amountPerFamily: 50, totalAmount: 100, status: 'pending_review' },
    ],

    bankAccounts: [
      { id: 1, name: 'الحساب الرئيسي', bank: 'بنك مسقط', balance: 14570 },
      { id: 2, name: 'حساب التوزيع', bank: 'بنك ظفار', balance: 7580 },
    ],

    expenses: [
      { id: 1, category: 'مستلزمات مكتبية', amount: 45, status: 'approved' },
      { id: 2, category: 'فواتير خدمات', amount: 120, status: 'approved' },
      { id: 3, category: 'صيانة', amount: 260, status: 'pending' },
      { id: 4, category: 'نفقات إدارية', amount: 90, status: 'pending' },
      { id: 5, category: 'أخرى', amount: 310, status: 'rejected' },
    ],

    ledger: [
      { id: 1, date: '2026-08-10', description: 'مساعدة عاجلة - خديجة بنت علي المعمرية', type: 'مساعدة عاجلة', debit: 150, credit: 0, reference: 'EXP-DEMO-00004' },
      { id: 2, date: '2026-08-09', description: 'مساعدة عاجلة - عبدالله بن حمد الغافري', type: 'مساعدة عاجلة', debit: 100, credit: 0, reference: 'EXP-DEMO-00005' },
      { id: 3, date: '2026-08-05', description: 'صرف حملة توزيع - رمضان ٢٠٢٦', type: 'دعم توزيع', debit: 240, credit: 0, reference: 'BULK-DEMO-00001' },
      { id: 4, date: '2026-08-02', description: 'مصروف إداري - فواتير خدمات', type: 'مصروف إداري', debit: 120, credit: 0, reference: 'ADM-DEMO-00002' },
      { id: 5, date: '2026-07-28', description: 'رصيد افتتاحي', type: 'إيداع', debit: 0, credit: 15000, reference: 'DEP-OPEN-1' },
    ],

    parcels: [
      { id: 1, tracking: 'TRK-DEMO-0001', beneficiary: 'محمد بن سالم الهنائي', content: 'سلة غذائية شهرية', status: 'prep' },
      { id: 2, tracking: 'TRK-DEMO-0002', beneficiary: 'فاطمة بنت راشد الكندية', content: 'سلة غذائية شهرية', status: 'ready' },
      { id: 3, tracking: 'TRK-DEMO-0003', beneficiary: 'سعيد بن خميس البلوشي', content: 'سلة غذائية شهرية', status: 'delivering' },
      { id: 4, tracking: 'TRK-DEMO-0004', beneficiary: 'خديجة بنت علي المعمرية', content: 'سلة غذائية شهرية', status: 'delivered' },
      { id: 5, tracking: 'TRK-DEMO-0005', beneficiary: 'عبدالله بن حمد الغافري', content: 'سلة غذائية شهرية', status: 'failed' },
    ],
    parcelColumns: [
      { key: 'prep', label: 'قيد التجهيز' },
      { key: 'ready', label: 'جاهز للتسليم' },
      { key: 'delivering', label: 'قيد التوصيل' },
      { key: 'delivered', label: 'تم التسليم' },
      { key: 'failed', label: 'تعذر التسليم' },
    ],
    parcelsByStatus(status) {
      return this.parcels.filter(p => p.status === status);
    },

    recentActivity: [
      { id: 1, icon: 'bi-truck-front', text: 'تم صرف مساعدة عاجلة لأسرة الغافري', when: 'منذ يومين' },
      { id: 2, icon: 'bi-bullseye', text: 'اعتماد حملة توزيع سلال غذائية', when: 'منذ 4 أيام' },
      { id: 3, icon: 'bi-house-add', text: 'تسجيل ملف أسرة جديد - العبري', when: 'منذ أسبوع' },
      { id: 4, icon: 'bi-truck', text: 'تعذر تسليم طرد - سيعاد جدولته', when: 'منذ أسبوع' },
    ],

    // ---------------------------------------------------------------
    // Derived data
    // ---------------------------------------------------------------
    get filteredFamilies() {
      if (this.familyFilter === 'urgent') return this.families.filter(f => f.priority === 'urgent');
      if (this.familyFilter === 'pending') return this.families.filter(f => f.reviewStatus !== 'approved');
      return this.families;
    },
    get pendingCount() {
      const famPending = this.families.filter(f => f.reviewStatus !== 'approved').length;
      const aidPending = this.urgentAids.filter(a => ['pending_review','pending_approval','approved'].includes(a.status)).length;
      return famPending + aidPending;
    },
    get monthDisbursed() {
      return this.urgentAids.filter(a => a.status === 'disbursed').reduce((s,a) => s + a.amount, 0)
           + this.campaigns.filter(c => c.status === 'disbursed').reduce((s,c) => s + c.totalAmount, 0);
    },
    get totalBankBalance() {
      return this.bankAccounts.reduce((s,a) => s + a.balance, 0);
    },
    get priorityBreakdown() {
      const total = this.families.length || 1;
      const groups = [
        { key: 'urgent', label: '🔴 أولوية قصوى', color: 'var(--zk-urgent)' },
        { key: 'medium', label: '🟡 أولوية متوسطة', color: 'var(--zk-medium)' },
        { key: 'low',    label: '🟢 أولوية منخفضة', color: 'var(--zk-low)' },
      ];
      return groups.map(g => {
        const count = this.families.filter(f => f.priority === g.key).length;
        return { ...g, count, pct: Math.round((count/total)*100) };
      });
    },

    // ---------------------------------------------------------------
    // Labels / badge helpers (mirror Model::statusLabel() in Laravel)
    // ---------------------------------------------------------------
    priorityLabel(p) {
      return { urgent: '🔴 قصوى', medium: '🟡 متوسط', low: '🟢 منخفض' }[p] || p;
    },
    reviewLabel(s) {
      return {
        approved: 'معتمد', pending_review: 'بانتظار المراجعة الميدانية',
        pending_approval: 'بانتظار اعتماد نائب المدير', rejected: 'مرفوض',
      }[s] || s;
    },
    reviewBadgeClass(s) {
      return { approved: 'low', pending_review: 'medium', pending_approval: 'medium', rejected: 'urgent' }[s] || 'medium';
    },
    statusLabel(s) {
      return {
        pending_review: 'بانتظار المراجعة الميدانية', pending_approval: 'بانتظار اعتماد نائب المدير',
        approved: 'معتمد — بانتظار الصرف', disbursed: 'تم الصرف', rejected: 'مرفوض',
        pending: 'بانتظار الاعتماد',
      }[s] || s;
    },
    statusBadgeClass(s) {
      return {
        pending_review: 'medium', pending_approval: 'medium', pending: 'medium',
        approved: 'low', disbursed: 'low', rejected: 'urgent',
      }[s] || 'medium';
    },
    fmt(n) {
      if (n === null || n === undefined) return '—';
      return Number(n).toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    },

    // ---------------------------------------------------------------
    // Modals
    // ---------------------------------------------------------------
    openFamily(f) { this.activeFamily = f; },
    openAid(a) { this.activeWorkflow = { ...a, kind: 'aid', title: 'مسار اعتماد: ' + a.beneficiary }; },
    openCampaign(c) { this.activeWorkflow = { ...c, kind: 'campaign', title: 'مسار اعتماد: ' + c.name }; },

    workflowSteps: [
      { key: 'pending_review',   label: 'تسجيل الطلب',            role: 'مدخل بيانات / باحث اجتماعي' },
      { key: 'pending_approval', label: 'المراجعة الميدانية',      role: 'الباحث الاجتماعي' },
      { key: 'approved',         label: 'الاعتماد النهائي',        role: 'نائب المدير' },
      { key: 'disbursed',        label: 'تنفيذ الصرف',             role: 'المحاسب / مدير النظام' },
    ],
    stepIndex(status) {
      const order = ['pending_review','pending_approval','approved','disbursed'];
      const i = order.indexOf(status);
      return i === -1 ? 0 : i;
    },
    canAdvance(item) {
      return item && !['disbursed','rejected'].includes(item.status);
    },
    nextActionLabel(item) {
      const map = {
        pending_review: 'اعتماد المراجعة الميدانية',
        pending_approval: 'اعتماد نائب المدير',
        approved: 'تنفيذ الصرف',
      };
      return map[item.status] || 'المتابعة';
    },
    advanceWorkflow() {
      const order = ['pending_review','pending_approval','approved','disbursed'];
      const i = order.indexOf(this.activeWorkflow.status);
      const next = order[Math.min(i+1, order.length-1)];
      this.activeWorkflow.status = next;

      const list = this.activeWorkflow.kind === 'aid' ? this.urgentAids : this.campaigns;
      const target = list.find(x => x.id === this.activeWorkflow.id);
      if (target) target.status = next;

      this.showToast(next === 'disbursed' ? 'تم تنفيذ الصرف بنجاح (تجريبي)' : 'تم الانتقال إلى المرحلة التالية (تجريبي)');
    },
    rejectWorkflow() {
      this.activeWorkflow.status = 'rejected';
      this.activeWorkflow.rejectionReason = 'مرفوض في وضع العرض التوضيحي';
      const list = this.activeWorkflow.kind === 'aid' ? this.urgentAids : this.campaigns;
      const target = list.find(x => x.id === this.activeWorkflow.id);
      if (target) { target.status = 'rejected'; target.rejectionReason = this.activeWorkflow.rejectionReason; }
      this.showToast('تم رفض الطلب (تجريبي)');
    },

    showToast(msg) {
      this.toast = msg;
      setTimeout(() => { this.toast = null; }, 2200);
    },
  };
}
