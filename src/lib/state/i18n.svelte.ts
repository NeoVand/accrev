import { browser } from '$app/environment';

export type Lang = 'en' | 'fa';

const STORAGE_KEY = 'accrev:lang';

type MsgValue = string | ((...args: never[]) => string);

const en = {
	welcome_back: 'welcome back',
	ellie: 'Ellie',
	jooon: 'jooon',
	study_streak: 'study streak',
	begin_today: 'Begin today',
	days: (n: number) => (n === 1 ? '1 day' : `${n} days`),
	cards_waiting: (n: number) =>
		n === 1 ? '1 card waiting for you' : `${n} cards waiting for you`,
	couldnt_recall: "couldn’t recall",
	review_tripped: 'Review what tripped you up',
	cards_in_recall: (n: number) =>
		n === 1 ? '1 card waiting in your recall deck' : `${n} cards waiting in your recall deck`,
	decks: 'decks',
	foundational: 'Foundational',
	foundational_sub: 'Acronyms',
	far_core: 'FAR Core',
	far_sub: 'Financial reporting',
	cards: 'cards',
	begin_session: 'begin a study session',
	study: 'study',
	recall_couldnt: 'recall · couldn’t answer',
	show_hint: 'show hint',
	reveal_answer: 'reveal answer',
	forgot: 'Forgot',
	hard: 'Hard',
	got_it: 'Got it',
	easy: 'Easy',
	how_well: 'How well did you know it?',
	session_complete: 'Session complete.',
	study_again: 'study again',
	nothing_to_recall: 'Nothing to recall.',
	recall_empty_body:
		'Your recall deck is empty. Cards land here when you mark them Forgot, and leave once you grade them Got it or Easy.',
	study_full_deck: 'study the full deck',
	nav_home: 'Home',
	nav_study: 'Study',
	nav_progress: 'Progress',
	nav_settings: 'Settings',
	of: 'of',
	hear_pronunciation: 'Hear pronunciation',
	help_title: 'How grading works',
	help_intro: 'After each card, tell accrev how well you knew it. The schedule adapts to you.',
	help_forgot: 'You couldn’t recall — the card returns very soon, and lands in your recall deck.',
	help_hard: 'You knew it, but it was a struggle — accrev shows it again sooner than usual.',
	help_got_it: 'You knew it with normal effort — standard spacing.',
	help_easy: 'You knew it instantly — accrev stretches the interval before you see it again.',
	help_close: 'got it',
	preferences: 'Preferences',
	settings_eyebrow: 'settings',
	theme: 'theme',
	light: 'light',
	dark: 'dark',
	system: 'system',
	progress_eyebrow: 'progress',
	progress_title: 'Calendar & mastery',
	progress_body: 'Streak heatmap, words mastered, and category coverage land in Phase 3.',
	settings_more:
		'More settings (font size, default language, data export) arrive with later phases.',
	score_label: 'score',
	xp_label: 'xp earned',
	xp_value: (n: number) => `+${n}`,
	streak_today: (n: number) => (n === 1 ? 'Day 1 — streak started' : `Day ${n} of your streak`),
	breakdown_label: 'breakdown',
	lapses_added: (n: number) =>
		n === 0
			? 'Nothing to recall — nice.'
			: n === 1
				? '1 card went to your recall deck'
				: `${n} cards went to your recall deck`,
	back_home: 'back to home',
	level_label: (n: number) => `Level ${n}`,

	// Session picker
	picker_eyebrow: 'set up',
	picker_title: 'Your study session',
	picker_deck_label: 'deck',
	picker_size_label: 'how many',
	picker_direction_label: 'direction',
	picker_size_all: 'all',
	picker_start: 'start session',
	picker_change: 'change',
	deck_all: 'All topics',
	mixed: 'Mixed',

	// CPA section names + subtitles
	cpa_foundational: 'Foundational',
	cpa_foundational_sub: 'Acronyms & basics',
	cpa_far: 'FAR Core',
	cpa_far_sub: 'Financial reporting',
	cpa_aud: 'AUD Core',
	cpa_aud_sub: 'Auditing & attestation',
	cpa_reg: 'REG Core',
	cpa_reg_sub: 'Regulation & tax',
	cpa_bar: 'BAR',
	cpa_bar_sub: 'Business analysis',
	cpa_isc: 'ISC',
	cpa_isc_sub: 'Information systems',
	cpa_tcp: 'TCP',
	cpa_tcp_sub: 'Tax compliance',

	// Progress page
	your_numbers: 'Your numbers',
	progress_streak: 'streak',
	progress_xp: 'total xp',
	progress_level: 'level',
	progress_heatmap_label: 'last 8 weeks',
	progress_mastery_label: 'mastery by section',
	progress_sessions_label: 'recent sessions',
	progress_no_sessions: 'No sessions yet — start your first one.',
	mastery_progress: (m: number, total: number) => `${m} of ${total} mastered`,
	session_score: (correct: number, total: number) => `${correct}/${total}`,
	mastered_label: 'mastered'
} as const satisfies Record<string, MsgValue>;

type MessageKey = keyof typeof en;

const fa: Record<MessageKey, MsgValue> = {
	welcome_back: 'خوش برگشتی',
	ellie: 'الی',
	jooon: 'جون',
	study_streak: 'دنبالۀ مطالعه',
	begin_today: 'امروز شروع کن',
	days: (n: number) => `${n} روز`,
	cards_waiting: (n: number) => `${n} کارت منتظرته`,
	couldnt_recall: 'یادت نیومد',
	review_tripped: 'مرور چیزایی که گیر افتادی',
	cards_in_recall: (n: number) => `${n} کارت تو دستۀ مرور منتظره`,
	decks: 'دسته‌ها',
	foundational: 'پایه',
	foundational_sub: 'سرواژه‌ها',
	far_core: 'هستۀ FAR',
	far_sub: 'گزارشگری مالی',
	cards: 'کارت',
	begin_session: 'شروع جلسۀ مطالعه',
	study: 'مطالعه',
	recall_couldnt: 'مرور · جواب ندادی',
	show_hint: 'نمایش راهنما',
	reveal_answer: 'دیدن پاسخ',
	forgot: 'یادم رفت',
	hard: 'سخت',
	got_it: 'بلدم',
	easy: 'راحت',
	how_well: 'چقدر بلدش بودی؟',
	session_complete: 'جلسه تموم شد.',
	study_again: 'دوباره مطالعه',
	nothing_to_recall: 'چیزی برای مرور نیست.',
	recall_empty_body:
		'دستۀ مرورت خالیه. وقتی کارتی رو «یادم رفت» بزنی این‌جا میاد، و وقتی «بلدم» یا «راحت» بزنی می‌ره.',
	study_full_deck: 'مطالعۀ همۀ کارت‌ها',
	nav_home: 'خانه',
	nav_study: 'مطالعه',
	nav_progress: 'پیشرفت',
	nav_settings: 'تنظیمات',
	of: 'از',
	hear_pronunciation: 'تلفظ رو بشنو',
	help_title: 'سیستم امتیازدهی',
	help_intro: 'بعد هر کارت، بگو چقدر بلدش بودی. accrev زمان‌بندی رو با تو هماهنگ می‌کنه.',
	help_forgot: 'یادت نیومد — به‌زودی دوباره نشون داده می‌شه و تو دستۀ مرور قرار می‌گیره.',
	help_hard: 'بلد بودی ولی به‌زور — زودتر از معمول دوباره نشون داده می‌شه.',
	help_got_it: 'با تلاش عادی بلدش بودی — فاصلۀ استاندارد.',
	help_easy: 'فوری بلدش بودی — accrev فاصله رو بیشتر می‌کنه.',
	help_close: 'فهمیدم',
	preferences: 'ترجیحات',
	settings_eyebrow: 'تنظیمات',
	theme: 'پوسته',
	light: 'روشن',
	dark: 'تیره',
	system: 'سیستم',
	progress_eyebrow: 'پیشرفت',
	progress_title: 'تقویم و تسلط',
	progress_body: 'نقشۀ دنباله، کلمات یاد‌گرفته‌شده، و پوشش دسته‌ها در فاز ۳ میاد.',
	settings_more: 'تنظیمات بیشتر (اندازۀ متن، زبان پیش‌فرض، خروجی داده) در فازهای بعدی میاد.',
	score_label: 'امتیاز',
	xp_label: 'تجربۀ کسب‌شده',
	xp_value: (n: number) => `+${n}`,
	streak_today: (n: number) => (n === 1 ? 'روز ۱ — دنباله شروع شد' : `روز ${n} از دنباله‌ت`),
	breakdown_label: 'ریز نتایج',
	lapses_added: (n: number) =>
		n === 0
			? 'چیزی برای مرور نیست — عالی.'
			: n === 1
				? '۱ کارت به دستۀ مرور اضافه شد'
				: `${n} کارت به دستۀ مرور اضافه شد`,
	back_home: 'بازگشت به خانه',
	level_label: (n: number) => `سطح ${n}`,

	picker_eyebrow: 'تنظیم',
	picker_title: 'جلسۀ مطالعۀ تو',
	picker_deck_label: 'دسته',
	picker_size_label: 'چندتا کارت',
	picker_direction_label: 'جهت',
	picker_size_all: 'همه',
	picker_start: 'شروع جلسه',
	picker_change: 'تغییر',
	deck_all: 'همۀ موضوعات',
	mixed: 'مختلط',

	cpa_foundational: 'پایه',
	cpa_foundational_sub: 'سرواژه‌ها و مبانی',
	cpa_far: 'هستۀ FAR',
	cpa_far_sub: 'گزارشگری مالی',
	cpa_aud: 'هستۀ AUD',
	cpa_aud_sub: 'حسابرسی و اطمینان‌بخشی',
	cpa_reg: 'هستۀ REG',
	cpa_reg_sub: 'مقررات و مالیات',
	cpa_bar: 'BAR',
	cpa_bar_sub: 'تحلیل کسب‌وکار',
	cpa_isc: 'ISC',
	cpa_isc_sub: 'سیستم‌های اطلاعاتی',
	cpa_tcp: 'TCP',
	cpa_tcp_sub: 'تمکین مالیاتی',

	your_numbers: 'اعداد تو',
	progress_streak: 'دنباله',
	progress_xp: 'کل تجربه',
	progress_level: 'سطح',
	progress_heatmap_label: '۸ هفتۀ گذشته',
	progress_mastery_label: 'تسلط بر هر بخش',
	progress_sessions_label: 'جلسات اخیر',
	progress_no_sessions: 'هنوز جلسه‌ای نیست — اولینش رو شروع کن.',
	mastery_progress: (m: number, total: number) => `${m} از ${total} مسلط`,
	session_score: (correct: number, total: number) => `${correct}/${total}`,
	mastered_label: 'مسلط'
};

const all: Record<Lang, Record<MessageKey, MsgValue>> = { en, fa };

class I18nState {
	lang = $state<Lang>('en');

	constructor() {
		if (!browser) return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'en' || stored === 'fa') this.lang = stored;

		$effect.root(() => {
			$effect(() => {
				document.documentElement.setAttribute('lang', this.lang);
				document.documentElement.setAttribute('dir', this.lang === 'fa' ? 'rtl' : 'ltr');
				localStorage.setItem(STORAGE_KEY, this.lang);
			});
		});
	}

	toggle() {
		this.lang = this.lang === 'en' ? 'fa' : 'en';
	}
}

export const i18n = new I18nState();

export function t<K extends MessageKey>(key: K, ...args: unknown[]): string {
	const dict = all[i18n.lang] ?? en;
	const val = (dict[key] ?? en[key]) as MsgValue;
	if (typeof val === 'function') {
		return (val as (...a: unknown[]) => string)(...args);
	}
	return val;
}
