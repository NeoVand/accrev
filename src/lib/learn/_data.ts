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

const cashVsAccrualBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">Cash basis and accrual basis answer the same question in two different ways: <strong>which period should show this revenue or expense?</strong> Cash basis follows the money. Accrual basis follows the economic activity.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		مبنای نقدی و مبنای تعهدی به یک سؤال با دو منطق متفاوت پاسخ می‌دهند: <strong>این درآمد یا هزینه باید در کدام دوره نشان داده شود؟</strong> مبنای نقدی حرکت پول را دنبال می‌کند. مبنای تعهدی رویداد اقتصادی را دنبال می‌کند.
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>Cash basis is easy because it treats the bank account as the clock: revenue appears when cash is received, and expense appears when cash is paid.</p>
			<p>Accrual basis uses a better clock for performance: revenue appears when it is <strong>earned</strong>, and expense appears when it is <strong>incurred</strong>. Cash can arrive before, during, or after that moment.</p>
			<div class="example"><span class="label">Memory hook</span>Cash basis asks, "When did money move?" Accrual basis asks, "When did the business earn or use something?"</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>مبنای نقدی ساده است، چون حساب بانکی را مثل ساعت در نظر می‌گیرد: درآمد وقتی ثبت می‌شود که وجه دریافت شود، و هزینه وقتی ثبت می‌شود که وجه پرداخت شود.</p>
			<p>مبنای تعهدی برای سنجش عملکرد از ساعت دقیق‌تری استفاده می‌کند: درآمد وقتی ثبت می‌شود که <strong>کسب شده</strong> باشد، و هزینه وقتی ثبت می‌شود که <strong>ایجاد شده</strong> باشد. وجه نقد ممکن است قبل، هم‌زمان، یا بعد از آن لحظه جابه‌جا شود.</p>
			<div class="example"><span class="label">یادسپار</span>مبنای نقدی می‌پرسد: «پول چه زمانی جابه‌جا شد؟» مبنای تعهدی می‌پرسد: «کسب‌وکار چه زمانی چیزی را کسب یا مصرف کرد؟»</div>
		</div>
	</div>

	<div style="margin-top:18px; display:grid; grid-template-columns: 1fr; gap:18px;">
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep); margin-bottom:6px;">METHOD A</div>
			<div style="font-family:'Fraunces',serif; font-size:20px; color:var(--navy); font-weight:500;">Cash Basis <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· مبنای نقدی</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Rule:</strong> record revenue when cash is received; record expense when cash is paid. It is simple, practical, and often enough for very small operations.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>قاعده:</strong> درآمد زمانی ثبت می‌شود که وجه دریافت شود؛ هزینه زمانی ثبت می‌شود که وجه پرداخت شود. این روش ساده و کاربردی است و برای بعضی کسب‌وکارهای خیلی کوچک کافی است.</p>
			<div class="pitfall"><span class="label">Weakness</span>It can make performance look wrong. A company may do the work in December, collect cash in January, and look like it earned nothing in December.</div>
		</div>

		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep); margin-bottom:6px;">METHOD B · STANDARD</div>
			<div style="font-family:'Fraunces',serif; font-size:20px; color:var(--navy); font-weight:500;">Accrual Basis <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· مبنای تعهدی</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Rule:</strong> record revenue when earned; record expense when incurred. Receivables, payables, deferrals, and accruals handle the gap between cash and performance.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>قاعده:</strong> درآمد زمانی ثبت می‌شود که کسب شده باشد؛ هزینه زمانی ثبت می‌شود که ایجاد شده باشد. دریافتنی‌ها، پرداختنی‌ها، پیش‌دریافت/پیش‌پرداخت‌ها و معوق‌ها فاصلهٔ بین وجه نقد و عملکرد را مدیریت می‌کنند.</p>
			<div class="example"><span class="label">Why standard</span>Accrual accounting gives a better income statement because each period shows the work done in that period, not just the cash that happened to arrive or leave.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Same contract, two stories</h3>
			<p>A company signs a <strong>$12,000</strong> service contract on <strong>Dec 1</strong>. It will provide service evenly for 12 months. The customer pays the full amount on <strong>Mar 31</strong>.</p>
			<ul>
				<li><strong>Cash basis:</strong> no revenue in December, January, or February; <strong>$12,000</strong> revenue in March when cash arrives.</li>
				<li><strong>Accrual basis:</strong> <strong>$1,000</strong> revenue each month as service is provided. Cash collection is recorded separately.</li>
			</ul>
			<div class="example"><span class="label">Journal logic</span>Each month before cash: Dr Accounts Receivable 1,000 · Cr Service Revenue 1,000. When cash is collected: Dr Cash 12,000 · Cr Accounts Receivable 12,000.</div>
		</div>
		<div class="col-fa">
			<h3>یک قرارداد، دو روایت</h3>
			<p>شرکت در <strong>۱ دسامبر</strong> قراردادی <strong>۱۲٬۰۰۰ دلاری</strong> امضا می‌کند. خدمت طی ۱۲ ماه به‌طور مساوی ارائه می‌شود. مشتری کل مبلغ را در <strong>۳۱ مارس</strong> پرداخت می‌کند.</p>
			<ul>
				<li><strong>مبنای نقدی:</strong> در دسامبر، ژانویه و فوریه درآمدی ثبت نمی‌شود؛ در مارس، هنگام دریافت وجه، <strong>۱۲٬۰۰۰ دلار</strong> درآمد ثبت می‌شود.</li>
				<li><strong>مبنای تعهدی:</strong> هر ماه با ارائهٔ خدمت، <strong>۱٬۰۰۰ دلار</strong> درآمد ثبت می‌شود. وصول وجه نقد جداگانه ثبت می‌شود.</li>
			</ul>
			<div class="example"><span class="label">منطق ثبت</span>هر ماه قبل از وصول وجه: بدهکار حساب‌های دریافتنی ۱٬۰۰۰ · بستانکار درآمد خدمات ۱٬۰۰۰. هنگام وصول وجه: بدهکار وجه نقد ۱۲٬۰۰۰ · بستانکار حساب‌های دریافتنی ۱۲٬۰۰۰.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Why accrual can feel strange</h3>
			<p>Accrual accounting can show <strong>profit without cash</strong> or <strong>cash without profit</strong>. That is not a mistake; it is the point. The income statement measures performance, while the cash flow statement explains cash movement.</p>
			<ul>
				<li><strong>Profit without cash:</strong> you sell on credit and collect later.</li>
				<li><strong>Cash without profit:</strong> a customer pays in advance, so you record a liability until the work is done.</li>
				<li><strong>Expense without cash:</strong> employees worked this month, but payday is next month.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>چرا مبنای تعهدی گاهی عجیب به نظر می‌رسد</h3>
			<p>در حسابداری تعهدی ممکن است <strong>سود بدون وجه نقد</strong> یا <strong>وجه نقد بدون سود</strong> ببینید. این خطا نیست؛ هدف همین است. صورت سود و زیان عملکرد را اندازه می‌گیرد، و صورت جریان وجوه نقد حرکت پول را توضیح می‌دهد.</p>
			<ul>
				<li><strong>سود بدون وجه نقد:</strong> فروش نسیه انجام می‌دهید و بعداً وصول می‌کنید.</li>
				<li><strong>وجه نقد بدون سود:</strong> مشتری پیشاپیش پرداخت می‌کند، پس تا زمان انجام کار یک بدهی ثبت می‌شود.</li>
				<li><strong>هزینه بدون وجه نقد:</strong> کارکنان این ماه کار کرده‌اند، اما روز پرداخت ماه بعد است.</li>
			</ul>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to decide quickly</h3>
			<ul>
				<li><strong>Using cash basis?</strong> ask only: did cash come in or go out?</li>
				<li><strong>Using accrual basis?</strong> ask: was revenue earned, or was an expense incurred?</li>
				<li><strong>Cash and performance are in different periods?</strong> use receivables, payables, deferrals, or accruals to bridge the timing gap.</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>Do not read accrual net income as the same thing as bank-account cash. A profitable company can still run short on cash if customers have not paid yet.</div>
		</div>
		<div class="col-fa">
			<h3>روش سریع تصمیم‌گیری</h3>
			<ul>
				<li><strong>مبنای نقدی؟</strong> فقط بپرسید: آیا وجه وارد یا خارج شده است؟</li>
				<li><strong>مبنای تعهدی؟</strong> بپرسید: آیا درآمد کسب شده، یا هزینه ایجاد شده است؟</li>
				<li><strong>وجه نقد و عملکرد در دوره‌های متفاوت‌اند؟</strong> از دریافتنی، پرداختنی، پیش‌دریافت/پیش‌پرداخت یا معوق استفاده کنید تا فاصلهٔ زمانی را وصل کند.</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>سود خالص تعهدی را با وجه نقد حساب بانکی یکی ندانید. شرکتی که سودآور است هم ممکن است کمبود نقدینگی داشته باشد، اگر مشتریان هنوز پرداخت نکرده باشند.</div>
		</div>
	</div>`;

const cashVsAccrualPlain =
	'Cash basis and accrual basis answer the same question in two different ways: which period should show this revenue or expense? Cash basis follows the money. Accrual basis follows the economic activity. مبنای نقدی و مبنای تعهدی به یک سؤال با دو منطق متفاوت پاسخ می‌دهند: این درآمد یا هزینه باید در کدام دوره نشان داده شود؟ مبنای نقدی حرکت پول را دنبال می‌کند. مبنای تعهدی رویداد اقتصادی را دنبال می‌کند. Big idea Cash basis is easy because it treats the bank account as the clock: revenue appears when cash is received, and expense appears when cash is paid. Accrual basis uses a better clock for performance: revenue appears when it is earned, and expense appears when it is incurred. Cash can arrive before, during, or after that moment. Memory hook Cash basis asks: When did money move? Accrual basis asks: When did the business earn or use something? ایده اصلی مبنای نقدی ساده است، چون حساب بانکی را مثل ساعت در نظر می‌گیرد: درآمد وقتی ثبت می‌شود که وجه دریافت شود، و هزینه وقتی ثبت می‌شود که وجه پرداخت شود. مبنای تعهدی برای سنجش عملکرد از ساعت دقیق‌تری استفاده می‌کند: درآمد وقتی ثبت می‌شود که کسب شده باشد، و هزینه وقتی ثبت می‌شود که ایجاد شده باشد. وجه نقد ممکن است قبل، هم‌زمان، یا بعد از آن لحظه جابه‌جا شود. یادسپار مبنای نقدی می‌پرسد: پول چه زمانی جابه‌جا شد؟ مبنای تعهدی می‌پرسد: کسب‌وکار چه زمانی چیزی را کسب یا مصرف کرد؟ Cash Basis مبنای نقدی Rule: record revenue when cash is received; record expense when cash is paid. It is simple, practical, and often enough for very small operations. قاعده: درآمد زمانی ثبت می‌شود که وجه دریافت شود؛ هزینه زمانی ثبت می‌شود که وجه پرداخت شود. این روش ساده و کاربردی است و برای بعضی کسب‌وکارهای خیلی کوچک کافی است. Weakness It can make performance look wrong. A company may do the work in December, collect cash in January, and look like it earned nothing in December. Accrual Basis مبنای تعهدی Rule: record revenue when earned; record expense when incurred. Receivables, payables, deferrals, and accruals handle the gap between cash and performance. قاعده: درآمد زمانی ثبت می‌شود که کسب شده باشد؛ هزینه زمانی ثبت می‌شود که ایجاد شده باشد. دریافتنی‌ها، پرداختنی‌ها، پیش‌دریافت/پیش‌پرداخت‌ها و معوق‌ها فاصله بین وجه نقد و عملکرد را مدیریت می‌کنند. Why standard Accrual accounting gives a better income statement because each period shows the work done in that period, not just the cash that happened to arrive or leave. Same contract, two stories A company signs a $12,000 service contract on Dec 1. It will provide service evenly for 12 months. The customer pays the full amount on Mar 31. Cash basis: no revenue in December, January, or February; $12,000 revenue in March when cash arrives. Accrual basis: $1,000 revenue each month as service is provided. Cash collection is recorded separately. Journal logic Each month before cash: Dr Accounts Receivable 1,000 / Cr Service Revenue 1,000. When cash is collected: Dr Cash 12,000 / Cr Accounts Receivable 12,000. یک قرارداد، دو روایت شرکت در ۱ دسامبر قراردادی ۱۲٬۰۰۰ دلاری امضا می‌کند. خدمت طی ۱۲ ماه به‌طور مساوی ارائه می‌شود. مشتری کل مبلغ را در ۳۱ مارس پرداخت می‌کند. مبنای نقدی: در دسامبر، ژانویه و فوریه درآمدی ثبت نمی‌شود؛ در مارس، هنگام دریافت وجه، ۱۲٬۰۰۰ دلار درآمد ثبت می‌شود. مبنای تعهدی: هر ماه با ارائه خدمت، ۱٬۰۰۰ دلار درآمد ثبت می‌شود. وصول وجه نقد جداگانه ثبت می‌شود. منطق ثبت هر ماه قبل از وصول وجه: بدهکار حساب‌های دریافتنی ۱٬۰۰۰ / بستانکار درآمد خدمات ۱٬۰۰۰. هنگام وصول وجه: بدهکار وجه نقد ۱۲٬۰۰۰ / بستانکار حساب‌های دریافتنی ۱۲٬۰۰۰. Why accrual can feel strange Accrual accounting can show profit without cash or cash without profit. That is not a mistake; it is the point. The income statement measures performance, while the cash flow statement explains cash movement. Profit without cash: you sell on credit and collect later. Cash without profit: a customer pays in advance, so you record a liability until the work is done. Expense without cash: employees worked this month, but payday is next month. چرا مبنای تعهدی گاهی عجیب به نظر می‌رسد در حسابداری تعهدی ممکن است سود بدون وجه نقد یا وجه نقد بدون سود ببینید. این خطا نیست؛ هدف همین است. صورت سود و زیان عملکرد را اندازه می‌گیرد، و صورت جریان وجوه نقد حرکت پول را توضیح می‌دهد. سود بدون وجه نقد: فروش نسیه انجام می‌دهید و بعداً وصول می‌کنید. وجه نقد بدون سود: مشتری پیشاپیش پرداخت می‌کند، پس تا زمان انجام کار یک بدهی ثبت می‌شود. هزینه بدون وجه نقد: کارکنان این ماه کار کرده‌اند، اما روز پرداخت ماه بعد است. How to decide quickly Using cash basis? ask only: did cash come in or go out? Using accrual basis? ask: was revenue earned, or was an expense incurred? Cash and performance are in different periods? use receivables, payables, deferrals, or accruals to bridge the timing gap. Common mistake Do not read accrual net income as the same thing as bank-account cash. A profitable company can still run short on cash if customers have not paid yet. روش سریع تصمیم‌گیری مبنای نقدی؟ فقط بپرسید: آیا وجه وارد یا خارج شده است؟ مبنای تعهدی؟ بپرسید: آیا درآمد کسب شده، یا هزینه ایجاد شده است؟ وجه نقد و عملکرد در دوره‌های متفاوت‌اند؟ از دریافتنی، پرداختنی، پیش‌دریافت/پیش‌پرداخت یا معوق استفاده کنید تا فاصله زمانی را وصل کند. اشتباه رایج سود خالص تعهدی را با وجه نقد حساب بانکی یکی ندانید. شرکتی که سودآور است هم ممکن است کمبود نقدینگی داشته باشد، اگر مشتریان هنوز پرداخت نکرده باشند.';

const revenueRecognitionBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">Revenue recognition answers one of the most important accounting questions: <strong>when has the company earned the right to call something revenue?</strong> The five-step model slows the decision down so cash receipts, invoices, promises, discounts, and delivery timing do not get mixed together.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		شناسایی درآمد به یکی از مهم‌ترین سؤال‌های حسابداری پاسخ می‌دهد: <strong>شرکت چه زمانی حق دارد یک مبلغ را درآمد بنامد؟</strong> مدل پنج‌مرحله‌ای تصمیم را آرام و منظم می‌کند تا دریافت وجه، صدور فاکتور، وعده‌های قراردادی، تخفیف‌ها و زمان تحویل با هم قاطی نشوند.
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>Revenue is not recognized just because a customer paid, and not always just because an invoice was sent. Under accrual accounting, revenue is recognized when control of promised goods or services transfers to the customer.</p>
			<p>The five steps force you to identify the deal, identify what you promised, price the deal, split the price across promises, and then recognize revenue as each promise is fulfilled.</p>
			<div class="example"><span class="label">Memory hook</span>First understand the promise. Then recognize revenue when that promise is satisfied.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>درآمد فقط به این دلیل شناسایی نمی‌شود که مشتری پول داده، و همیشه فقط به این دلیل هم نیست که فاکتور صادر شده است. در حسابداری تعهدی، درآمد زمانی شناسایی می‌شود که کنترل کالا یا خدمت وعده‌داده‌شده به مشتری منتقل شود.</p>
			<p>مدل پنج‌مرحله‌ای شما را مجبور می‌کند معامله را بشناسید، وعده‌های داخل معامله را جدا کنید، قیمت را تعیین کنید، قیمت را بین وعده‌ها تقسیم کنید، و سپس درآمد را زمانی ثبت کنید که هر وعده انجام می‌شود.</p>
			<div class="example"><span class="label">یادسپار</span>اول وعده را بفهم. بعد وقتی آن وعده انجام شد، درآمد را شناسایی کن.</div>
		</div>
	</div>

	<div style="margin-top:18px; display:grid; grid-template-columns: 1fr; gap:16px;">
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">STEP 01</div>
			<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); font-weight:500; margin-top:5px;">Identify the contract <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· شناسایی قرارداد</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;">Is there an approved, enforceable agreement with clear rights and payment terms? If the customer probably will not pay, or the terms are not clear, you may not have a recognizable contract yet.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">آیا توافقی تأییدشده و قابل اجرا وجود دارد که حقوق طرفین و شرایط پرداخت در آن روشن باشد؟ اگر احتمال وصول پایین است یا شرایط مبهم است، شاید هنوز قرارداد قابل شناسایی نداشته باشید.</p>
		</div>
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">STEP 02</div>
			<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); font-weight:500; margin-top:5px;">Identify performance obligations <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· شناسایی تعهدات اجرا</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;">List each distinct promise. A product, installation, warranty service, software hosting, or support plan may be separate obligations if the customer can benefit from them separately.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">هر وعدهٔ جداگانه را فهرست کنید. کالا، نصب، خدمات گارانتی، میزبانی نرم‌افزار یا پشتیبانی ممکن است تعهدات جدا باشند، اگر مشتری بتواند از آن‌ها جداگانه منفعت ببرد.</p>
		</div>
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">STEP 03</div>
			<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); font-weight:500; margin-top:5px;">Determine transaction price <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· تعیین بهای معامله</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;">Decide how much consideration the company expects to receive. This includes fixed price, discounts, rebates, returns, bonuses, penalties, and other variable amounts.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">تعیین کنید شرکت انتظار دارد در برابر معامله چه مبلغی دریافت کند. این شامل قیمت ثابت، تخفیف، برگشت از فروش، پاداش، جریمه و سایر مبالغ متغیر است.</p>
		</div>
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">STEP 04</div>
			<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); font-weight:500; margin-top:5px;">Allocate the price <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· تخصیص بها</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;">If the contract has more than one obligation, split the transaction price using each obligation's standalone selling price. This prevents the whole bundle from being recognized too early.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">اگر قرارداد بیش از یک تعهد دارد، بهای معامله را بر اساس قیمت فروش مستقل هر تعهد تقسیم کنید. این کار مانع می‌شود کل بسته زودتر از موعد به درآمد تبدیل شود.</p>
		</div>
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">STEP 05</div>
			<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); font-weight:500; margin-top:5px;">Recognize revenue <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· شناسایی درآمد</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;">Recognize revenue when each obligation is satisfied: at a point in time, like delivery of a laptop, or over time, like monthly support or a long service contract.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;">درآمد را زمانی شناسایی کنید که هر تعهد انجام می‌شود: در یک نقطهٔ زمانی، مثل تحویل لپ‌تاپ، یا در طول زمان، مثل پشتیبانی ماهانه یا قرارداد خدماتی بلندمدت.</p>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Worked example · bundled sale</h3>
			<p>A company sells a laptop-and-support bundle for <strong>$1,200</strong>. The laptop's standalone selling price is <strong>$1,000</strong>; the one-year support plan's standalone selling price is <strong>$200</strong>.</p>
			<ul>
				<li><strong>Step 1:</strong> one approved customer contract.</li>
				<li><strong>Step 2:</strong> two obligations: laptop and support.</li>
				<li><strong>Step 3:</strong> transaction price is $1,200.</li>
				<li><strong>Step 4:</strong> allocate $1,000 to laptop and $200 to support.</li>
				<li><strong>Step 5:</strong> recognize $1,000 at delivery; recognize $200 over 12 months.</li>
			</ul>
			<div class="example"><span class="label">Journal logic</span>At delivery: Dr Cash/AR 1,200 · Cr Revenue 1,000 · Cr Deferred Revenue 200. Each month: Dr Deferred Revenue 16.67 · Cr Revenue 16.67.</div>
		</div>
		<div class="col-fa">
			<h3>مثال کاربردی · فروش بسته‌ای</h3>
			<p>شرکت یک بستهٔ لپ‌تاپ و پشتیبانی را به مبلغ <strong>۱٬۲۰۰ دلار</strong> می‌فروشد. قیمت فروش مستقل لپ‌تاپ <strong>۱٬۰۰۰ دلار</strong> و قیمت فروش مستقل پشتیبانی یک‌ساله <strong>۲۰۰ دلار</strong> است.</p>
			<ul>
				<li><strong>مرحلهٔ ۱:</strong> یک قرارداد تأییدشده با مشتری وجود دارد.</li>
				<li><strong>مرحلهٔ ۲:</strong> دو تعهد داریم: لپ‌تاپ و پشتیبانی.</li>
				<li><strong>مرحلهٔ ۳:</strong> بهای معامله ۱٬۲۰۰ دلار است.</li>
				<li><strong>مرحلهٔ ۴:</strong> ۱٬۰۰۰ دلار به لپ‌تاپ و ۲۰۰ دلار به پشتیبانی تخصیص می‌یابد.</li>
				<li><strong>مرحلهٔ ۵:</strong> ۱٬۰۰۰ دلار هنگام تحویل شناسایی می‌شود؛ ۲۰۰ دلار طی ۱۲ ماه شناسایی می‌شود.</li>
			</ul>
			<div class="example"><span class="label">منطق ثبت</span>هنگام تحویل: بدهکار وجه نقد/دریافتنی ۱٬۲۰۰ · بستانکار درآمد ۱٬۰۰۰ · بستانکار درآمد انتقالی ۲۰۰. هر ماه: بدهکار درآمد انتقالی ۱۶٫۶۷ · بستانکار درآمد ۱۶٫۶۷.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to decide quickly</h3>
			<ul>
				<li><strong>Did cash arrive before performance?</strong> record a liability first, not revenue.</li>
				<li><strong>Are there multiple promises?</strong> split the price before recognizing revenue.</li>
				<li><strong>Is control transferred all at once?</strong> recognize at a point in time.</li>
				<li><strong>Is service delivered continuously?</strong> recognize over time.</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>Cash receipt, invoice date, contract signing, and revenue recognition can all be different dates. Step 5 is about transfer of control, not paperwork.</div>
		</div>
		<div class="col-fa">
			<h3>روش سریع تصمیم‌گیری</h3>
			<ul>
				<li><strong>وجه قبل از انجام تعهد دریافت شده؟</strong> ابتدا بدهی ثبت کنید، نه درآمد.</li>
				<li><strong>چند وعده در قرارداد وجود دارد؟</strong> قبل از شناسایی درآمد، قیمت را تقسیم کنید.</li>
				<li><strong>کنترل یک‌باره منتقل می‌شود؟</strong> درآمد را در یک نقطهٔ زمانی شناسایی کنید.</li>
				<li><strong>خدمت پیوسته ارائه می‌شود؟</strong> درآمد را در طول زمان شناسایی کنید.</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>دریافت وجه، تاریخ فاکتور، امضای قرارداد و شناسایی درآمد می‌توانند چهار تاریخ متفاوت باشند. مرحلهٔ ۵ دربارهٔ انتقال کنترل است، نه کاغذبازی.</div>
		</div>
	</div>`;

const revenueRecognitionPlain =
	'Revenue recognition answers one of the most important accounting questions: when has the company earned the right to call something revenue? The five-step model slows the decision down so cash receipts, invoices, promises, discounts, and delivery timing do not get mixed together. شناسایی درآمد به یکی از مهم‌ترین سؤال‌های حسابداری پاسخ می‌دهد: شرکت چه زمانی حق دارد یک مبلغ را درآمد بنامد؟ مدل پنج‌مرحله‌ای تصمیم را آرام و منظم می‌کند تا دریافت وجه، صدور فاکتور، وعده‌های قراردادی، تخفیف‌ها و زمان تحویل با هم قاطی نشوند. Big idea Revenue is not recognized just because a customer paid, and not always just because an invoice was sent. Under accrual accounting, revenue is recognized when control of promised goods or services transfers to the customer. The five steps force you to identify the deal, identify what you promised, price the deal, split the price across promises, and then recognize revenue as each promise is fulfilled. Memory hook First understand the promise. Then recognize revenue when that promise is satisfied. ایده اصلی درآمد فقط به این دلیل شناسایی نمی‌شود که مشتری پول داده، و همیشه فقط به این دلیل هم نیست که فاکتور صادر شده است. در حسابداری تعهدی، درآمد زمانی شناسایی می‌شود که کنترل کالا یا خدمت وعده‌داده‌شده به مشتری منتقل شود. مدل پنج‌مرحله‌ای شما را مجبور می‌کند معامله را بشناسید، وعده‌های داخل معامله را جدا کنید، قیمت را تعیین کنید، قیمت را بین وعده‌ها تقسیم کنید، و سپس درآمد را زمانی ثبت کنید که هر وعده انجام می‌شود. یادسپار اول وعده را بفهم. بعد وقتی آن وعده انجام شد، درآمد را شناسایی کن. Step 1 Identify the contract. Step 2 Identify performance obligations. Step 3 Determine transaction price. Step 4 Allocate the price. Step 5 Recognize revenue when each obligation is satisfied. مرحله ۱ شناسایی قرارداد. مرحله ۲ شناسایی تعهدات اجرا. مرحله ۳ تعیین بهای معامله. مرحله ۴ تخصیص بها. مرحله ۵ شناسایی درآمد وقتی هر تعهد انجام می‌شود. Worked example bundled sale A company sells a laptop-and-support bundle for $1,200. Laptop standalone price is $1,000 and one-year support standalone price is $200. One contract, two obligations, $1,200 transaction price, $1,000 allocated to laptop and $200 to support. Recognize $1,000 at delivery and $200 over 12 months. Journal logic At delivery: Dr Cash/AR 1,200 / Cr Revenue 1,000 / Cr Deferred Revenue 200. Each month: Dr Deferred Revenue 16.67 / Cr Revenue 16.67. مثال کاربردی فروش بسته‌ای شرکت یک بسته لپ‌تاپ و پشتیبانی را به مبلغ ۱٬۲۰۰ دلار می‌فروشد. قیمت مستقل لپ‌تاپ ۱٬۰۰۰ دلار و قیمت مستقل پشتیبانی یک‌ساله ۲۰۰ دلار است. یک قرارداد، دو تعهد، بهای معامله ۱٬۲۰۰ دلار، تخصیص ۱٬۰۰۰ به لپ‌تاپ و ۲۰۰ به پشتیبانی. ۱٬۰۰۰ دلار هنگام تحویل و ۲۰۰ دلار طی ۱۲ ماه شناسایی می‌شود. How to decide quickly Did cash arrive before performance? record a liability first, not revenue. Are there multiple promises? split the price before recognizing revenue. Is control transferred all at once? recognize at a point in time. Is service delivered continuously? recognize over time. Common mistake Cash receipt, invoice date, contract signing, and revenue recognition can all be different dates. Step 5 is about transfer of control, not paperwork. روش سریع تصمیم‌گیری وجه قبل از انجام تعهد دریافت شده؟ ابتدا بدهی ثبت کنید، نه درآمد. چند وعده در قرارداد وجود دارد؟ قبل از شناسایی درآمد، قیمت را تقسیم کنید. کنترل یک‌باره منتقل می‌شود؟ درآمد را در یک نقطه زمانی شناسایی کنید. خدمت پیوسته ارائه می‌شود؟ درآمد را در طول زمان شناسایی کنید. اشتباه رایج دریافت وجه، تاریخ فاکتور، امضای قرارداد و شناسایی درآمد می‌توانند چهار تاریخ متفاوت باشند. مرحله ۵ درباره انتقال کنترل است، نه کاغذبازی.';

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

const deferralsAccrualsBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">Deferrals and accruals are the four basic ways accounting separates <strong>cash timing</strong> from <strong>economic timing</strong>. The question is not just "did cash move?" The better question is: <strong>has the revenue been earned, or has the expense been incurred?</strong></p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		پیش‌دریافت/پیش‌پرداخت و معوق‌ها چهار الگوی اصلی‌اند که حسابداری با آن‌ها <strong>زمان جابه‌جایی وجه نقد</strong> را از <strong>زمان وقوع اقتصادی</strong> جدا می‌کند. سؤال فقط این نیست که «آیا پول جابه‌جا شده؟» سؤال بهتر این است: <strong>آیا درآمد کسب شده، یا هزینه ایجاد شده است؟</strong>
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>The map</h3>
			<p>Every pattern comes from two choices: cash can come <strong>before</strong> or <strong>after</strong> the accounting event; the event can be on the <strong>revenue</strong> side or the <strong>expense</strong> side.</p>
			<p>If cash happens first, the first entry parks something on the balance sheet. If the economic event happens first, the adjusting entry creates a receivable or payable because cash has not caught up yet.</p>
			<div class="example"><span class="label">Shortcut</span>Cash first = wait on the balance sheet. Cash later = record income statement now, collect or pay later.</div>
		</div>
		<div class="col-fa">
			<h3>نقشهٔ ذهنی</h3>
			<p>هر الگو از دو انتخاب ساخته می‌شود: وجه نقد می‌تواند <strong>قبل</strong> یا <strong>بعد</strong> از رویداد حسابداری جابه‌جا شود؛ خود رویداد هم می‌تواند در سمت <strong>درآمد</strong> یا سمت <strong>هزینه</strong> باشد.</p>
			<p>اگر وجه نقد اول جابه‌جا شود، ثبت اول چیزی را موقتاً در ترازنامه نگه می‌دارد. اگر رویداد اقتصادی اول رخ دهد، ثبت اصلاحی یک دریافتنی یا پرداختنی ایجاد می‌کند، چون وجه نقد هنوز به رویداد نرسیده است.</p>
			<div class="example"><span class="label">میان‌بر</span>وجه ابتدا = انتظار در ترازنامه. وجه بعداً = اثر صورت سود و زیان را اکنون ثبت کن، دریافت یا پرداخت نقدی را بعداً انجام بده.</div>
		</div>
	</div>

	<div style="margin-top:18px; display:grid; grid-template-columns: 1fr; gap:18px;">
		<div>
			<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); font-weight:500;">1. Deferred Revenue <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· پیش‌دریافت درآمد</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Cash now, revenue later.</strong> The customer pays before you deliver. Until you do the work, you owe the customer goods or services, so the first entry creates a liability.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>وجه اکنون، درآمد بعداً.</strong> مشتری قبل از ارائهٔ کالا یا خدمت پول می‌دهد. تا وقتی کار را انجام نداده‌اید، به مشتری کالا یا خدمت بدهکارید؛ بنابراین ثبت اول یک بدهی ایجاد می‌کند.</p>
			<div style="font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.75; margin-top:8px;">
				<div>Example: customer pays $1,200 for a 12-month subscription.</div>
				<div>At receipt: Dr Cash 1,200 · Cr Unearned Revenue 1,200</div>
				<div>Each month: Dr Unearned Revenue 100 · Cr Revenue 100</div>
			</div>
		</div>

		<div>
			<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); font-weight:500;">2. Prepaid Expense <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· هزینهٔ پیش‌پرداخت</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Cash now, expense later.</strong> You pay before using the benefit. Until the benefit is consumed, it is an asset, not an expense.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>وجه اکنون، هزینه بعداً.</strong> قبل از مصرف فایده پول می‌دهید. تا زمانی که فایده مصرف نشده، آن مبلغ دارایی است، نه هزینه.</p>
			<div style="font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.75; margin-top:8px;">
				<div>Example: company pays $12,000 for one year of insurance.</div>
				<div>At payment: Dr Prepaid Insurance 12,000 · Cr Cash 12,000</div>
				<div>Each month: Dr Insurance Expense 1,000 · Cr Prepaid Insurance 1,000</div>
			</div>
		</div>

		<div>
			<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); font-weight:500;">3. Accrued Revenue <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· درآمد تحقق‌یافتهٔ وصول‌نشده</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Revenue now, cash later.</strong> You have already earned the revenue, but the customer has not paid yet. The adjustment records revenue and creates a receivable.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>درآمد اکنون، وجه بعداً.</strong> درآمد را کسب کرده‌اید، اما مشتری هنوز پرداخت نکرده است. ثبت اصلاحی درآمد را ثبت می‌کند و یک حساب دریافتنی می‌سازد.</p>
			<div style="font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.75; margin-top:8px;">
				<div>Example: consulting work worth $800 is completed before billing.</div>
				<div>When earned: Dr Accounts Receivable 800 · Cr Revenue 800</div>
				<div>When collected: Dr Cash 800 · Cr Accounts Receivable 800</div>
			</div>
		</div>

		<div>
			<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); font-weight:500;">4. Accrued Expense <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· هزینهٔ ایجادشدهٔ پرداخت‌نشده</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.6;"><strong>Expense now, cash later.</strong> You have used the benefit or employees have worked, but you have not paid yet. The adjustment records the expense and creates a payable.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.85;"><strong>هزینه اکنون، وجه بعداً.</strong> فایده را مصرف کرده‌اید یا کارکنان کار کرده‌اند، اما هنوز پرداخت نکرده‌اید. ثبت اصلاحی هزینه را ثبت می‌کند و یک پرداختنی می‌سازد.</p>
			<div style="font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.75; margin-top:8px;">
				<div>Example: employees earn $3,000 of wages before payday.</div>
				<div>When incurred: Dr Wage Expense 3,000 · Cr Wages Payable 3,000</div>
				<div>When paid: Dr Wages Payable 3,000 · Cr Cash 3,000</div>
			</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to choose the entry</h3>
			<ul>
				<li><strong>Cash received before earning?</strong> Deferred revenue: liability first, revenue later.</li>
				<li><strong>Cash paid before using?</strong> Prepaid expense: asset first, expense later.</li>
				<li><strong>Earned before cash?</strong> Accrued revenue: revenue plus receivable.</li>
				<li><strong>Incurred before cash?</strong> Accrued expense: expense plus payable.</li>
			</ul>
			<div class="pitfall"><span class="label">Pattern</span>Adjusting entries usually pair one income-statement account with one balance-sheet account. Revenue pairs with receivable or unearned revenue; expense pairs with prepaid asset or payable.</div>
		</div>
		<div class="col-fa">
			<h3>چطور ثبت درست را انتخاب کنیم</h3>
			<ul>
				<li><strong>وجه قبل از کسب درآمد دریافت شده؟</strong> پیش‌دریافت درآمد: اول بدهی، بعد درآمد.</li>
				<li><strong>وجه قبل از مصرف فایده پرداخت شده؟</strong> هزینهٔ پیش‌پرداخت: اول دارایی، بعد هزینه.</li>
				<li><strong>درآمد قبل از دریافت وجه کسب شده؟</strong> درآمد معوق/تحقق‌یافته: درآمد همراه دریافتنی.</li>
				<li><strong>هزینه قبل از پرداخت وجه ایجاد شده؟</strong> هزینهٔ معوق: هزینه همراه پرداختنی.</li>
			</ul>
			<div class="pitfall"><span class="label">الگو</span>ثبت‌های اصلاحی معمولاً یک حساب صورت سود و زیان را با یک حساب ترازنامه جفت می‌کنند. درآمد با دریافتنی یا پیش‌دریافت جفت می‌شود؛ هزینه با دارایی پیش‌پرداخت یا پرداختنی.</div>
		</div>
	</div>`;

const deferralsAccrualsPlain =
	'Deferrals and accruals are the four basic ways accounting separates cash timing from economic timing. The question is not just did cash move? The better question is: has the revenue been earned, or has the expense been incurred? پیش‌دریافت/پیش‌پرداخت و معوق‌ها چهار الگوی اصلی‌اند که حسابداری با آن‌ها زمان جابه‌جایی وجه نقد را از زمان وقوع اقتصادی جدا می‌کند. سؤال فقط این نیست که آیا پول جابه‌جا شده؟ سؤال بهتر این است: آیا درآمد کسب شده، یا هزینه ایجاد شده است؟ The map Every pattern comes from two choices: cash can come before or after the accounting event; the event can be on the revenue side or the expense side. If cash happens first, the first entry parks something on the balance sheet. If the economic event happens first, the adjusting entry creates a receivable or payable because cash has not caught up yet. Shortcut Cash first = wait on the balance sheet. Cash later = record income statement now, collect or pay later. نقشه ذهنی هر الگو از دو انتخاب ساخته می‌شود: وجه نقد می‌تواند قبل یا بعد از رویداد حسابداری جابه‌جا شود؛ خود رویداد هم می‌تواند در سمت درآمد یا سمت هزینه باشد. اگر وجه نقد اول جابه‌جا شود، ثبت اول چیزی را موقتاً در ترازنامه نگه می‌دارد. اگر رویداد اقتصادی اول رخ دهد، ثبت اصلاحی یک دریافتنی یا پرداختنی ایجاد می‌کند، چون وجه نقد هنوز به رویداد نرسیده است. میان‌بر وجه ابتدا = انتظار در ترازنامه. وجه بعداً = اثر صورت سود و زیان را اکنون ثبت کن، دریافت یا پرداخت نقدی را بعداً انجام بده. 1. Deferred Revenue پیش‌دریافت درآمد Cash now, revenue later. The customer pays before you deliver. Until you do the work, you owe the customer goods or services, so the first entry creates a liability. وجه اکنون، درآمد بعداً. مشتری قبل از ارائه کالا یا خدمت پول می‌دهد. تا وقتی کار را انجام نداده‌اید، به مشتری کالا یا خدمت بدهکارید؛ بنابراین ثبت اول یک بدهی ایجاد می‌کند. Example: customer pays $1,200 for a 12-month subscription. At receipt: Dr Cash 1,200 / Cr Unearned Revenue 1,200. Each month: Dr Unearned Revenue 100 / Cr Revenue 100. 2. Prepaid Expense هزینه پیش‌پرداخت Cash now, expense later. You pay before using the benefit. Until the benefit is consumed, it is an asset, not an expense. وجه اکنون، هزینه بعداً. قبل از مصرف فایده پول می‌دهید. تا زمانی که فایده مصرف نشده، آن مبلغ دارایی است، نه هزینه. Example: company pays $12,000 for one year of insurance. At payment: Dr Prepaid Insurance 12,000 / Cr Cash 12,000. Each month: Dr Insurance Expense 1,000 / Cr Prepaid Insurance 1,000. 3. Accrued Revenue درآمد تحقق‌یافته وصول‌نشده Revenue now, cash later. You have already earned the revenue, but the customer has not paid yet. The adjustment records revenue and creates a receivable. درآمد اکنون، وجه بعداً. درآمد را کسب کرده‌اید، اما مشتری هنوز پرداخت نکرده است. ثبت اصلاحی درآمد را ثبت می‌کند و یک حساب دریافتنی می‌سازد. Example: consulting work worth $800 is completed before billing. When earned: Dr Accounts Receivable 800 / Cr Revenue 800. When collected: Dr Cash 800 / Cr Accounts Receivable 800. 4. Accrued Expense هزینه ایجادشده پرداخت‌نشده Expense now, cash later. You have used the benefit or employees have worked, but you have not paid yet. The adjustment records the expense and creates a payable. هزینه اکنون، وجه بعداً. فایده را مصرف کرده‌اید یا کارکنان کار کرده‌اند، اما هنوز پرداخت نکرده‌اید. ثبت اصلاحی هزینه را ثبت می‌کند و یک پرداختنی می‌سازد. Example: employees earn $3,000 of wages before payday. When incurred: Dr Wage Expense 3,000 / Cr Wages Payable 3,000. When paid: Dr Wages Payable 3,000 / Cr Cash 3,000. How to choose the entry Cash received before earning? Deferred revenue: liability first, revenue later. Cash paid before using? Prepaid expense: asset first, expense later. Earned before cash? Accrued revenue: revenue plus receivable. Incurred before cash? Accrued expense: expense plus payable. Pattern Adjusting entries usually pair one income-statement account with one balance-sheet account. Revenue pairs with receivable or unearned revenue; expense pairs with prepaid asset or payable. چطور ثبت درست را انتخاب کنیم وجه قبل از کسب درآمد دریافت شده؟ پیش‌دریافت درآمد: اول بدهی، بعد درآمد. وجه قبل از مصرف فایده پرداخت شده؟ هزینه پیش‌پرداخت: اول دارایی، بعد هزینه. درآمد قبل از دریافت وجه کسب شده؟ درآمد معوق/تحقق‌یافته: درآمد همراه دریافتنی. هزینه قبل از پرداخت وجه ایجاد شده؟ هزینه معوق: هزینه همراه پرداختنی. الگو ثبت‌های اصلاحی معمولاً یک حساب صورت سود و زیان را با یک حساب ترازنامه جفت می‌کنند. درآمد با دریافتنی یا پیش‌دریافت جفت می‌شود؛ هزینه با دارایی پیش‌پرداخت یا پرداختنی.';

const slideOverrides: Partial<Record<string, Partial<Slide>>> = {
	'21-cash-vs-accrual': {
		body: cashVsAccrualBody,
		plain: cashVsAccrualPlain
	},
	'22-revenue-recognition': {
		body: revenueRecognitionBody,
		plain: revenueRecognitionPlain
	},
	'23-matching': {
		body: matchingPrincipleBody,
		plain: matchingPrinciplePlain
	},
	'24-deferrals-accruals': {
		body: deferralsAccrualsBody,
		plain: deferralsAccrualsPlain
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
