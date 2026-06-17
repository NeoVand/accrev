/**
 * Filtered view of the auto-generated slide deck.
 *
 * The "Bilingual reference" glossary slide (kind = 'glossary') was a sparse
 * stand-in inside Part VIII. It's been replaced by the full /glossary page,
 * so we hide it from the deck listings, navigation, and search. The slide
 * source is left untouched in `slides.generated.ts` (it's auto-generated)
 * but never reaches the user from here.
 */
import {
	parts as rawParts,
	slides as rawSlides,
	type PartId,
	type Slide
} from './slides.generated';

const matchingPrincipleBody = `<p class="subtitle" style="margin-top:16px; max-width:none;">The matching principle is the expense side of accrual accounting. It asks a simple question: <strong>which revenue did this cost help create?</strong> Once you know the revenue period, the related cost belongs in that same period, even if cash is paid earlier or later.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		اصل تطابق بخشِ هزینه در حسابداری تعهدی است. سؤال ساده‌اش این است: <strong>این هزینه به ایجاد کدام درآمد کمک کرده است؟</strong> وقتی دورهٔ درآمد را شناختیم، هزینهٔ مربوط هم باید در همان دوره ثبت شود؛ حتی اگر وجه نقد زودتر یا دیرتر پرداخت شده باشد.
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>Do not let cash timing decide profit. Cash tells us <em>when money moved</em>; matching tells us <em>when performance happened</em>. If a January sale created the need for a cost, January should carry that cost.</p>
			<p>That is why matching makes income statements more meaningful: each period shows the revenues earned in that period together with the costs used to earn them.</p>
			<div class="example"><span class="label">Memory hook</span>Revenue opens the door; related expenses walk through the same door.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>اجازه ندهید زمان پرداخت وجه نقد سود را تعیین کند. وجه نقد فقط می‌گوید <em>پول چه زمانی جابه‌جا شده</em>؛ اصل تطابق می‌گوید <em>عملکرد اقتصادی چه زمانی رخ داده</em>. اگر فروش ژانویه باعث ایجاد یک هزینه شده، همان ژانویه باید آن هزینه را تحمل کند.</p>
			<p>به همین دلیل صورت سود و زیان با اصل تطابق معنی‌دارتر می‌شود: هر دوره، درآمدهای همان دوره را کنار هزینه‌هایی نشان می‌دهد که برای کسب آن درآمدها مصرف شده‌اند.</p>
			<div class="example"><span class="label">یادسپار</span>درآمد در را باز می‌کند؛ هزینه‌های مرتبط از همان در وارد می‌شوند.</div>
		</div>
	</div>

	<div style="margin-top:18px;">
		<div style="font-family:'Fraunces',serif; font-size:17px; font-style:italic; margin-bottom:14px;">Three practical forms · سه شکل کاربردی</div>
		<div style="display:grid; grid-template-columns: 1fr; gap:16px;">
			<div>
				<div style="font-family:'Fraunces',serif; font-size:17px; line-height:1.15;">1. Cause &amp; effect <span style="font-family:'Vazirmatn',sans-serif; direction:rtl; color:var(--tan-deep);">· علت و معلول</span></div>
				<p style="margin-top:8px; font-size:14px; line-height:1.6;">When the link is direct, record the cost with the exact sale. Inventory cost becomes COGS when the inventory is sold; a sales commission belongs with the sale that earned it.</p>
				<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">وقتی رابطه مستقیم است، هزینه را همراه همان فروش ثبت کنید. بهای موجودی زمانی به بهای تمام‌شدهٔ کالای فروش‌رفته تبدیل می‌شود که کالا فروخته شود؛ کمیسیون فروش هم متعلق به همان فروشی است که کمیسیون را ایجاد کرده است.</p>
			</div>
			<div>
				<div style="font-family:'Fraunces',serif; font-size:17px; line-height:1.15;">2. Systematic allocation <span style="font-family:'Vazirmatn',sans-serif; direction:rtl; color:var(--tan-deep);">· تخصیص نظام‌مند</span></div>
				<p style="margin-top:8px; font-size:14px; line-height:1.6;">When one cost helps many periods, spread it over the periods that benefit. Depreciation, amortization, prepaid insurance, and prepaid rent follow this pattern.</p>
				<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">وقتی یک هزینه به چند دوره فایده می‌رساند، آن را بین دوره‌هایی پخش کنید که از آن فایده می‌برند. استهلاک دارایی ثابت، استهلاک دارایی نامشهود، بیمهٔ پیش‌پرداخت، و اجارهٔ پیش‌پرداخت همین الگو را دارند.</p>
			</div>
			<div>
				<div style="font-family:'Fraunces',serif; font-size:17px; line-height:1.15;">3. Immediate expense <span style="font-family:'Vazirmatn',sans-serif; direction:rtl; color:var(--tan-deep);">· شناسایی فوری</span></div>
				<p style="margin-top:8px; font-size:14px; line-height:1.6;">When there is no reliable future benefit to attach to later revenue, expense it now. Utilities, many advertising costs, routine repairs, and R&amp;D under U.S. GAAP are common examples.</p>
				<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">وقتی فایدهٔ آینده قابل اتکایی نداریم که بتوان آن را به درآمدهای بعدی وصل کرد، هزینه را همین حالا شناسایی می‌کنیم. هزینهٔ آب و برق، بسیاری از هزینه‌های تبلیغات، تعمیرات عادی، و تحقیق و توسعه طبق GAAP آمریکا نمونه‌های رایج‌اند.</p>
			</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Worked example</h3>
			<p>On <strong>Jan 20</strong>, a store sells goods for <strong>$500</strong>. Those goods originally cost the store <strong>$300</strong>. The salesperson earns a <strong>$50</strong> commission that will be paid in February.</p>
			<ul>
				<li>January revenue: <strong>$500</strong>, because the sale happened in January.</li>
				<li>January expenses: <strong>$300 COGS</strong> and <strong>$50 commission expense</strong>, because both helped create that January sale.</li>
				<li>February cash payment does not move the commission expense to February; it only settles the payable.</li>
			</ul>
			<div class="example"><span class="label">Journal logic</span>Jan: Dr COGS 300 / Cr Inventory 300. Jan: Dr Commission Expense 50 / Cr Commission Payable 50. Feb: Dr Commission Payable 50 / Cr Cash 50.</div>
		</div>
		<div class="col-fa">
			<h3>مثال کاربردی</h3>
			<p>در <strong>۲۰ ژانویه</strong>، یک فروشگاه کالایی را به مبلغ <strong>۵۰۰ دلار</strong> می‌فروشد. بهای آن کالا برای فروشگاه <strong>۳۰۰ دلار</strong> بوده است. فروشنده نیز <strong>۵۰ دلار</strong> کمیسیون کسب می‌کند که در فوریه پرداخت خواهد شد.</p>
			<ul>
				<li>درآمد ژانویه: <strong>۵۰۰ دلار</strong>، چون فروش در ژانویه انجام شده است.</li>
				<li>هزینه‌های ژانویه: <strong>۳۰۰ دلار بهای تمام‌شده</strong> و <strong>۵۰ دلار هزینهٔ کمیسیون</strong>، چون هر دو برای ایجاد فروش ژانویه مصرف شده‌اند.</li>
				<li>پرداخت نقدی در فوریه، هزینهٔ کمیسیون را به فوریه منتقل نمی‌کند؛ فقط بدهیِ پرداختنی را تسویه می‌کند.</li>
			</ul>
			<div class="example"><span class="label">منطق ثبت</span>ژانویه: بدهکار بهای تمام‌شده ۳۰۰ / بستانکار موجودی ۳۰۰. ژانویه: بدهکار هزینهٔ کمیسیون ۵۰ / بستانکار کمیسیون پرداختنی ۵۰. فوریه: بدهکار کمیسیون پرداختنی ۵۰ / بستانکار وجه نقد ۵۰.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to decide quickly</h3>
			<ul>
				<li><strong>Can you tie the cost to a specific sale?</strong> Match it to that sale.</li>
				<li><strong>Does the cost benefit several periods?</strong> Put it on the balance sheet first, then expense it over time.</li>
				<li><strong>No clear future benefit?</strong> Expense it immediately.</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>Do not match every cash payment to the month paid. First ask what the payment bought: a current-period cost, a future benefit, or settlement of an old payable.</div>
		</div>
		<div class="col-fa">
			<h3>روش سریع تصمیم‌گیری</h3>
			<ul>
				<li><strong>آیا هزینه را می‌توان به یک فروش مشخص وصل کرد؟</strong> آن را با همان فروش تطبیق دهید.</li>
				<li><strong>آیا هزینه به چند دوره فایده می‌رساند؟</strong> ابتدا آن را در ترازنامه نگه دارید، سپس در طول زمان به هزینه تبدیل کنید.</li>
				<li><strong>فایدهٔ آینده روشن نیست؟</strong> هزینه را فوراً شناسایی کنید.</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>هر پرداخت نقدی را هزینهٔ همان ماه ندانید. اول بپرسید پرداخت چه چیزی خریده است: هزینهٔ دورهٔ جاری، فایدهٔ آینده، یا تسویهٔ یک بدهی قدیمی.</div>
		</div>
	</div>`;

const matchingPrinciplePlain =
	'The matching principle is the expense side of accrual accounting. It asks a simple question: which revenue did this cost help create? Once you know the revenue period, the related cost belongs in that same period, even if cash is paid earlier or later. اصل تطابق بخش هزینه در حسابداری تعهدی است. سؤال ساده‌اش این است: این هزینه به ایجاد کدام درآمد کمک کرده است؟ وقتی دوره درآمد را شناختیم، هزینه مربوط هم باید در همان دوره ثبت شود؛ حتی اگر وجه نقد زودتر یا دیرتر پرداخت شده باشد. Big idea Do not let cash timing decide profit. Cash tells us when money moved; matching tells us when performance happened. If a January sale created the need for a cost, January should carry that cost. That is why matching makes income statements more meaningful: each period shows the revenues earned in that period together with the costs used to earn them. Memory hook Revenue opens the door; related expenses walk through the same door. ایده اصلی اجازه ندهید زمان پرداخت وجه نقد سود را تعیین کند. وجه نقد فقط می‌گوید پول چه زمانی جابه‌جا شده؛ اصل تطابق می‌گوید عملکرد اقتصادی چه زمانی رخ داده. اگر فروش ژانویه باعث ایجاد یک هزینه شده، همان ژانویه باید آن هزینه را تحمل کند. به همین دلیل صورت سود و زیان با اصل تطابق معنی‌دارتر می‌شود: هر دوره، درآمدهای همان دوره را کنار هزینه‌هایی نشان می‌دهد که برای کسب آن درآمدها مصرف شده‌اند. یادسپار درآمد در را باز می‌کند؛ هزینه‌های مرتبط از همان در وارد می‌شوند. Three practical forms سه شکل کاربردی 1. Cause and effect علت و معلول When the link is direct, record the cost with the exact sale. Inventory cost becomes COGS when the inventory is sold; a sales commission belongs with the sale that earned it. وقتی رابطه مستقیم است، هزینه را همراه همان فروش ثبت کنید. بهای موجودی زمانی به بهای تمام‌شده کالای فروش‌رفته تبدیل می‌شود که کالا فروخته شود؛ کمیسیون فروش هم متعلق به همان فروشی است که کمیسیون را ایجاد کرده است. 2. Systematic allocation تخصیص نظام‌مند When one cost helps many periods, spread it over the periods that benefit. Depreciation, amortization, prepaid insurance, and prepaid rent follow this pattern. وقتی یک هزینه به چند دوره فایده می‌رساند، آن را بین دوره‌هایی پخش کنید که از آن فایده می‌برند. استهلاک دارایی ثابت، استهلاک دارایی نامشهود، بیمه پیش‌پرداخت، و اجاره پیش‌پرداخت همین الگو را دارند. 3. Immediate expense شناسایی فوری When there is no reliable future benefit to attach to later revenue, expense it now. Utilities, many advertising costs, routine repairs, and R&D under U.S. GAAP are common examples. وقتی فایده آینده قابل اتکایی نداریم که بتوان آن را به درآمدهای بعدی وصل کرد، هزینه را همین حالا شناسایی می‌کنیم. هزینه آب و برق، بسیاری از هزینه‌های تبلیغات، تعمیرات عادی، و تحقیق و توسعه طبق GAAP آمریکا نمونه‌های رایج‌اند. Worked example On Jan 20, a store sells goods for $500. Those goods originally cost the store $300. The salesperson earns a $50 commission that will be paid in February. January revenue: $500, because the sale happened in January. January expenses: $300 COGS and $50 commission expense, because both helped create that January sale. February cash payment does not move the commission expense to February; it only settles the payable. Journal logic Jan: Dr COGS 300 / Cr Inventory 300. Jan: Dr Commission Expense 50 / Cr Commission Payable 50. Feb: Dr Commission Payable 50 / Cr Cash 50. مثال کاربردی در ۲۰ ژانویه، یک فروشگاه کالایی را به مبلغ ۵۰۰ دلار می‌فروشد. بهای آن کالا برای فروشگاه ۳۰۰ دلار بوده است. فروشنده نیز ۵۰ دلار کمیسیون کسب می‌کند که در فوریه پرداخت خواهد شد. درآمد ژانویه: ۵۰۰ دلار، چون فروش در ژانویه انجام شده است. هزینه‌های ژانویه: ۳۰۰ دلار بهای تمام‌شده و ۵۰ دلار هزینه کمیسیون، چون هر دو برای ایجاد فروش ژانویه مصرف شده‌اند. پرداخت نقدی در فوریه، هزینه کمیسیون را به فوریه منتقل نمی‌کند؛ فقط بدهی پرداختنی را تسویه می‌کند. منطق ثبت ژانویه: بدهکار بهای تمام‌شده ۳۰۰ / بستانکار موجودی ۳۰۰. ژانویه: بدهکار هزینه کمیسیون ۵۰ / بستانکار کمیسیون پرداختنی ۵۰. فوریه: بدهکار کمیسیون پرداختنی ۵۰ / بستانکار وجه نقد ۵۰. How to decide quickly Can you tie the cost to a specific sale? Match it to that sale. Does the cost benefit several periods? Put it on the balance sheet first, then expense it over time. No clear future benefit? Expense it immediately. Common mistake Do not match every cash payment to the month paid. First ask what the payment bought: a current-period cost, a future benefit, or settlement of an old payable. روش سریع تصمیم‌گیری آیا هزینه را می‌توان به یک فروش مشخص وصل کرد؟ آن را با همان فروش تطبیق دهید. آیا هزینه به چند دوره فایده می‌رساند؟ ابتدا آن را در ترازنامه نگه دارید، سپس در طول زمان به هزینه تبدیل کنید. فایده آینده روشن نیست؟ هزینه را فوراً شناسایی کنید. اشتباه رایج هر پرداخت نقدی را هزینه همان ماه ندانید. اول بپرسید پرداخت چه چیزی خریده است: هزینه دوره جاری، فایده آینده، یا تسویه یک بدهی قدیمی.';

const slideOverrides: Partial<Record<string, Partial<Slide>>> = {
	'23-matching': {
		body: matchingPrincipleBody,
		plain: matchingPrinciplePlain
	}
};

export const slides: Slide[] = rawSlides
	.filter((s) => s.kind !== 'glossary')
	.map((slide) => ({ ...slide, ...slideOverrides[slide.slug] }));

export const slidesBySlug: Record<string, Slide> = Object.fromEntries(
	slides.map((s) => [s.slug, s])
);

export const slidesByPart: Record<PartId, Slide[]> = slides.reduce(
	(acc, s) => {
		(acc[s.partId] ??= []).push(s);
		return acc;
	},
	{} as Record<PartId, Slide[]>
);

export const parts = rawParts;
