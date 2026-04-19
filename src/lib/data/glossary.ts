import type { CpaSection, Term } from '../types';

/**
 * Bulk term corpus extracted from references/Accounting Glossary for Iranian Immigrants.md
 * Organized per CPA Evolution (Foundational / FAR / AUD / REG / BAR / ISC / TCP).
 *
 * The `term()` helper keeps each entry compact and consistent. `createdAt` / `updatedAt`
 * are filled in by the seed runner so we don't bake timestamps into source.
 */
type TermInput = {
	slug: string;
	enTerm: string;
	enAcronym?: string;
	enExpansion?: string;
	enDef: string;
	faTerm: string;
	faDef: string;
	cpa: CpaSection;
	topic: string;
	difficulty?: 1 | 2 | 3 | 4 | 5;
	tags?: string[];
};

function term(t: TermInput): Term {
	return {
		slug: t.slug,
		itemType: 'term',
		en: {
			term: t.enTerm,
			...(t.enAcronym ? { acronym: t.enAcronym } : {}),
			...(t.enExpansion ? { expansion: t.enExpansion } : {}),
			definition: t.enDef
		},
		fa: {
			term: t.faTerm,
			definition: t.faDef
		},
		categories: Array.from(new Set([t.cpa, t.topic, ...(t.enAcronym ? ['Acronym'] : [])])),
		cpaSection: t.cpa,
		topic: t.topic,
		difficulty: t.difficulty ?? 2,
		...(t.tags ? { tags: t.tags } : {}),
		source: 'glossary-md-2026-04-18',
		lapsed: 0,
		lapseCount: 0,
		createdAt: 0,
		updatedAt: 0
	};
}

export const glossary: Term[] = [
	// ─── Foundational acronyms ──────────────────────────────────────────
	term({
		slug: 'aicpa',
		enTerm: 'AICPA',
		enAcronym: 'AICPA',
		enExpansion: 'American Institute of Certified Public Accountants',
		enDef:
			'The national professional organization for CPAs in the US. It sets ethical standards, US auditing standards for private companies, and develops the Uniform CPA Examination.',
		faTerm: 'انجمن حسابداران رسمی آمریکا',
		faDef:
			'بزرگ‌ترین نهاد حرفه‌ای حسابداری در آمریکا که مسئول تدوین استانداردهای اخلاقی، استانداردهای حسابرسی شرکت‌های خصوصی و طراحی آزمون سراسری CPA است.',
		cpa: 'Foundational',
		topic: 'Standards',
		difficulty: 1
	}),
	term({
		slug: 'fasb',
		enTerm: 'FASB',
		enAcronym: 'FASB',
		enExpansion: 'Financial Accounting Standards Board',
		enDef:
			'The independent, private-sector organization that establishes financial accounting and reporting standards (GAAP) for public and private companies in the US.',
		faTerm: 'هیئت استانداردهای حسابداری مالی',
		faDef:
			'سازمان مستقل بخش خصوصی که وظیفۀ تدوین استانداردهای حسابداری (GAAP) را برای شرکت‌های آمریکایی بر عهده دارد.',
		cpa: 'Foundational',
		topic: 'Standards',
		difficulty: 1
	}),
	term({
		slug: 'gaap',
		enTerm: 'GAAP',
		enAcronym: 'GAAP',
		enExpansion: 'Generally Accepted Accounting Principles',
		enDef:
			'The standard framework of guidelines for financial accounting in the US, distinct from IFRS. It includes the standards, conventions, and rules accountants follow.',
		faTerm: 'اصول پذیرفته‌شدۀ حسابداری (آمریکا)',
		faDef:
			'مجموعه‌ای از اصول و استانداردهای حسابداری که شرکت‌های آمریکایی ملزم به رعایت آن در تهیۀ صورت‌های مالی خود هستند.',
		cpa: 'Foundational',
		topic: 'Standards',
		difficulty: 1
	}),
	term({
		slug: 'sec',
		enTerm: 'SEC',
		enAcronym: 'SEC',
		enExpansion: 'Securities and Exchange Commission',
		enDef:
			'A federal regulatory agency responsible for protecting investors and maintaining fair securities markets; it has statutory authority to establish financial accounting standards but delegates this to FASB.',
		faTerm: 'کمیسیون بورس و اوراق بهادار آمریکا',
		faDef:
			'نهاد نظارتی فدرال که مسئولیت حفاظت از سرمایه‌گذاران و تنظیم بازارهای مالی را بر عهده دارد و گزارش‌های مالی شرکت‌های سهامی عام را بررسی می‌کند.',
		cpa: 'Foundational',
		topic: 'Regulators',
		difficulty: 1
	}),
	term({
		slug: 'cpa',
		enTerm: 'CPA',
		enAcronym: 'CPA',
		enExpansion: 'Certified Public Accountant',
		enDef:
			'A professional designation granted to accountants who have passed the Uniform CPA Exam and met state-specific education and experience requirements.',
		faTerm: 'حسابدار رسمی (حسابدار عمومی قسم‌خورده)',
		faDef:
			'گواهی‌نامۀ حرفه‌ای معتبر برای حسابدارانی که آزمون جامع CPA را با موفقیت گذرانده و شرایط تحصیلی و تجربی ایالتی را احراز کرده‌اند.',
		cpa: 'Foundational',
		topic: 'Credentials',
		difficulty: 1
	}),
	term({
		slug: 'balance-sheet',
		enTerm: 'Balance Sheet',
		enAcronym: 'BS',
		enExpansion: 'Balance Sheet',
		enDef:
			'A core financial statement reporting a company’s assets, liabilities, and shareholder equity at a specific point in time, adhering to the equation: Assets = Liabilities + Equity.',
		faTerm: 'ترازنامه',
		faDef:
			'یکی از صورت‌های مالی اساسی که دارایی‌ها، بدهی‌ها و حقوق صاحبان سهام را در یک تاریخ مشخص نشان می‌دهد.',
		cpa: 'Foundational',
		topic: 'Statements',
		difficulty: 1
	}),
	term({
		slug: 'income-statement',
		enTerm: 'Income Statement',
		enAcronym: 'IS',
		enExpansion: 'Income Statement (Profit & Loss)',
		enDef:
			'A financial statement focusing on revenues and expenses during a particular period, indicating how revenues are transformed into net income.',
		faTerm: 'صورت سود و زیان',
		faDef:
			'صورت مالی که عملکرد شرکت را در یک دورۀ زمانی با کسر هزینه‌ها از درآمدها برای محاسبۀ سود خالص نشان می‌دهد.',
		cpa: 'Foundational',
		topic: 'Statements',
		difficulty: 1
	}),
	term({
		slug: 'cash-flow-statement',
		enTerm: 'Cash Flow Statement',
		enAcronym: 'CFS',
		enExpansion: 'Cash Flow Statement',
		enDef:
			'A report providing aggregate data regarding all cash inflows and outflows, segmented into operating, investing, and financing activities.',
		faTerm: 'صورت جریان‌های نقدی',
		faDef:
			'گزارشی که جریان‌های ورودی و خروجی وجه نقد را در سه بخش عملیاتی، سرمایه‌گذاری و تأمین مالی تفکیک می‌کند.',
		cpa: 'Foundational',
		topic: 'Statements',
		difficulty: 2
	}),
	term({
		slug: 'accounts-receivable',
		enTerm: 'Accounts Receivable',
		enAcronym: 'AR',
		enExpansion: 'Accounts Receivable',
		enDef:
			'The balance of money due to a firm for goods or services delivered or used but not yet paid for by customers, listed as a current asset.',
		faTerm: 'حساب‌های دریافتنی',
		faDef:
			'مبالغی که شرکت بابت فروش کالا یا خدمات به‌صورت نسیه از مشتریان خود طلب‌کار است و به‌عنوان دارایی جاری ثبت می‌شود.',
		cpa: 'Foundational',
		topic: 'Balance Sheet',
		difficulty: 1
	}),
	term({
		slug: 'accounts-payable',
		enTerm: 'Accounts Payable',
		enAcronym: 'AP',
		enExpansion: 'Accounts Payable',
		enDef:
			'A company’s obligation to pay off a short-term debt to its creditors or suppliers, appearing as a current liability.',
		faTerm: 'حساب‌های پرداختنی',
		faDef:
			'بدهی‌های کوتاه‌مدت شرکت به تأمین‌کنندگان بابت خریدهای نسیه که در بخش بدهی‌های جاری ترازنامه گزارش می‌شود.',
		cpa: 'Foundational',
		topic: 'Balance Sheet',
		difficulty: 1
	}),
	term({
		slug: 'cogs',
		enTerm: 'COGS',
		enAcronym: 'COGS',
		enExpansion: 'Cost of Goods Sold',
		enDef:
			'The direct costs attributable to the production of the goods sold in a company, including raw materials and direct labor.',
		faTerm: 'بهای تمام‌شدۀ کالای فروش‌رفته',
		faDef:
			'هزینه‌های مستقیمی که برای تولید کالاهای فروش‌رفته صرف شده است، شامل مواد اولیه و دستمزد مستقیم کارگران.',
		cpa: 'Foundational',
		topic: 'Income Statement',
		difficulty: 2
	}),
	term({
		slug: 'net-income',
		enTerm: 'Net Income',
		enAcronym: 'NI',
		enExpansion: 'Net Income',
		enDef:
			'A company’s total profit over a specific period, calculated by subtracting total costs and expenses from total revenue.',
		faTerm: 'سود خالص',
		faDef:
			'سود نهایی شرکت که پس از کسر تمامی هزینه‌ها، مالیات و بهره از کل درآمدها به دست می‌آید.',
		cpa: 'Foundational',
		topic: 'Income Statement',
		difficulty: 1
	}),
	term({
		slug: 'ebitda',
		enTerm: 'EBITDA',
		enAcronym: 'EBITDA',
		enExpansion: 'Earnings Before Interest, Taxes, Depreciation, and Amortization',
		enDef:
			'An indicator of a company’s financial performance and profitability, stripping out non-cash depreciation and amortization expenses, as well as financing and tax costs.',
		faTerm: 'سود قبل از بهره، مالیات، و استهلاک',
		faDef:
			'شاخصی برای ارزیابی عملکرد عملیاتی و سودآوری شرکت که هزینه‌های غیرنقدی استهلاک و همچنین هزینه‌های تأمین مالی و مالیات را نادیده می‌گیرد.',
		cpa: 'Foundational',
		topic: 'Performance',
		difficulty: 3
	}),
	term({
		slug: 'general-ledger',
		enTerm: 'General Ledger',
		enAcronym: 'GL',
		enExpansion: 'General Ledger',
		enDef:
			'The master set of accounts that summarize all transactions occurring within an entity, serving as the foundation for the trial balance and financial statements.',
		faTerm: 'دفتر کل',
		faDef:
			'مجموعه‌ حساب‌هایی که تمامی تراکنش‌های مالی شرکت در آن‌ها خلاصه شده و پایۀ تهیۀ تراز آزمایشی و صورت‌های مالی است.',
		cpa: 'Foundational',
		topic: 'Bookkeeping',
		difficulty: 2
	}),
	term({
		slug: 'roi',
		enTerm: 'ROI',
		enAcronym: 'ROI',
		enExpansion: 'Return on Investment',
		enDef:
			'A performance measure used to evaluate the efficiency of an investment, calculated by dividing the benefit (or return) of an investment by its cost.',
		faTerm: 'بازده سرمایه‌گذاری',
		faDef:
			'شاخصی برای ارزیابی کارایی یک سرمایه‌گذاری که از تقسیم سود حاصله بر هزینۀ اولیۀ سرمایه‌گذاری به دست می‌آید.',
		cpa: 'Foundational',
		topic: 'Performance',
		difficulty: 2
	}),
	term({
		slug: 'fifo',
		enTerm: 'FIFO',
		enAcronym: 'FIFO',
		enExpansion: 'First In, First Out',
		enDef:
			'An inventory valuation method where the first goods purchased are assumed to be the first goods sold. Unlike IFRS, US GAAP also permits the LIFO (Last In, First Out) method.',
		faTerm: 'اولین صادره از اولین وارده (فایفو)',
		faDef:
			'روش ارزیابی موجودی کالا که فرض می‌کند قدیمی‌ترین کالاها زودتر به فروش می‌رسند. برخلاف استانداردهای بین‌المللی، استفاده از روش لایفو نیز در آمریکا مجاز است.',
		cpa: 'Foundational',
		topic: 'Inventory',
		difficulty: 2
	}),

	// ─── FAR Core ───────────────────────────────────────────────────────
	term({
		slug: 'accrual-basis',
		enTerm: 'Accrual Basis of Accounting',
		enDef:
			'An accounting method where revenues are recognized when earned (control transfers) and expenses are recognized when incurred, regardless of cash flow timing. This is a strict requirement for US GAAP.',
		faTerm: 'مبنای حسابداری تعهدی',
		faDef:
			'سیستمی که در آن درآمدها به‌محض تحقق (ایفای تعهد) و هزینه‌ها به‌محض تحمل شناسایی می‌شوند، فارغ از اینکه وجه نقدی دریافت یا پرداخت شده باشد.',
		cpa: 'FAR',
		topic: 'Recognition',
		difficulty: 2,
		tags: ['fundamental']
	}),
	term({
		slug: 'revenue-recognition-asc606',
		enTerm: 'Revenue Recognition (ASC 606)',
		enDef:
			'The standard mandating a 5-step model: 1) Identify contract, 2) Identify performance obligations, 3) Determine transaction price, 4) Allocate price, 5) Recognize revenue as obligations are satisfied.',
		faTerm: 'شناسایی درآمد (استاندارد ASC 606)',
		faDef:
			'استاندارد جدیدی که یک مدل پنج‌مرحله‌ای برای شناسایی درآمد معرفی کرده؛ محوریت آن شناسایی درآمد در زمان ایفای تعهدات عملکردی در قبال مشتری است.',
		cpa: 'FAR',
		topic: 'Revenue',
		difficulty: 3,
		tags: ['recent-standard']
	}),
	term({
		slug: 'rou-asset',
		enTerm: 'Right-of-Use (ROU) Asset',
		enAcronym: 'ROU',
		enExpansion: 'Right-of-Use Asset (ASC 842)',
		enDef:
			'An asset representing a lessee’s right to use an underlying asset for the lease term. Under ASC 842, virtually all leases create an ROU asset and a corresponding lease liability on the balance sheet.',
		faTerm: 'دارایی حق استفاده',
		faDef:
			'دارایی‌ای که نشان‌دهندۀ حق مستأجر برای استفاده از یک دارایی پایه در طول دورۀ اجاره است. طبق استاندارد جدید (ASC 842)، این رقم باید حتماً در ترازنامه گزارش شود.',
		cpa: 'FAR',
		topic: 'Leases',
		difficulty: 4,
		tags: ['recent-standard']
	}),
	term({
		slug: 'comprehensive-income',
		enTerm: 'Comprehensive Income',
		enDef:
			'The change in equity from non-owner sources. It comprises Net Income plus Other Comprehensive Income (OCI) items, such as foreign currency translation adjustments and unrealized gains on available-for-sale securities.',
		faTerm: 'سود و زیان جامع',
		faDef:
			'کل تغییرات حقوق صاحبان سهام که ناشی از مبادلات با مالکان نباشد. این رقم شامل سود خالص به‌علاوۀ اقلام سایر سود و زیان جامع (OCI) مانند تسعیر ارز است.',
		cpa: 'FAR',
		topic: 'Equity',
		difficulty: 3
	}),
	term({
		slug: 'allowance-doubtful-accounts',
		enTerm: 'Allowance for Doubtful Accounts',
		enDef:
			'A contra-asset account that reduces total accounts receivable to its estimated net realizable value, representing management’s estimate of uncollectible receivables.',
		faTerm: 'ذخیرۀ مطالبات مشکوک‌الوصول',
		faDef:
			'یک حساب کاهندۀ دارایی که از حساب‌های دریافتنی کسر می‌شود تا ماندۀ آن را به ارزش خالص بازیافتنی کاهش دهد و نشان‌دهندۀ برآورد مدیریت از مطالبات سوخت‌شده است.',
		cpa: 'FAR',
		topic: 'Receivables',
		difficulty: 3
	}),
	term({
		slug: 'goodwill',
		enTerm: 'Goodwill',
		enDef:
			'An intangible asset recognized in a business combination when the purchase price exceeds the fair value of acquired identifiable net assets. Under GAAP, it is not amortized but tested annually for impairment.',
		faTerm: 'سرقفلی',
		faDef:
			'دارایی نامشهودی که در زمان ترکیب‌های تجاری ایجاد می‌شود، زمانی که مبلغ پرداختی بیشتر از ارزش منصفانۀ خالص دارایی‌های قابل شناسایی باشد. در GAAP، سرقفلی مستهلک نمی‌شود بلکه سالانه آزمون کاهش ارزش می‌پذیرد.',
		cpa: 'FAR',
		topic: 'Intangibles',
		difficulty: 3
	}),
	term({
		slug: 'impairment',
		enTerm: 'Impairment',
		enDef:
			'Occurs when the carrying amount of an asset exceeds its recoverable amount. GAAP dictates a two-step test for long-lived assets (recoverability, then fair value measurement).',
		faTerm: 'کاهش ارزش دارایی‌ها',
		faDef:
			'زمانی رخ می‌دهد که ارزش دفتری یک دارایی از مبلغ بازیافتنی آن بیشتر شود. در این حالت باید زیان کاهش ارزش شناسایی شده و ارزش دارایی در ترازنامه تعدیل گردد.',
		cpa: 'FAR',
		topic: 'Measurement',
		difficulty: 3
	}),
	term({
		slug: 'deferred-tax-asset',
		enTerm: 'Deferred Tax Asset (DTA)',
		enAcronym: 'DTA',
		enExpansion: 'Deferred Tax Asset',
		enDef:
			'A future tax benefit arising from temporary differences or net operating loss carryforwards that will reduce taxable income in future periods.',
		faTerm: 'دارایی مالیات انتقالی (معوق)',
		faDef:
			'مزیت مالیاتی آتی که ناشی از تفاوت‌های موقتی بین سود حسابداری و سود مشمول مالیات است و باعث کاهش مالیات پرداختی در سال‌های آینده خواهد شد.',
		cpa: 'FAR',
		topic: 'Taxes',
		difficulty: 4
	}),
	term({
		slug: 'fair-value-hierarchy',
		enTerm: 'Fair Value Hierarchy (ASC 820)',
		enDef:
			'A framework prioritizing inputs for fair value measurement into three levels: Level 1 (active market quotes), Level 2 (observable inputs), and Level 3 (unobservable, entity-derived assumptions).',
		faTerm: 'سلسله‌مراتب ارزش منصفانه',
		faDef:
			'چارچوبی که ورودی‌های محاسبۀ ارزش منصفانه را به سه سطح دسته‌بندی می‌کند: سطح ۱ (قیمت‌های بازار فعال)، سطح ۲ (داده‌های قابل مشاهده) و سطح ۳ (مفروضات ذهنی مدیریت).',
		cpa: 'FAR',
		topic: 'Measurement',
		difficulty: 4
	}),

	// ─── AUD Core ───────────────────────────────────────────────────────
	term({
		slug: 'coso-internal-control',
		enTerm: 'Internal Control (COSO Framework)',
		enDef:
			'Processes designed to provide reasonable assurance regarding the achievement of objectives. The COSO framework requires five components: Control Environment, Risk Assessment, Control Activities, Information/Communication, and Monitoring.',
		faTerm: 'کنترل‌های داخلی (چارچوب کوزو)',
		faDef:
			'فرآیندهایی که برای ارائۀ اطمینان معقول از دستیابی به اهداف سازمانی طراحی شده‌اند. چارچوب کوزو شامل پنج جزء اصلی است: محیط کنترلی، ارزیابی ریسک، فعالیت‌های کنترلی، اطلاعات و ارتباطات، و نظارت.',
		cpa: 'AUD',
		topic: 'Controls',
		difficulty: 3
	}),
	term({
		slug: 'clean-opinion',
		enTerm: 'Clean Opinion / Unqualified Opinion',
		enDef:
			'The optimal audit report, signifying that the auditor concludes the financial statements present fairly, in all material respects, the financial position of the entity in accordance with GAAP.',
		faTerm: 'اظهارنظر مقبول (بدون شرط)',
		faDef:
			'بهترین نوع گزارش حسابرسی که نشان می‌دهد صورت‌های مالی در تمام جنبه‌های بااهمیت، وضعیت مالی شرکت را طبق استانداردهای حسابداری به‌درستی نشان می‌دهند.',
		cpa: 'AUD',
		topic: 'Opinions',
		difficulty: 2
	}),
	term({
		slug: 'adverse-opinion',
		enTerm: 'Adverse Opinion',
		enDef:
			'An auditor’s report stating that the financial statements are misrepresented, misstated, and do not accurately reflect the company’s financial performance or health.',
		faTerm: 'اظهارنظر مردود',
		faDef:
			'گزارش حسابرسی که بیان می‌کند صورت‌های مالی دارای تحریفات اساسی و فراگیر بوده و وضعیت مالی شرکت را به‌درستی منعکس نمی‌کنند.',
		cpa: 'AUD',
		topic: 'Opinions',
		difficulty: 3
	}),
	term({
		slug: 'material-misstatement',
		enTerm: 'Material Misstatement',
		enDef:
			'An error, omission, or fraud in the financial statements that is significant enough to alter the economic decisions of a reasonable user relying on those statements.',
		faTerm: 'تحریف بااهمیت',
		faDef:
			'اشتباه، از قلم‌افتادگی یا تقلبی در صورت‌های مالی که به‌قدری بزرگ است که می‌تواند بر تصمیمات اقتصادی استفاده‌کنندگان از آن گزارش‌ها تأثیر بگذارد.',
		cpa: 'AUD',
		topic: 'Risk',
		difficulty: 3
	}),
	term({
		slug: 'substantive-procedures',
		enTerm: 'Substantive Procedures',
		enDef:
			'Audit steps designed to detect material misstatements at the assertion level. These include detailed tests of transactions, account balances, and disclosures.',
		faTerm: 'آزمون‌های محتوایی (اثباتی)',
		faDef:
			'فرآیندهای حسابرسی که مستقیماً برای کشف تحریف‌های بااهمیت در ماندۀ حساب‌ها و گروه معاملات طراحی می‌شوند؛ شامل بررسی دقیق اسناد و مدارک.',
		cpa: 'AUD',
		topic: 'Procedures',
		difficulty: 3
	}),
	term({
		slug: 'reasonable-assurance',
		enTerm: 'Reasonable Assurance',
		enDef:
			'A high, but not absolute, level of assurance that financial statements are free of material misstatement. Auditors cannot provide absolute assurance due to inherent limitations in testing.',
		faTerm: 'اطمینان معقول',
		faDef:
			'سطح بالایی از اطمینان (اما نه مطلق) که حسابرسان در مورد عاری‌بودن صورت‌های مالی از تحریف بااهمیت ارائه می‌دهند. به‌دلیل محدودیت‌های ذاتی، اطمینان ۱۰۰ درصدی غیرممکن است.',
		cpa: 'AUD',
		topic: 'Assurance',
		difficulty: 2
	}),

	// ─── REG Core ───────────────────────────────────────────────────────
	term({
		slug: 'c-corporation',
		enTerm: 'C-Corporation',
		enDef:
			'A standard legal corporation subject to "double taxation": the entity pays corporate income tax on profits, and shareholders pay individual tax on distributed dividends.',
		faTerm: 'شرکت سهامی (مشمول مالیات مضاعف)',
		faDef:
			'نوع استاندارد شرکت سهامی در آمریکا که مشمول «مالیات مضاعف» است؛ یعنی ابتدا خود شرکت روی سود خود مالیات می‌دهد و سپس سهامداران بابت سود تقسیمی مالیات پرداخت می‌کنند.',
		cpa: 'REG',
		topic: 'Entities',
		difficulty: 2
	}),
	term({
		slug: 'flow-through-entity',
		enTerm: 'Flow-Through Entity (Pass-Through)',
		enDef:
			'Entities like Partnerships and S-Corporations that do not pay corporate tax. Instead, business income, losses, deductions, and credits pass through to the owners’ individual tax returns.',
		faTerm: 'واحد تجاری با مالیات انتقالی',
		faDef:
			'شرکت‌هایی (مانند تضامنی و سهامی نوع S) که خودشان مالیات بر درآمد شرکتی نمی‌دهند. سود و زیان آن‌ها مستقیماً به مالکان منتقل شده و مالکان شخصاً مالیات آن را می‌پردازند.',
		cpa: 'REG',
		topic: 'Entities',
		difficulty: 3
	}),
	term({
		slug: 's-corporation',
		enTerm: 'S-Corporation',
		enDef:
			'A closely held corporation that elects to be taxed as a flow-through entity under Subchapter S of the Internal Revenue Code, bypassing corporate double taxation while maintaining limited liability.',
		faTerm: 'شرکت سهامی نوع S',
		faDef:
			'یک شرکت سهامی خاص که تصمیم می‌گیرد تحت فصل S قانون مالیات آمریکا به‌عنوان واحد انتقالی شناخته شود تا ضمن حفظ سپر مسئولیت محدود، از پرداخت مالیات مضاعف معاف گردد.',
		cpa: 'REG',
		topic: 'Entities',
		difficulty: 3
	}),
	term({
		slug: 'agi',
		enTerm: 'Adjusted Gross Income',
		enAcronym: 'AGI',
		enExpansion: 'Adjusted Gross Income',
		enDef:
			'An individual’s total gross income minus specific "above-the-line" deductions (e.g., specific retirement contributions). AGI is the critical baseline used to calculate US individual tax liability.',
		faTerm: 'درآمد ناخالص تعدیل‌شده',
		faDef:
			'کل درآمد ناخالص فرد منهای برخی کسورات اولیۀ خاص. این رقم بسیار مهم است زیرا بسیاری از معافیت‌ها و سقف‌های مالیاتی در آمریکا بر اساس آن محاسبه می‌شوند.',
		cpa: 'REG',
		topic: 'Individual Tax',
		difficulty: 2
	}),
	term({
		slug: 'capital-gain-loss',
		enTerm: 'Capital Gain / Loss',
		enDef:
			'The profit or loss realized from the sale of a non-inventory capital asset (like stocks or real estate). Long-term capital gains often receive favorable tax rates compared to ordinary income.',
		faTerm: 'سود / زیان سرمایه‌ای',
		faDef:
			'سود یا زیانی که از فروش دارایی‌های سرمایه‌ای (غیرموجودی کالا، مانند سهام یا املاک) حاصل می‌شود. سودهای سرمایه‌ای بلندمدت معمولاً با نرخ مالیاتی کمتری نسبت به درآمد عادی محاسبه می‌شوند.',
		cpa: 'REG',
		topic: 'Property',
		difficulty: 3
	}),

	// ─── BAR Discipline ─────────────────────────────────────────────────
	term({
		slug: 'fund-accounting',
		enTerm: 'Fund Accounting',
		enDef:
			'An accounting system used by governments and nonprofits to segregate resources into separate financial entities (funds) based on legal restrictions and intended purposes.',
		faTerm: 'حسابداری وجوه مستقل',
		faDef:
			'سیستم حسابداری مورد استفادۀ دولت‌ها که منابع را بر اساس محدودیت‌های قانونی و اهداف از پیش تعیین‌شده در صندوق‌ها یا نهادهای مالی جداگانه‌ای تفکیک و کنترل می‌کند.',
		cpa: 'BAR',
		topic: 'Government',
		difficulty: 3
	}),
	term({
		slug: 'modified-accrual',
		enTerm: 'Modified Accrual Basis',
		enDef:
			'Used in governmental funds, recognizing revenue only when it is both "measurable" and "available" to spend, and recognizing expenditures when the related liability is incurred.',
		faTerm: 'مبنای حسابداری نیمه‌تعهدی (تعدیل‌شده)',
		faDef:
			'مبنایی که در صندوق‌های دولتی استفاده می‌شود؛ درآمدها تنها زمانی شناسایی می‌شوند که «قابل اندازه‌گیری» و «در دسترس» باشند، و مخارج به‌محض ایجاد بدهی ثبت می‌گردند.',
		cpa: 'BAR',
		topic: 'Government',
		difficulty: 4
	}),

	// ─── ISC Discipline ─────────────────────────────────────────────────
	term({
		slug: 'soc-reports',
		enTerm: 'System and Organization Controls (SOC) Reports',
		enAcronym: 'SOC',
		enExpansion: 'System and Organization Controls Reports',
		enDef:
			'Independent audit reports assessing a service organization’s controls. SOC 1 focuses on financial reporting controls; SOC 2 focuses on security, availability, and confidentiality.',
		faTerm: 'گزارش‌های کنترل سیستم و سازمان',
		faDef:
			'گزارش‌های حسابرسی مستقلی که کنترل‌های یک سازمان ارائه‌دهندۀ خدمات فناوری را ارزیابی می‌کنند. نوع ۱ بر گزارشگری مالی و نوع ۲ بر امنیت اطلاعات و محرمانگی تمرکز دارد.',
		cpa: 'ISC',
		topic: 'IT Audit',
		difficulty: 3
	}),
	term({
		slug: 'data-governance',
		enTerm: 'Data Governance',
		enDef:
			'The overarching enterprise management of the availability, usability, integrity, and security of data, ensuring data is treated as a highly protected corporate asset.',
		faTerm: 'حاکمیت داده‌ها',
		faDef:
			'مدیریت جامع سازمانی بر میزان در‌دسترس‌بودن، یکپارچگی، کاربری و امنیت داده‌ها، تا اطمینان حاصل شود که داده‌ها به‌عنوان یک دارایی بسیار ارزشمند محافظت می‌شوند.',
		cpa: 'ISC',
		topic: 'Security',
		difficulty: 3
	}),

	// ─── TCP Discipline ─────────────────────────────────────────────────
	term({
		slug: 'tax-planning-vs-compliance',
		enTerm: 'Tax Planning vs. Tax Compliance',
		enDef:
			'Compliance involves accurately reporting past events to the IRS. Planning is the strategic structuring of future transactions to legally minimize impending tax liabilities.',
		faTerm: 'برنامه‌ریزی مالیاتی در برابر تمکین مالیاتی',
		faDef:
			'تمکین به‌معنای گزارش دقیق رویدادهای گذشته به ادارۀ مالیات است، اما برنامه‌ریزی یک اقدام استراتژیک برای ساختاردهی به معاملات آینده جهت کاهش قانونی بدهی مالیاتی است.',
		cpa: 'TCP',
		topic: 'Strategy',
		difficulty: 3
	}),
	term({
		slug: 'estate-gift-tax',
		enTerm: 'Estate and Gift Taxation',
		enDef:
			'Federal taxes levied on the transfer of wealth during life (gift) or at death (estate). TCP tests strategies using trusts and lifetime exemptions to protect intergenerational wealth.',
		faTerm: 'مالیات بر ارث و هدایا',
		faDef:
			'مالیات فدرال بر انتقال ثروت در زمان حیات (هدیه) یا پس از مرگ (ارث). در برنامه‌ریزی، از صندوق‌های امانی و معافیت‌های قانونی برای حفظ ثروت بین‌نسلی استفاده می‌شود.',
		cpa: 'TCP',
		topic: 'Wealth Transfer',
		difficulty: 4
	})
];
