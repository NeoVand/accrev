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
	decks_cores: 'core decks',
	decks_disciplines: 'discipline decks',
	foundational: 'Foundational',
	foundational_sub: 'Acronyms',
	far_core: 'FAR Core',
	far_sub: 'Financial reporting',
	cards: 'cards',
	begin_session: 'begin a study session',
	study: 'study',
	recall_couldnt: 'recall · couldn’t answer',
	show_hint: 'show hint',
	hide_hint: 'hide hint',
	reveal_answer: 'reveal answer',
	flip_back: 'flip back',
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
	nav_learn: 'Learn',
	nav_study: 'Study',
	nav_progress: 'Progress',
	nav_settings: 'Settings',

	// Learn section
	learn_eyebrow: 'a review deck',
	learn_title: 'Accounting, Reviewed.',
	learn_subtitle:
		'Sixty concepts, end-to-end, paired in English and Farsi — with worked examples and the pitfalls that make accounting hard the second time around.',
	learn_for_you: 'For you, jooon. From the very first equation to a real annual report.',
	learn_search_placeholder: 'Search slides, terms, examples…',
	learn_search_no_results: 'Nothing found. Try a different word.',
	learn_search_results_count: (n: number) => (n === 1 ? '1 result' : `${n} results`),
	learn_eight_parts: 'Eight parts',
	learn_part_label: (roman: string) => `Part ${roman}`,
	learn_open_part: 'open part',
	learn_prev: 'previous',
	learn_next: 'next',
	learn_back_to_part: 'back to part',
	learn_back_to_index: 'back to index',
	learn_jump: 'jump to slide',
	learn_part_intro: 'in this part',
	learn_mark_read: 'mark as read',
	learn_marked_read: 'read',
	learn_progress_label: 'progress',
	learn_read_progress: (read: number, total: number) => `${read} of ${total} read`,
	learn_unmark_read: 'mark unread',
	lookup_open_card: 'open full card',
	lookup_root_form: (root: string) => `root form: ${root}`,
	close: 'close',
	of: 'of',
	hear_pronunciation: 'Hear pronunciation',
	stop_pronunciation: 'Stop pronunciation',
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
	mastered_label: 'mastered',

	// Welcome / PIN gate
	welcome_for: 'for',
	welcome_name: 'ellie',
	welcome_tagline: 'a love letter, in flashcards.',
	welcome_pin_label: 'enter pin',
	welcome_pin_placeholder: '••••',
	welcome_unlock: 'open',
	welcome_wrong: 'try again 💗',
	welcome_footer: "if you're not my girlfriend, this app isn't for you.",

	// Study session
	exit_session: 'exit session',

	// Home hero
	greeting_morning: 'good morning',
	greeting_afternoon: 'good afternoon',
	greeting_evening: 'good evening',
	greeting_night: 'good night',
	greeting_latenight: 'late night',
	hero_eyebrow_today: 'today',
	hero_eyebrow_recall: 'pick up where you left off',
	hero_title_begin: 'A fresh session.',
	hero_title_continue: 'Keep going.',
	hero_title_recall: 'Catch up on what slipped.',
	hero_body_begin: (n: number) =>
		n === 0
			? 'No cards yet — pull some in and start.'
			: `${n} cards across all CPA sections.`,
	hero_body_recall: (n: number) =>
		n === 1 ? '1 card in your recall deck.' : `${n} cards in your recall deck.`,
	hero_button_start: 'start session',
	hero_button_recall: 'review now',
	chip_streak: (n: number) => (n === 1 ? '1 day streak' : `${n} day streak`),
	chip_level: (n: number) => `level ${n}`,
	chip_browse: 'browse decks',
	hero_eyebrow_foundations: 'start with the basics',
	hero_button_foundations: 'start foundations',
	hero_button_continue: 'continue',
	cpa_sections_label: 'CPA Exam Sections',
	cpa_sections_subtitle: (decks: number, cards: number) =>
		`${decks} decks · ${cards} cards`,
	recall_pill_inline: (n: number) =>
		n === 1 ? '1 card in your recall deck' : `${n} cards in your recall deck`,

	// Reset
	reset_eyebrow: 'reset',
	reset_title: 'Reset everything',
	reset_body:
		'Wipes all terms, reviews, sessions, streak, XP, theme, language, and PIN unlock. You’ll land back at the welcome screen. Cannot be undone.',
	reset_button: 'reset all data',
	reset_confirm_title: 'Wipe everything?',
	reset_confirm_body: 'You’ll be back at the welcome screen with no progress.',
	reset_confirm_yes: 'yes, wipe everything',
	reset_cancel: 'cancel',

	// Glossary
	glossary: 'glossary',
	glossary_title: 'Bilingual glossary',
	glossary_sub: (n: number) => `${n} words, paired in English and Farsi.`,
	glossary_open: 'open glossary',
	glossary_search_placeholder: 'Search a word…',
	glossary_to_memorize: 'to memorize',
	glossary_memorized: 'memorized',
	glossary_empty_to_memorize: 'Nothing left to memorize. Beautiful work.',
	glossary_empty_memorized: 'No memorized words yet — tap “I memorized this” on a card to start your pile.',
	glossary_memorize_btn: 'I memorized this',
	glossary_forget_btn: 'still learning',
	glossary_count: (memorized: number, total: number) =>
		`${memorized} of ${total} memorized`,
	glossary_no_results: 'No words match that.',
	glossary_back: 'back',
	glossary_definition: 'definition',
	glossary_example: 'example',
	glossary_view_az: 'A–Z',
	glossary_view_section: 'by section',
	glossary_view_topic: 'by topic',
	glossary_group_common: 'Common Vocabulary',
	glossary_group_other: 'Other',
	read_aloud_term: 'read the word',
	read_aloud_def: 'read the definition',
	hero_glossary_eyebrow: 'memorize · learn',
	hero_glossary_title: 'Glossary'
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
	decks_cores: 'دسته‌های هسته',
	decks_disciplines: 'دسته‌های تخصصی',
	foundational: 'پایه',
	foundational_sub: 'سرواژه‌ها',
	far_core: 'هستۀ FAR',
	far_sub: 'گزارشگری مالی',
	cards: 'کارت',
	begin_session: 'شروع جلسۀ مطالعه',
	study: 'مطالعه',
	recall_couldnt: 'مرور · جواب ندادی',
	show_hint: 'نمایش راهنما',
	hide_hint: 'بستن راهنما',
	reveal_answer: 'دیدن پاسخ',
	flip_back: 'بازگشت',
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
	nav_learn: 'یادگیری',
	nav_study: 'مطالعه',
	nav_progress: 'پیشرفت',
	nav_settings: 'تنظیمات',

	learn_eyebrow: 'یک مرور',
	learn_title: 'حسابداری، مرور شد.',
	learn_subtitle:
		'شصت مفهوم، از پایه تا تحلیل صورت‌های مالی — به دو زبان، با مثال‌های عددی و یادداشت‌هایی دربارهٔ خطاهای رایج.',
	learn_for_you: 'برای تو جون. از اولین معادله تا یک گزارش سالانهٔ واقعی.',
	learn_search_placeholder: 'جست‌وجو در اسلایدها، واژه‌ها، مثال‌ها…',
	learn_search_no_results: 'چیزی پیدا نشد. کلمهٔ دیگری امتحان کن.',
	learn_search_results_count: (n: number) => `${n} نتیجه`,
	learn_eight_parts: 'هشت بخش',
	learn_part_label: (roman: string) => `بخش ${roman}`,
	learn_open_part: 'مشاهدۀ بخش',
	learn_prev: 'قبلی',
	learn_next: 'بعدی',
	learn_back_to_part: 'بازگشت به بخش',
	learn_back_to_index: 'بازگشت به فهرست',
	learn_jump: 'پرش به اسلاید',
	learn_part_intro: 'در این بخش',
	learn_mark_read: 'علامت‌گذاری به‌عنوان خوانده‌شده',
	learn_marked_read: 'خوانده شد',
	learn_progress_label: 'پیشرفت',
	learn_read_progress: (read: number, total: number) => `${read} از ${total} خوانده شد`,
	learn_unmark_read: 'برداشتن علامت',
	lookup_open_card: 'مشاهدۀ کارت کامل',
	lookup_root_form: (root: string) => `شکل پایه: ${root}`,
	close: 'بستن',
	of: 'از',
	hear_pronunciation: 'تلفظ رو بشنو',
	stop_pronunciation: 'توقف تلفظ',
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
	mastered_label: 'مسلط',

	welcome_for: 'برای',
	welcome_name: 'الی',
	welcome_tagline: 'یک نامۀ عاشقانه، با فلش‌کارت.',
	welcome_pin_label: 'پین رو وارد کن',
	welcome_pin_placeholder: '••••',
	welcome_unlock: 'بازکن',
	welcome_wrong: 'دوباره امتحان کن 💗',
	welcome_footer: 'اگه دوست‌دخترم نیستی، این برنامه برای تو نیست.',

	exit_session: 'خروج از جلسه',

	greeting_morning: 'صبح بخیر',
	greeting_afternoon: 'عصر بخیر',
	greeting_evening: 'غروب بخیر',
	greeting_night: 'شب بخیر',
	greeting_latenight: 'آخر شب',
	hero_eyebrow_today: 'امروز',
	hero_eyebrow_recall: 'ادامه بده',
	hero_title_begin: 'یه جلسۀ تازه.',
	hero_title_continue: 'ادامه بدیم.',
	hero_title_recall: 'چیزایی که گیر افتادی رو مرور کن.',
	hero_body_begin: (n: number) =>
		n === 0
			? 'هنوز کارتی نیست — یکم کارت اضافه کن و شروع کنیم.'
			: `${n} کارت در همۀ بخش‌های CPA.`,
	hero_body_recall: (n: number) => `${n} کارت توی دستۀ مرور.`,
	hero_button_start: 'شروع جلسه',
	hero_button_recall: 'الان مرور کن',
	chip_streak: (n: number) => `${n} روز دنباله`,
	chip_level: (n: number) => `سطح ${n}`,
	chip_browse: 'دیدن دسته‌ها',
	hero_eyebrow_foundations: 'با پایه‌ها شروع کن',
	hero_button_foundations: 'شروع پایه',
	hero_button_continue: 'ادامه',
	cpa_sections_label: 'بخش‌های آزمون CPA',
	cpa_sections_subtitle: (decks: number, cards: number) => `${decks} دسته · ${cards} کارت`,
	recall_pill_inline: (n: number) => `${n} کارت تو دستۀ مرور`,

	reset_eyebrow: 'پاک‌سازی',
	reset_title: 'پاک کردن همه چیز',
	reset_body:
		'تمام اصطلاحات، مرورها، جلسات، دنباله، تجربه، پوسته، زبان و قفل پین رو پاک می‌کنه. به صفحۀ خوشامدگویی برمی‌گردی. غیرقابل بازگشته.',
	reset_button: 'پاک کردن همۀ داده‌ها',
	reset_confirm_title: 'همه چیز پاک بشه؟',
	reset_confirm_body: 'به صفحۀ خوشامدگویی بدون هیچ پیشرفتی برمی‌گردی.',
	reset_confirm_yes: 'بله، همه چیز رو پاک کن',
	reset_cancel: 'لغو',

	// Glossary
	glossary: 'واژه‌نامه',
	glossary_title: 'واژه‌نامهٔ دوزبانه',
	glossary_sub: (n: number) => `${n} واژه، انگلیسی و فارسی، کنار هم.`,
	glossary_open: 'باز کردن واژه‌نامه',
	glossary_search_placeholder: 'جست‌وجوی واژه…',
	glossary_to_memorize: 'برای حفظ کردن',
	glossary_memorized: 'حفظ شد',
	glossary_empty_to_memorize: 'دیگه چیزی برای حفظ کردن نمونده. عالی!',
	glossary_empty_memorized: 'هنوز هیچ واژه‌ای حفظ نشده — روی «حفظ کردم» بزن تا اینجا اضافه بشه.',
	glossary_memorize_btn: 'حفظ کردم',
	glossary_forget_btn: 'هنوز یاد می‌گیرم',
	glossary_count: (memorizedN: number, total: number) =>
		`${memorizedN} از ${total} حفظ شده`,
	glossary_no_results: 'چیزی پیدا نشد.',
	glossary_back: 'بازگشت',
	glossary_definition: 'تعریف',
	glossary_example: 'مثال',
	glossary_view_az: 'الفبایی',
	glossary_view_section: 'بر اساس بخش',
	glossary_view_topic: 'بر اساس موضوع',
	glossary_group_common: 'واژگان عمومی',
	glossary_group_other: 'سایر',
	read_aloud_term: 'خواندن واژه',
	read_aloud_def: 'خواندن تعریف',
	hero_glossary_eyebrow: 'حفظ · یادگیری',
	hero_glossary_title: 'واژه‌نامه'
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
