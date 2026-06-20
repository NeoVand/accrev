/**
 * Lightweight interview metadata — level names, descriptions, and counts only.
 *
 * This module deliberately does NOT import the full interview bank
 * (src/lib/data/interview-bank.json, ~950 KB) so the home page can show the
 * interview teaser without pulling the whole question set into the main bundle.
 * The full bank is loaded only on the /interview route via `$lib/interview`.
 *
 * Mirrors `levels` and `counts` in interview-bank.json — keep in sync if the
 * bank's level structure changes.
 */

import type { InterviewLevel, InterviewLevelId } from './types';

export const INTERVIEW_LEVELS: InterviewLevel[] = [
	{
		level: 1,
		name: { en: 'Foundational', fa: 'مبانی (سطح مقدماتی)' },
		description: {
			en: 'Bedrock principles every accountant must know cold — the accounting equation, debits and credits, the three financial statements and how they connect, accrual vs. cash, and core adjusting concepts. Typical for entry-level and staff accountant (bachelor’s-level) roles.',
			fa: 'اصول بنیادینی که هر حسابدار باید کاملاً مسلط باشد — معادلهٔ حسابداری، بدهکار و بستانکار، سه صورت مالی و نحوهٔ ارتباط آن‌ها، مبنای تعهدی در برابر نقدی، و مفاهیم اصلی ثبت‌های تعدیلی. مناسب نقش‌های مقدماتی و حسابدار عمومی (مقطع کارشناسی).'
		}
	},
	{
		level: 2,
		name: { en: 'Intermediate / Applied', fa: 'متوسط / کاربردی' },
		description: {
			en: 'Applied, process-oriented topics that staff-to-senior accountants handle daily — month-end close, the five-step revenue model, inventory costing and COGS, bad-debt allowances, bank reconciliations, internal controls, depreciation methods, and the classic transaction walk-throughs.',
			fa: 'موضوعات کاربردی و فرایندمحور که حسابداران از سطح عمومی تا ارشد روزانه با آن سروکار دارند — بستن پایان دوره، مدل پنج‌مرحله‌ای شناخت درآمد، بهای تمام‌شدهٔ موجودی و بهای تمام‌شدهٔ کالای فروش‌رفته، ذخیرهٔ مطالبات مشکوک‌الوصول، مغایرت‌گیری بانکی، کنترل‌های داخلی، روش‌های استهلاک، و تشریح اثر معاملات.'
		}
	},
	{
		level: 3,
		name: { en: 'Advanced', fa: 'پیشرفته' },
		description: {
			en: 'Technical depth that distinguishes senior accountants, accounting managers, and controller-track candidates — deferred taxes, leases, goodwill and impairment, business combinations and consolidation, deep three-statement interactions, accounting changes and error corrections, quality of earnings, and GAAP vs. IFRS.',
			fa: 'عمق فنی که حسابداران ارشد، مدیران حسابداری و نامزدهای مسیر کنترلر را متمایز می‌کند — مالیات‌های انتقالی، اجاره‌ها، سرقفلی و کاهش ارزش، ترکیب‌های تجاری و تلفیق، تعاملات عمیق سه صورت مالی، تغییرات حسابداری و اصلاح اشتباهات، کیفیت سود، و مقایسهٔ GAAP و IFRS.'
		}
	},
	{
		level: 4,
		name: { en: 'Cost & Managerial', fa: 'حسابداری بهای تمام‌شده و مدیریت' },
		description: {
			en: 'Cost and managerial accounting that enterprise and manufacturing teams rely on — cost classifications, job/process/activity-based costing, standard costing and variance analysis, cost-volume-profit, budgeting, transfer pricing, and performance measurement.',
			fa: 'حسابداری بهای تمام‌شده و مدیریت که تیم‌های سازمانی و تولیدی به آن تکیه می‌کنند — طبقه‌بندی هزینه‌ها، هزینه‌یابی سفارش/مرحله‌ای/بر مبنای فعالیت، هزینه‌یابی استاندارد و تحلیل انحرافات، تحلیل هزینه-حجم-سود، بودجه‌بندی، قیمت‌گذاری انتقالی، و سنجش عملکرد.'
		}
	}
];

/** Question count per level — mirrors interview-bank.json `counts.byLevel`. */
export const INTERVIEW_LEVEL_COUNTS: Record<InterviewLevelId, number> = {
	1: 55,
	2: 43,
	3: 52,
	4: 42
};

/** Total questions in the bank — mirrors interview-bank.json `counts.total`. */
export const INTERVIEW_TOTAL = 192;
