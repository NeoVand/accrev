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

const accountingEquationBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">The accounting equation is the first rule of the whole system: <strong>Assets = Liabilities + Equity</strong>. It says every resource a company controls must have been financed by someone: either creditors or owners.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		معادلهٔ حسابداری اولین قاعدهٔ کل سیستم است: <strong>دارایی‌ها = بدهی‌ها + حقوق صاحبان سهام</strong>. یعنی هر منبعی که شرکت در اختیار دارد، حتماً از جایی تأمین مالی شده است: یا از طرف طلبکاران، یا از طرف مالکان.
	</div>

	<div style="margin:18px 0 18px 0; display:grid; grid-template-columns: 1fr; gap:10px; text-align:center;">
		<div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:14px 22px; font-family:'Fraunces',serif; font-size:24px; font-weight:400;">
			<div>
				<div style="color:var(--navy);">Assets</div>
				<div style="font-family:'Vazirmatn',sans-serif; font-size:17px; font-weight:500; color:var(--tan-deep); margin-top:4px;">دارایی‌ها</div>
			</div>
			<div style="color:var(--tan); font-weight:300; font-size:25px;">=</div>
			<div>
				<div style="color:var(--navy);">Liabilities</div>
				<div style="font-family:'Vazirmatn',sans-serif; font-size:17px; font-weight:500; color:var(--tan-deep); margin-top:4px;">بدهی‌ها</div>
			</div>
			<div style="color:var(--tan); font-weight:300; font-size:25px;">+</div>
			<div>
				<div style="color:var(--navy);">Equity</div>
				<div style="font-family:'Vazirmatn',sans-serif; font-size:17px; font-weight:500; color:var(--tan-deep); margin-top:4px;">حقوق صاحبان سهام</div>
			</div>
		</div>
		<div style="font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink-soft); letter-spacing:0.08em;">what the company has = claims against what the company has</div>
		<div style="font-family:'Vazirmatn',sans-serif; direction:rtl; font-size:13px; color:var(--ink-soft);">آنچه شرکت دارد = ادعاها نسبت به آنچه شرکت دارد</div>
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>The left side shows <strong>resources</strong>: cash, inventory, equipment, receivables, buildings, software, and other things the business controls and expects to benefit from.</p>
			<p>The right side shows <strong>claims</strong> on those resources. Creditors have claims called liabilities. Owners have the residual claim called equity. There is no third source.</p>
			<div class="example"><span class="label">Memory hook</span>Assets show where value sits. Liabilities and equity show who has a claim on that value.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>سمت چپ <strong>منابع</strong> را نشان می‌دهد: وجه نقد، موجودی کالا، تجهیزات، حساب‌های دریافتنی، ساختمان، نرم‌افزار و چیزهای دیگری که کسب‌وکار کنترل می‌کند و انتظار منفعت از آن‌ها دارد.</p>
			<p>سمت راست <strong>ادعاها</strong> نسبت به آن منابع را نشان می‌دهد. طلبکاران ادعایی به نام بدهی دارند. مالکان ادعای باقی‌مانده‌ای به نام حقوق صاحبان سهام دارند. محل سومی وجود ندارد.</p>
			<div class="example"><span class="label">یادسپار</span>دارایی‌ها نشان می‌دهند ارزش کجا نشسته است. بدهی‌ها و حقوق صاحبان سهام نشان می‌دهند چه کسی روی آن ارزش ادعا دارد.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>What each part means</h3>
			<ul>
				<li><strong>Assets:</strong> economic resources controlled by the company. They are useful because they can create future benefit.</li>
				<li><strong>Liabilities:</strong> obligations to outsiders. The company must pay cash, deliver goods, provide services, or otherwise settle them later.</li>
				<li><strong>Equity:</strong> the owners' claim after liabilities. In plain language: what would be left for owners if assets were used to pay debts.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>معنای هر بخش</h3>
			<ul>
				<li><strong>دارایی‌ها:</strong> منابع اقتصادی تحت کنترل شرکت. ارزشمندند چون می‌توانند در آینده منفعت ایجاد کنند.</li>
				<li><strong>بدهی‌ها:</strong> تعهدات شرکت به افراد یا نهادهای بیرونی. شرکت باید بعداً وجه پرداخت کند، کالا تحویل دهد، خدمت ارائه کند، یا به شکل دیگری تسویه کند.</li>
				<li><strong>حقوق صاحبان سهام:</strong> ادعای مالکان پس از بدهی‌ها. به زبان ساده: چیزی که اگر دارایی‌ها برای پرداخت بدهی‌ها استفاده شوند، برای مالکان باقی می‌ماند.</li>
			</ul>
		</div>
	</div>

	<div style="margin-top:18px;">
		<div style="font-family:'Fraunces',serif; font-size:18px; color:var(--navy); text-align:center;">Two simple transactions</div>
		<div style="display:grid; grid-template-columns: 1fr 92px 92px 92px; gap:6px 10px; font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.55; margin-top:12px;">
			<span style="font-weight:700; color:var(--navy);">Transaction</span><span style="font-weight:700; color:var(--navy); text-align:right;">Assets</span><span style="font-weight:700; color:var(--navy); text-align:right;">Liabilities</span><span style="font-weight:700; color:var(--navy); text-align:right;">Equity</span>
			<span>Owner invests cash</span><span style="text-align:right;">+50,000</span><span style="text-align:right;">0</span><span style="text-align:right;">+50,000</span>
			<span>Bank loan received</span><span style="text-align:right;">+20,000</span><span style="text-align:right;">+20,000</span><span style="text-align:right;">0</span>
			<span style="border-top:1px solid var(--hairline); padding-top:6px; font-weight:700; color:var(--navy);">Ending balance</span><span style="border-top:1px solid var(--hairline); padding-top:6px; text-align:right; font-weight:700; color:var(--navy);">70,000</span><span style="border-top:1px solid var(--hairline); padding-top:6px; text-align:right; font-weight:700; color:var(--navy);">20,000</span><span style="border-top:1px solid var(--hairline); padding-top:6px; text-align:right; font-weight:700; color:var(--navy);">50,000</span>
		</div>
		<p style="margin-top:10px; font-size:14px; line-height:1.7;"><strong>Check:</strong> 70,000 = 20,000 + 50,000. The equation still balances because each transaction changed both sides in a connected way.</p>
		<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.9;"><strong>کنترل:</strong> ۷۰٬۰۰۰ = ۲۰٬۰۰۰ + ۵۰٬۰۰۰. معادله هنوز تراز است، چون هر معامله دو طرف را به شکلی مرتبط تغییر داده است.</p>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How transactions keep it balanced</h3>
			<p>A transaction can affect the equation in different ways, but the total must always stay equal.</p>
			<ul>
				<li><strong>Buy equipment with cash:</strong> one asset goes up, another asset goes down. Total assets stay the same.</li>
				<li><strong>Buy inventory on credit:</strong> assets go up and liabilities go up by the same amount.</li>
				<li><strong>Earn revenue in cash:</strong> assets go up and equity eventually goes up through retained earnings.</li>
				<li><strong>Pay a bill:</strong> assets go down and liabilities go down by the same amount.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>معاملات چگونه تعادل را حفظ می‌کنند</h3>
			<p>یک معامله می‌تواند معادله را به شکل‌های مختلف تغییر دهد، اما جمع دو طرف همیشه باید برابر بماند.</p>
			<ul>
				<li><strong>خرید تجهیزات با وجه نقد:</strong> یک دارایی افزایش می‌یابد و دارایی دیگری کاهش می‌یابد. جمع دارایی‌ها تغییر نمی‌کند.</li>
				<li><strong>خرید موجودی به صورت نسیه:</strong> دارایی‌ها افزایش می‌یابند و بدهی‌ها به همان مبلغ افزایش می‌یابند.</li>
				<li><strong>کسب درآمد نقدی:</strong> دارایی‌ها افزایش می‌یابند و حقوق صاحبان سهام در نهایت از طریق سود انباشته افزایش می‌یابد.</li>
				<li><strong>پرداخت یک بدهی:</strong> دارایی‌ها کاهش می‌یابند و بدهی‌ها به همان مبلغ کاهش می‌یابند.</li>
			</ul>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to use it as a self-check</h3>
			<ul>
				<li><strong>First ask:</strong> what asset changed?</li>
				<li><strong>Then ask:</strong> was it funded by a liability, by owners, or by earnings?</li>
				<li><strong>Finally ask:</strong> does Assets = Liabilities + Equity after the entry?</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>Do not think equity means cash in the owner's pocket. Equity is a claim inside the accounting records. The company may have high equity and very little cash if its value is tied up in inventory, equipment, or receivables.</div>
		</div>
		<div class="col-fa">
			<h3>روش استفاده به‌عنوان کنترل سریع</h3>
			<ul>
				<li><strong>اول بپرسید:</strong> کدام دارایی تغییر کرد؟</li>
				<li><strong>بعد بپرسید:</strong> این تغییر از بدهی تأمین شد، از مالکان، یا از سودآوری؟</li>
				<li><strong>در پایان بپرسید:</strong> آیا پس از ثبت، دارایی‌ها = بدهی‌ها + حقوق صاحبان سهام است؟</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>حقوق صاحبان سهام را با پول نقد در جیب مالک یکی ندانید. حقوق صاحبان سهام یک ادعا در سوابق حسابداری است. ممکن است شرکت حقوق صاحبان سهام بالایی داشته باشد اما وجه نقد کمی، چون ارزش آن در موجودی، تجهیزات یا دریافتنی‌ها گیر کرده است.</div>
		</div>
	</div>`;

const accountingEquationPlain =
	'The accounting equation is the first rule of the whole system: Assets = Liabilities + Equity. It says every resource a company controls must have been financed by someone: either creditors or owners. معادله حسابداری اولین قاعده کل سیستم است: دارایی‌ها = بدهی‌ها + حقوق صاحبان سهام. یعنی هر منبعی که شرکت در اختیار دارد، حتماً از جایی تأمین مالی شده است: یا از طرف طلبکاران، یا از طرف مالکان. Assets = Liabilities + Equity. What the company has = claims against what the company has. آنچه شرکت دارد = ادعاها نسبت به آنچه شرکت دارد. Big idea The left side shows resources: cash, inventory, equipment, receivables, buildings, software, and other things the business controls and expects to benefit from. The right side shows claims on those resources. Creditors have claims called liabilities. Owners have the residual claim called equity. There is no third source. ایده اصلی سمت چپ منابع را نشان می‌دهد: وجه نقد، موجودی کالا، تجهیزات، حساب‌های دریافتنی، ساختمان، نرم‌افزار و چیزهای دیگری که کسب‌وکار کنترل می‌کند و انتظار منفعت از آن‌ها دارد. سمت راست ادعاها نسبت به آن منابع را نشان می‌دهد. طلبکاران ادعایی به نام بدهی دارند. مالکان ادعای باقی‌مانده‌ای به نام حقوق صاحبان سهام دارند. What each part means Assets are economic resources controlled by the company. Liabilities are obligations to outsiders. Equity is the owners claim after liabilities. معنای هر بخش دارایی‌ها منابع اقتصادی تحت کنترل شرکت هستند. بدهی‌ها تعهدات شرکت به افراد یا نهادهای بیرونی هستند. حقوق صاحبان سهام ادعای مالکان پس از بدهی‌هاست. Two simple transactions: owner invests 50,000 cash, so assets increase 50,000 and equity increases 50,000. Bank loan received 20,000, so assets increase 20,000 and liabilities increase 20,000. Ending balance: assets 70,000, liabilities 20,000, equity 50,000. Check: 70,000 = 20,000 + 50,000. دو معامله ساده: مالک ۵۰٬۰۰۰ وجه نقد سرمایه‌گذاری می‌کند، پس دارایی‌ها ۵۰٬۰۰۰ افزایش می‌یابد و حقوق صاحبان سهام ۵۰٬۰۰۰ افزایش می‌یابد. وام بانکی ۲۰٬۰۰۰ دریافت می‌شود، پس دارایی‌ها ۲۰٬۰۰۰ و بدهی‌ها ۲۰٬۰۰۰ افزایش می‌یابند. مانده پایان: دارایی‌ها ۷۰٬۰۰۰، بدهی‌ها ۲۰٬۰۰۰، حقوق صاحبان سهام ۵۰٬۰۰۰. کنترل: ۷۰٬۰۰۰ = ۲۰٬۰۰۰ + ۵۰٬۰۰۰. How transactions keep it balanced Buy equipment with cash: one asset up, another asset down. Buy inventory on credit: assets up and liabilities up. Earn revenue in cash: assets up and equity eventually up through retained earnings. Pay a bill: assets down and liabilities down. معاملات چگونه تعادل را حفظ می‌کنند خرید تجهیزات با وجه نقد: یک دارایی بالا و دارایی دیگر پایین. خرید موجودی نسیه: دارایی‌ها بالا و بدهی‌ها بالا. کسب درآمد نقدی: دارایی‌ها بالا و حقوق صاحبان سهام در نهایت از طریق سود انباشته بالا. پرداخت بدهی: دارایی‌ها پایین و بدهی‌ها پایین. How to use it as a self-check First ask what asset changed. Then ask whether it was funded by a liability, by owners, or by earnings. Finally ask whether Assets = Liabilities + Equity after the entry. Common mistake Equity is not cash in the owner pocket. Equity is a claim inside the accounting records. روش کنترل سریع اول بپرسید کدام دارایی تغییر کرد. بعد بپرسید این تغییر از بدهی تأمین شد، از مالکان، یا از سودآوری. در پایان بپرسید آیا پس از ثبت دارایی‌ها = بدهی‌ها + حقوق صاحبان سهام است. اشتباه رایج حقوق صاحبان سهام پول نقد در جیب مالک نیست. حقوق صاحبان سهام یک ادعا در سوابق حسابداری است.';

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

const balanceSheetBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">The balance sheet is a <strong>snapshot</strong>: it shows what the company owns, what it owes, and what belongs to the owners at one exact date. It does not show a whole month or year of activity; it freezes the company at a single moment.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		ترازنامه یک <strong>عکس لحظه‌ای</strong> است: در یک تاریخ مشخص نشان می‌دهد شرکت چه چیزهایی دارد، چه بدهی‌هایی دارد، و چه مقدار متعلق به مالکان است. ترازنامه فعالیت کل ماه یا سال را نشان نمی‌دهد؛ فقط وضعیت شرکت را در یک لحظه ثابت می‌کند.
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>Every balance sheet is built on one equation: <strong>Assets = Liabilities + Equity</strong>. The left side shows resources controlled by the company. The right side explains who has a claim on those resources: creditors first, owners second.</p>
			<p>This is why a balance sheet must balance. It is not a coincidence or a formatting rule; it is the logic of ownership and financing.</p>
			<div class="example"><span class="label">Memory hook</span>Assets are the stuff. Liabilities and equity explain who paid for the stuff.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>هر ترازنامه روی یک معادله ساخته می‌شود: <strong>دارایی‌ها = بدهی‌ها + حقوق مالکان</strong>. سمت چپ منابع تحت کنترل شرکت را نشان می‌دهد. سمت راست توضیح می‌دهد چه کسانی روی آن منابع ادعا دارند: اول طلبکاران، بعد مالکان.</p>
			<p>به همین دلیل ترازنامه باید تراز باشد. این موضوع تصادفی یا صرفاً قاعدهٔ ظاهری نیست؛ منطق مالکیت و تأمین مالی است.</p>
			<div class="example"><span class="label">یادسپار</span>دارایی‌ها «چیزهایی» هستند که شرکت دارد. بدهی و حقوق مالکان توضیح می‌دهند چه کسی هزینهٔ آن چیزها را تأمین کرده است.</div>
		</div>
	</div>

	<div style="margin-top:18px;">
		<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); text-align:center;">Ranger Coffee Co. · Balance Sheet</div>
		<div style="font-family:'JetBrains Mono',monospace; font-size:12px; text-align:center; color:var(--ink-soft);">As of Dec 31, 2025</div>
		<div style="display:grid; grid-template-columns: 1fr 92px; gap:4px 12px; font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.55; margin-top:12px;">
			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--navy); font-size:13px; letter-spacing:0.15em; margin-top:4px;">ASSETS</div>
			<span>Cash</span><span style="text-align:right;">24,000</span>
			<span>Accounts Receivable</span><span style="text-align:right;">18,500</span>
			<span>Inventory</span><span style="text-align:right;">32,000</span>
			<span>Prepaid Insurance</span><span style="text-align:right;">2,000</span>
			<span style="color:var(--ink-soft);">Current assets</span><span style="text-align:right; color:var(--navy); font-weight:600;">76,500</span>
			<span>Equipment</span><span style="text-align:right;">60,000</span>
			<span style="color:var(--ink-soft);">Less: Acc. Depreciation</span><span style="text-align:right;">(12,000)</span>
			<span style="font-weight:700; color:var(--navy);">Total Assets</span><span style="text-align:right; font-weight:700; color:var(--navy);">124,500</span>

			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--navy); font-size:13px; letter-spacing:0.15em; margin-top:12px;">LIABILITIES</div>
			<span>Accounts Payable</span><span style="text-align:right;">9,500</span>
			<span>Accrued Wages</span><span style="text-align:right;">3,000</span>
			<span>Long-term Debt</span><span style="text-align:right;">40,000</span>
			<span style="font-weight:600;">Total Liabilities</span><span style="text-align:right; font-weight:600;">52,500</span>

			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--navy); font-size:13px; letter-spacing:0.15em; margin-top:12px;">EQUITY</div>
			<span>Common Stock</span><span style="text-align:right;">40,000</span>
			<span>Retained Earnings</span><span style="text-align:right;">32,000</span>
			<span style="font-weight:600;">Total Equity</span><span style="text-align:right; font-weight:600;">72,000</span>
			<span style="font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:6px;">Total L + E</span><span style="text-align:right; font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:6px;">124,500</span>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>The three sections</h3>
			<ul>
				<li><strong>Assets:</strong> resources the company controls and expects to benefit from, like cash, receivables, inventory, and equipment.</li>
				<li><strong>Liabilities:</strong> obligations the company must settle, like payables, wages owed, loans, taxes payable, and unearned revenue.</li>
				<li><strong>Equity:</strong> the owners' residual claim after liabilities. It includes contributed capital and retained earnings.</li>
			</ul>
			<div class="example"><span class="label">Equation check</span>Ranger has $124,500 of assets. Creditors claim $52,500. Owners claim the remaining $72,000. Together: $52,500 + $72,000 = $124,500.</div>
		</div>
		<div class="col-fa">
			<h3>سه بخش اصلی</h3>
			<ul>
				<li><strong>دارایی‌ها:</strong> منابعی که شرکت کنترل می‌کند و انتظار دارد از آن‌ها منفعت بگیرد، مثل وجه نقد، دریافتنی‌ها، موجودی کالا و تجهیزات.</li>
				<li><strong>بدهی‌ها:</strong> تعهداتی که شرکت باید تسویه کند، مثل پرداختنی‌ها، دستمزدهای پرداخت‌نشده، وام، مالیات پرداختنی و درآمد پیش‌دریافت.</li>
				<li><strong>حقوق مالکان:</strong> ادعای باقی‌ماندهٔ مالکان پس از بدهی‌ها. شامل سرمایهٔ پرداخت‌شده و سود انباشته است.</li>
			</ul>
			<div class="example"><span class="label">کنترل معادله</span>دارایی‌های Ranger برابر ۱۲۴٬۵۰۰ دلار است. طلبکاران ۵۲٬۵۰۰ دلار ادعا دارند. مالکان باقی‌مانده یعنی ۷۲٬۰۰۰ دلار را ادعا می‌کنند. جمع آن‌ها: ۵۲٬۵۰۰ + ۷۲٬۰۰۰ = ۱۲۴٬۵۰۰.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Current vs. non-current</h3>
			<p>Balance sheets usually order assets by <strong>liquidity</strong>: how quickly they are expected to turn into cash. They order liabilities by how soon they must be paid.</p>
			<ul>
				<li><strong>Current assets:</strong> cash or expected to become cash/useful within about one year.</li>
				<li><strong>Non-current assets:</strong> long-term resources, like equipment and buildings.</li>
				<li><strong>Current liabilities:</strong> obligations due within about one year.</li>
				<li><strong>Non-current liabilities:</strong> obligations due later, like long-term debt.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>جاری در برابر غیرجاری</h3>
			<p>ترازنامه معمولاً دارایی‌ها را بر اساس <strong>نقدشوندگی</strong> مرتب می‌کند: یعنی چقدر سریع انتظار داریم به وجه نقد تبدیل شوند. بدهی‌ها نیز بر اساس زمان سررسید مرتب می‌شوند.</p>
			<ul>
				<li><strong>دارایی جاری:</strong> وجه نقد یا چیزی که انتظار می‌رود ظرف حدود یک سال نقد یا مصرف شود.</li>
				<li><strong>دارایی غیرجاری:</strong> منابع بلندمدت، مثل تجهیزات و ساختمان.</li>
				<li><strong>بدهی جاری:</strong> تعهدی که ظرف حدود یک سال سررسید می‌شود.</li>
				<li><strong>بدهی غیرجاری:</strong> تعهدی با سررسید بلندمدت، مثل وام بلندمدت.</li>
			</ul>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to read it quickly</h3>
			<ul>
				<li><strong>Can short-term assets cover short-term bills?</strong> Compare current assets to current liabilities.</li>
				<li><strong>How much is financed by creditors?</strong> Look at liabilities relative to assets and equity.</li>
				<li><strong>What does the company depend on?</strong> Inventory-heavy, equipment-heavy, and cash-heavy companies have very different risk profiles.</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>The balance sheet is not the company's market value. Many assets are recorded at historical cost, and internally generated value like brand strength often does not appear directly.</div>
		</div>
		<div class="col-fa">
			<h3>روش سریع خواندن ترازنامه</h3>
			<ul>
				<li><strong>آیا دارایی‌های کوتاه‌مدت هزینه‌ها و بدهی‌های کوتاه‌مدت را پوشش می‌دهند؟</strong> دارایی‌های جاری را با بدهی‌های جاری مقایسه کنید.</li>
				<li><strong>چه مقدار از شرکت با پول طلبکاران تأمین شده؟</strong> بدهی‌ها را نسبت به دارایی‌ها و حقوق مالکان ببینید.</li>
				<li><strong>شرکت به چه چیزی وابسته است؟</strong> شرکت موجودی‌محور، تجهیزات‌محور و نقدمحور ریسک‌های متفاوتی دارند.</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>ترازنامه ارزش بازار شرکت نیست. بسیاری از دارایی‌ها با بهای تاریخی ثبت می‌شوند و ارزش‌های ایجادشده در داخل شرکت، مثل قدرت برند، معمولاً مستقیماً در ترازنامه دیده نمی‌شوند.</div>
		</div>
	</div>`;

const balanceSheetPlain =
	'The balance sheet is a snapshot: it shows what the company owns, what it owes, and what belongs to the owners at one exact date. It does not show a whole month or year of activity; it freezes the company at a single moment. ترازنامه یک عکس لحظه‌ای است: در یک تاریخ مشخص نشان می‌دهد شرکت چه چیزهایی دارد، چه بدهی‌هایی دارد، و چه مقدار متعلق به مالکان است. ترازنامه فعالیت کل ماه یا سال را نشان نمی‌دهد؛ فقط وضعیت شرکت را در یک لحظه ثابت می‌کند. Big idea Every balance sheet is built on one equation: Assets = Liabilities + Equity. The left side shows resources controlled by the company. The right side explains who has a claim on those resources: creditors first, owners second. This is why a balance sheet must balance. It is the logic of ownership and financing. ایده اصلی هر ترازنامه روی یک معادله ساخته می‌شود: دارایی‌ها = بدهی‌ها + حقوق مالکان. سمت چپ منابع تحت کنترل شرکت را نشان می‌دهد. سمت راست توضیح می‌دهد چه کسانی روی آن منابع ادعا دارند: اول طلبکاران، بعد مالکان. Ranger Coffee balance sheet: total assets 124,500, liabilities 52,500, equity 72,000. The equation balances because 52,500 plus 72,000 equals 124,500. ترازنامه Ranger: کل دارایی‌ها ۱۲۴٬۵۰۰، بدهی‌ها ۵۲٬۵۰۰، حقوق مالکان ۷۲٬۰۰۰. معادله تراز است چون ۵۲٬۵۰۰ به علاوه ۷۲٬۰۰۰ برابر ۱۲۴٬۵۰۰ است. The three sections Assets are resources the company controls and expects to benefit from. Liabilities are obligations the company must settle. Equity is the owners residual claim after liabilities. سه بخش اصلی دارایی‌ها منابعی هستند که شرکت کنترل می‌کند و انتظار منفعت دارد. بدهی‌ها تعهداتی هستند که شرکت باید تسویه کند. حقوق مالکان ادعای باقی‌مانده مالکان پس از بدهی‌هاست. Current vs non-current Balance sheets order assets by liquidity and liabilities by due date. Current means cash, used, collected, or paid within about one year. Non-current means longer-term. جاری در برابر غیرجاری ترازنامه دارایی‌ها را بر اساس نقدشوندگی و بدهی‌ها را بر اساس سررسید مرتب می‌کند. جاری یعنی ظرف حدود یک سال نقد، مصرف، وصول یا پرداخت می‌شود. غیرجاری یعنی بلندمدت‌تر. How to read it quickly Compare current assets to current liabilities, look at how much is financed by creditors, and notice whether the company is inventory-heavy, equipment-heavy, or cash-heavy. Common mistake The balance sheet is not the company market value. Many assets are recorded at historical cost, and internally generated value like brand strength often does not appear directly. روش سریع خواندن ترازنامه دارایی‌های جاری را با بدهی‌های جاری مقایسه کنید، ببینید چه مقدار با پول طلبکاران تأمین شده، و توجه کنید شرکت موجودی‌محور، تجهیزات‌محور یا نقدمحور است. اشتباه رایج ترازنامه ارزش بازار شرکت نیست. بسیاری از دارایی‌ها با بهای تاریخی ثبت می‌شوند و ارزش‌های داخلی مثل قدرت برند معمولاً مستقیماً دیده نمی‌شوند.';

const incomeStatementBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">The income statement is the <strong>movie</strong> of a period. It does not freeze one date like the balance sheet. It shows what the company earned, what it spent to earn it, and what profit was left over during a month, quarter, or year.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		صورت سود و زیان <strong>فیلم یک دوره</strong> است. مثل ترازنامه یک تاریخ را ثابت نمی‌کند؛ نشان می‌دهد شرکت طی یک ماه، فصل یا سال چه درآمدی کسب کرده، برای کسب آن چه هزینه‌هایی داشته، و در پایان چه سودی باقی مانده است.
	</div>

	<div class="lecture-grid" style="margin-top:16px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>The income statement answers: <strong>Was the company profitable during this period?</strong> It starts with revenue, subtracts layers of cost, and ends with net income.</p>
			<p>Those layers matter. A company can sell a lot and still struggle if product costs are too high, operating costs are too heavy, or interest and taxes consume the remaining profit.</p>
			<div class="example"><span class="label">Memory hook</span>Revenue is the top line. Net income is the bottom line. Everything between them explains where the money went.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>صورت سود و زیان پاسخ می‌دهد: <strong>آیا شرکت در این دوره سودآور بوده است؟</strong> از درآمد شروع می‌کند، لایه‌های هزینه را کم می‌کند، و به سود خالص می‌رسد.</p>
			<p>این لایه‌ها مهم‌اند. ممکن است شرکت فروش زیادی داشته باشد اما اگر بهای محصول بالا باشد، هزینه‌های عملیاتی سنگین باشد، یا بهره و مالیات سود باقی‌مانده را مصرف کند، نتیجه ضعیف شود.</p>
			<div class="example"><span class="label">یادسپار</span>درآمد خط بالاست. سود خالص خط پایین است. هرچه بین آن‌هاست توضیح می‌دهد پول کجا رفته است.</div>
		</div>
	</div>

	<div style="margin-top:18px;">
		<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); text-align:center;">Ranger Coffee Co. · Income Statement</div>
		<div style="font-family:'JetBrains Mono',monospace; font-size:12px; text-align:center; color:var(--ink-soft);">Year Ended Dec 31, 2025</div>
		<div style="display:grid; grid-template-columns: 1fr 96px; gap:5px 12px; font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.55; margin-top:12px;">
			<span>Revenue</span><span style="text-align:right;">245,000</span>
			<span>Cost of Goods Sold</span><span style="text-align:right;">(142,000)</span>
			<span style="font-weight:600; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">Gross Profit</span><span style="text-align:right; font-weight:600; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">103,000</span>
			<span style="margin-top:6px;">Selling &amp; Admin</span><span style="text-align:right; margin-top:6px;">(48,000)</span>
			<span>Depreciation</span><span style="text-align:right;">(8,000)</span>
			<span style="font-weight:600; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">Operating Income</span><span style="text-align:right; font-weight:600; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">47,000</span>
			<span style="margin-top:6px;">Interest Expense</span><span style="text-align:right; margin-top:6px;">(3,200)</span>
			<span style="font-weight:600; border-top:1px solid var(--hairline); padding-top:5px;">Pre-tax Income</span><span style="text-align:right; font-weight:600; border-top:1px solid var(--hairline); padding-top:5px;">43,800</span>
			<span>Income Tax (25%)</span><span style="text-align:right;">(10,950)</span>
			<span style="font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:6px;">Net Income</span><span style="text-align:right; font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:6px;">32,850</span>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>The flow from top to bottom</h3>
			<ul>
				<li><strong>Revenue:</strong> the value of goods or services earned from customers during the period.</li>
				<li><strong>COGS:</strong> the direct cost of the products sold. For Ranger, these are the coffee beans and production costs tied to sales.</li>
				<li><strong>Operating expenses:</strong> costs of running the business, such as rent, wages, administration, selling costs, and depreciation.</li>
				<li><strong>Interest and tax:</strong> financing cost and government claim after operations.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>جریان از بالا به پایین</h3>
			<ul>
				<li><strong>درآمد:</strong> ارزش کالا یا خدماتی که در طول دوره از مشتریان کسب شده است.</li>
				<li><strong>بهای تمام‌شده کالای فروش‌رفته:</strong> هزینهٔ مستقیم محصولاتی که فروخته شده‌اند. برای Ranger یعنی دانه‌های قهوه و هزینه‌های تولید مربوط به فروش.</li>
				<li><strong>هزینه‌های عملیاتی:</strong> هزینه‌های ادارهٔ کسب‌وکار، مثل اجاره، دستمزد، اداری، فروش و استهلاک.</li>
				<li><strong>بهره و مالیات:</strong> هزینهٔ تأمین مالی و سهم دولت پس از عملیات.</li>
			</ul>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>The three key subtotals</h3>
			<ul>
				<li><strong>Gross Profit = Revenue - COGS.</strong> This shows whether the product or service itself has room to make money.</li>
				<li><strong>Operating Income = Gross Profit - operating expenses.</strong> This shows profit from the core business before financing and tax.</li>
				<li><strong>Net Income = profit after all expenses.</strong> This is the bottom line that flows into retained earnings.</li>
			</ul>
			<div class="example"><span class="label">Ranger readout</span>Ranger starts with $245,000 of revenue and ends with $32,850 of net income. Its net profit margin is about 13.4% ($32,850 / $245,000).</div>
		</div>
		<div class="col-fa">
			<h3>سه سطح مهم سود</h3>
			<ul>
				<li><strong>سود ناخالص = درآمد - بهای تمام‌شده.</strong> نشان می‌دهد خود محصول یا خدمت چقدر ظرفیت سودآوری دارد.</li>
				<li><strong>سود عملیاتی = سود ناخالص - هزینه‌های عملیاتی.</strong> سود کسب‌وکار اصلی را قبل از تأمین مالی و مالیات نشان می‌دهد.</li>
				<li><strong>سود خالص = سود پس از همهٔ هزینه‌ها.</strong> خط پایانی است که به سود انباشته منتقل می‌شود.</li>
			</ul>
			<div class="example"><span class="label">خوانش Ranger</span>Ranger با ۲۴۵٬۰۰۰ دلار درآمد شروع می‌کند و به ۳۲٬۸۵۰ دلار سود خالص می‌رسد. حاشیه سود خالص آن حدود ۱۳٫۴٪ است (۳۲٬۸۵۰ / ۲۴۵٬۰۰۰).</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>How to read it quickly</h3>
			<ul>
				<li><strong>Start with gross profit:</strong> is the company making enough on what it sells?</li>
				<li><strong>Then check operating income:</strong> are overhead and operating costs under control?</li>
				<li><strong>Then compare net income to cash flow:</strong> profit is not the same as cash collected.</li>
			</ul>
			<div class="pitfall"><span class="label">Common mistake</span>Net income is not pure cash. It includes accruals, estimates, depreciation, inventory assumptions, and unpaid receivables. Always pair it with the cash flow statement.</div>
		</div>
		<div class="col-fa">
			<h3>روش سریع خواندن صورت سود و زیان</h3>
			<ul>
				<li><strong>از سود ناخالص شروع کنید:</strong> آیا شرکت از چیزی که می‌فروشد به اندازهٔ کافی سود می‌سازد؟</li>
				<li><strong>بعد سود عملیاتی را بررسی کنید:</strong> آیا هزینه‌های سربار و عملیاتی کنترل شده‌اند؟</li>
				<li><strong>بعد سود خالص را با جریان نقد مقایسه کنید:</strong> سود با وجه نقد وصول‌شده یکی نیست.</li>
			</ul>
			<div class="pitfall"><span class="label">اشتباه رایج</span>سود خالص وجه نقد خالص نیست. شامل اقلام تعهدی، برآوردها، استهلاک، فرض‌های موجودی و دریافتنی‌های وصول‌نشده است. همیشه آن را کنار صورت جریان وجوه نقد بخوانید.</div>
		</div>
	</div>`;

const incomeStatementPlain =
	'The income statement is the movie of a period. It does not freeze one date like the balance sheet. It shows what the company earned, what it spent to earn it, and what profit was left over during a month, quarter, or year. صورت سود و زیان فیلم یک دوره است. مثل ترازنامه یک تاریخ را ثابت نمی‌کند؛ نشان می‌دهد شرکت طی یک ماه، فصل یا سال چه درآمدی کسب کرده، برای کسب آن چه هزینه‌هایی داشته، و در پایان چه سودی باقی مانده است. Big idea The income statement answers: Was the company profitable during this period? It starts with revenue, subtracts layers of cost, and ends with net income. Revenue is the top line. Net income is the bottom line. Everything between them explains where the money went. ایده اصلی صورت سود و زیان پاسخ می‌دهد: آیا شرکت در این دوره سودآور بوده است؟ از درآمد شروع می‌کند، لایه‌های هزینه را کم می‌کند، و به سود خالص می‌رسد. درآمد خط بالاست. سود خالص خط پایین است. هرچه بین آن‌هاست توضیح می‌دهد پول کجا رفته است. Ranger Coffee income statement: revenue 245,000, COGS 142,000, gross profit 103,000, operating income 47,000, pre-tax income 43,800, tax 10,950, net income 32,850. صورت سود و زیان Ranger: درآمد ۲۴۵٬۰۰۰، بهای تمام‌شده ۱۴۲٬۰۰۰، سود ناخالص ۱۰۳٬۰۰۰، سود عملیاتی ۴۷٬۰۰۰، سود قبل از مالیات ۴۳٬۸۰۰، مالیات ۱۰٬۹۵۰، سود خالص ۳۲٬۸۵۰. The flow from top to bottom Revenue is earned from customers. COGS is the direct cost of products sold. Operating expenses are costs of running the business. Interest and tax come after operations. جریان از بالا به پایین درآمد از مشتریان کسب می‌شود. بهای تمام‌شده هزینه مستقیم محصولات فروخته‌شده است. هزینه‌های عملیاتی هزینه‌های اداره کسب‌وکار هستند. بهره و مالیات پس از عملیات می‌آیند. Three key subtotals: Gross Profit = Revenue - COGS. Operating Income = Gross Profit - operating expenses. Net Income = profit after all expenses. سه سطح مهم سود: سود ناخالص = درآمد - بهای تمام‌شده. سود عملیاتی = سود ناخالص - هزینه‌های عملیاتی. سود خالص = سود پس از همه هزینه‌ها. How to read it quickly Start with gross profit, then check operating income, then compare net income to cash flow. Common mistake Net income is not pure cash. It includes accruals, estimates, depreciation, inventory assumptions, and unpaid receivables. روش سریع خواندن صورت سود و زیان از سود ناخالص شروع کنید، بعد سود عملیاتی را بررسی کنید، سپس سود خالص را با جریان نقد مقایسه کنید. اشتباه رایج سود خالص وجه نقد خالص نیست. شامل اقلام تعهدی، برآوردها، استهلاک، فرض‌های موجودی و دریافتنی‌های وصول‌نشده است.';

const cashFlowStatementBody = `<p class="subtitle" style="margin-top:14px; max-width:none;">The cash flow statement explains the question the income statement cannot fully answer: <strong>where did cash actually come from, and where did it actually go?</strong> It sorts cash into three buckets: operating, investing, and financing.</p>

	<div class="farsi-block" style="margin-top:12px; max-width:none;">
		صورت جریان وجوه نقد به سؤالی پاسخ می‌دهد که صورت سود و زیان به‌تنهایی کامل جواب نمی‌دهد: <strong>وجه نقد واقعاً از کجا آمد و واقعاً کجا رفت؟</strong> این صورت، جریان نقد را در سه سبد دسته‌بندی می‌کند: عملیاتی، سرمایه‌گذاری و تأمین مالی.
	</div>

	<div style="margin-top:16px; display:grid; grid-template-columns: 1fr; gap:14px;">
		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">BUCKET 01 · سبد ۰۱</div>
			<div style="font-family:'Fraunces',serif; font-size:21px; color:var(--navy); margin-top:5px;">Operating Activities <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· فعالیت‌های عملیاتی</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.65;"><strong>Cash from the core business:</strong> collections from customers, payments to suppliers, payroll, rent, tax, and interest. This is the first place to look because it shows whether normal operations are producing cash.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.9;"><strong>وجه نقد از کسب‌وکار اصلی:</strong> وصول از مشتریان، پرداخت به تأمین‌کنندگان، حقوق و دستمزد، اجاره، مالیات و بهره. این بخش مهم‌ترین نقطهٔ شروع است، چون نشان می‌دهد عملیات عادی شرکت وجه نقد تولید می‌کند یا نه.</p>
		</div>

		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">BUCKET 02 · سبد ۰۲</div>
			<div style="font-family:'Fraunces',serif; font-size:21px; color:var(--navy); margin-top:5px;">Investing Activities <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· فعالیت‌های سرمایه‌گذاری</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.65;"><strong>Cash used for long-term assets:</strong> buying or selling equipment, buildings, securities, or another business. A growing company often has negative investing cash flow because it is buying assets for the future.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.9;"><strong>وجه نقد برای دارایی‌های بلندمدت:</strong> خرید یا فروش تجهیزات، ساختمان، اوراق بهادار یا یک کسب‌وکار دیگر. در شرکت در حال رشد، جریان نقد سرمایه‌گذاری اغلب منفی است، چون شرکت برای آینده دارایی می‌خرد.</p>
		</div>

		<div>
			<div style="font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.18em; color:var(--tan-deep);">BUCKET 03 · سبد ۰۳</div>
			<div style="font-family:'Fraunces',serif; font-size:21px; color:var(--navy); margin-top:5px;">Financing Activities <span style="font-family:'Vazirmatn',sans-serif; color:var(--tan-deep);">· فعالیت‌های تأمین مالی</span></div>
			<p style="margin-top:8px; font-size:14px; line-height:1.65;"><strong>Cash from owners and creditors:</strong> borrowing money, repaying debt, issuing stock, paying dividends, or buying back shares. This bucket shows how the company is funded.</p>
			<p style="font-family:'Vazirmatn',sans-serif; direction:rtl; text-align:right; margin-top:6px; font-size:14px; line-height:1.9;"><strong>وجه نقد از مالکان و طلبکاران:</strong> گرفتن وام، بازپرداخت بدهی، انتشار سهام، پرداخت سود سهام یا بازخرید سهام. این سبد نشان می‌دهد شرکت چگونه تأمین مالی می‌شود.</p>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Big idea</h3>
			<p>Profit and cash are different. The income statement uses accrual accounting, so it can include revenue not yet collected and expenses not yet paid. The cash flow statement strips the story back to cash movement.</p>
			<p>A healthy company usually wants positive operating cash flow. Negative investing cash flow can be good if it comes from useful growth investments. Financing cash flow can be positive or negative depending on whether the company is raising money or returning money.</p>
			<div class="example"><span class="label">Memory hook</span>Operating = running the business. Investing = buying and selling long-term assets. Financing = getting money from, or returning money to, lenders and owners.</div>
		</div>
		<div class="col-fa">
			<h3>ایدهٔ اصلی</h3>
			<p>سود و وجه نقد یکی نیستند. صورت سود و زیان از مبنای تعهدی استفاده می‌کند، بنابراین ممکن است درآمدی را نشان دهد که هنوز وصول نشده و هزینه‌ای را نشان دهد که هنوز پرداخت نشده است. صورت جریان وجوه نقد داستان را به حرکت واقعی وجه نقد برمی‌گرداند.</p>
			<p>یک شرکت سالم معمولاً باید جریان نقد عملیاتی مثبت داشته باشد. جریان نقد سرمایه‌گذاری منفی می‌تواند خوب باشد، اگر ناشی از سرمایه‌گذاری مفید برای رشد باشد. جریان نقد تأمین مالی ممکن است مثبت یا منفی باشد، بسته به اینکه شرکت پول جذب می‌کند یا پول برمی‌گرداند.</p>
			<div class="example"><span class="label">یادسپار</span>عملیاتی = ادارهٔ کسب‌وکار. سرمایه‌گذاری = خرید و فروش دارایی‌های بلندمدت. تأمین مالی = گرفتن پول از وام‌دهندگان و مالکان، یا برگرداندن پول به آن‌ها.</div>
		</div>
	</div>

	<div style="margin-top:18px;">
		<div style="font-family:'Fraunces',serif; font-size:17px; color:var(--navy); text-align:center;">Cash Flow Statement · Indirect Method</div>
		<div style="font-family:'JetBrains Mono',monospace; font-size:12px; text-align:center; color:var(--ink-soft);">Year Ended Dec 31, 2025</div>
		<div style="display:grid; grid-template-columns: 1fr 98px; gap:5px 12px; font-family:'JetBrains Mono',monospace; font-size:14px; line-height:1.55; margin-top:12px;">
			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--navy); font-size:12px; letter-spacing:0.16em;">OPERATING ACTIVITIES</div>
			<span>Net Income</span><span style="text-align:right;">32,850</span>
			<span style="color:var(--ink-soft);">+ Depreciation</span><span style="text-align:right;">8,000</span>
			<span style="color:var(--ink-soft);">- Increase in Accounts Receivable</span><span style="text-align:right;">(4,500)</span>
			<span style="color:var(--ink-soft);">- Increase in Inventory</span><span style="text-align:right;">(6,000)</span>
			<span style="color:var(--ink-soft);">+ Increase in Accounts Payable</span><span style="text-align:right;">2,000</span>
			<span style="color:var(--ink-soft);">+ Increase in Accrued Wages</span><span style="text-align:right;">1,200</span>
			<span style="font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">Cash from Operating</span><span style="text-align:right; font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">33,550</span>
			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--tan-deep); font-size:12px; letter-spacing:0.16em; margin-top:8px;">INVESTING ACTIVITIES</div>
			<span>Purchase of Equipment</span><span style="text-align:right;">(20,000)</span>
			<span>Business acquisition</span><span style="text-align:right;">(12,000)</span>
			<span style="font-weight:700; color:var(--tan-deep); border-top:1px solid var(--hairline); padding-top:5px;">Cash from Investing</span><span style="text-align:right; font-weight:700; color:var(--tan-deep); border-top:1px solid var(--hairline); padding-top:5px;">(32,000)</span>
			<div style="grid-column:1/3; font-family:'Inter',sans-serif; font-weight:700; color:var(--navy); font-size:12px; letter-spacing:0.16em; margin-top:8px;">FINANCING ACTIVITIES</div>
			<span>Proceeds from Debt</span><span style="text-align:right;">25,000</span>
			<span>Repayment of Debt</span><span style="text-align:right;">(10,000)</span>
			<span>Dividends Paid</span><span style="text-align:right;">(5,000)</span>
			<span style="font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">Cash from Financing</span><span style="text-align:right; font-weight:700; color:var(--navy); border-top:1px solid var(--hairline); padding-top:5px;">10,000</span>
			<span style="font-weight:700; border-top:1px solid var(--hairline); padding-top:7px;">Net Change in Cash</span><span style="text-align:right; font-weight:700; border-top:1px solid var(--hairline); padding-top:7px;">11,550</span>
			<span>Cash, beginning</span><span style="text-align:right;">15,450</span>
			<span style="font-weight:700; color:var(--navy);">Cash, ending</span><span style="text-align:right; font-weight:700; color:var(--navy);">27,000</span>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Hard words, translated</h3>
			<ul>
				<li><strong>Acquisition:</strong> buying another company, a business line, or a major asset. فارسی: <strong>تحصیل، خرید شرکت، یا تملک</strong>.</li>
				<li><strong>CapEx / capital expenditures:</strong> cash spent on long-term assets like equipment, stores, buildings, or software. فارسی: <strong>مخارج سرمایه‌ای</strong>.</li>
				<li><strong>Securities:</strong> financial investments such as stocks or bonds. فارسی: <strong>اوراق بهادار</strong>.</li>
				<li><strong>Proceeds:</strong> cash received from issuing debt or stock, or from selling an asset. فارسی: <strong>وجوه دریافتی یا عواید حاصل از انتشار/فروش</strong>.</li>
				<li><strong>Repayment:</strong> paying back borrowed money. فارسی: <strong>بازپرداخت بدهی</strong>.</li>
				<li><strong>Buyback:</strong> the company buys back its own shares. فارسی: <strong>بازخرید سهام</strong>.</li>
			</ul>
		</div>
		<div class="col-fa">
			<h3>واژگان دشوار با ترجمه</h3>
			<ul>
				<li><strong>Acquisition / تحصیل یا تملک:</strong> یعنی خرید یک شرکت دیگر، یک بخش از کسب‌وکار، یا یک دارایی مهم. مثلاً اگر Ranger یک کافهٔ کوچک را بخرد، این یک acquisition است.</li>
				<li><strong>CapEx / مخارج سرمایه‌ای:</strong> پولی که برای دارایی‌های بلندمدت خرج می‌شود؛ مثل تجهیزات، ساختمان، شعبهٔ جدید یا نرم‌افزار.</li>
				<li><strong>Securities / اوراق بهادار:</strong> سرمایه‌گذاری‌های مالی مثل سهام و اوراق قرضه.</li>
				<li><strong>Proceeds / وجوه دریافتی:</strong> پولی که از گرفتن وام، انتشار سهام یا فروش دارایی وارد شرکت می‌شود.</li>
				<li><strong>Repayment / بازپرداخت:</strong> پس دادن پولی که قبلاً قرض گرفته شده است.</li>
				<li><strong>Buyback / بازخرید سهام:</strong> وقتی شرکت سهام خودش را از بازار یا سهامداران می‌خرد.</li>
			</ul>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Reading the pattern</h3>
			<ul>
				<li><strong>Mature company:</strong> operating cash is positive, investing is negative, financing is often negative because it repays debt or pays dividends.</li>
				<li><strong>Growth company:</strong> operating cash may be positive, investing is usually negative because the company is building capacity, and financing may be positive if it raises money.</li>
				<li><strong>Distressed company:</strong> operating cash is negative, investing may be positive because it sells assets, and financing may be positive because it needs outside cash to survive.</li>
			</ul>
			<div class="pitfall"><span class="label">Identity</span>Cash from Operating + Cash from Investing + Cash from Financing = the change in cash on the balance sheet.</div>
		</div>
		<div class="col-fa">
			<h3>خواندن الگوی سه سبد</h3>
			<ul>
				<li><strong>شرکت بالغ:</strong> جریان نقد عملیاتی مثبت است، سرمایه‌گذاری معمولاً منفی است، و تأمین مالی اغلب منفی است چون شرکت بدهی بازپرداخت می‌کند یا سود سهام می‌دهد.</li>
				<li><strong>شرکت در حال رشد:</strong> جریان نقد عملیاتی ممکن است مثبت باشد، سرمایه‌گذاری معمولاً منفی است چون شرکت ظرفیت می‌سازد، و تأمین مالی ممکن است مثبت باشد اگر شرکت پول جذب کند.</li>
				<li><strong>شرکت دچار مشکل:</strong> جریان نقد عملیاتی منفی است، سرمایه‌گذاری ممکن است مثبت باشد چون دارایی می‌فروشد، و تأمین مالی ممکن است مثبت باشد چون برای بقا به پول بیرونی نیاز دارد.</li>
			</ul>
			<div class="pitfall"><span class="label">رابطهٔ اصلی</span>جریان نقد عملیاتی + جریان نقد سرمایه‌گذاری + جریان نقد تأمین مالی = تغییر وجه نقد در ترازنامه.</div>
		</div>
	</div>

	<div class="lecture-grid" style="margin-top:18px;">
		<div class="col-en">
			<h3>Common mistake</h3>
			<p>Do not assume negative investing cash flow is bad. If a company spends cash to buy productive equipment, open profitable stores, build software, or make a smart acquisition, the investing section will be negative because the company is investing for future returns.</p>
		</div>
		<div class="col-fa">
			<h3>اشتباه رایج</h3>
			<p>منفی بودن جریان نقد سرمایه‌گذاری همیشه بد نیست. اگر شرکت برای خرید تجهیزات مولد، افتتاح شعب سودآور، ساخت نرم‌افزار یا انجام یک تحصیل/خرید هوشمندانه پول خرج کند، بخش سرمایه‌گذاری منفی می‌شود چون شرکت برای بازده آینده سرمایه‌گذاری کرده است.</p>
		</div>
	</div>`;

const cashFlowStatementPlain =
	'The cash flow statement explains where cash actually came from and where it actually went. It sorts cash into three buckets: operating, investing, and financing. صورت جریان وجوه نقد توضیح می‌دهد وجه نقد واقعاً از کجا آمد و کجا رفت. این صورت، جریان نقد را در سه سبد دسته‌بندی می‌کند: عملیاتی، سرمایه‌گذاری و تأمین مالی. Operating activities are cash from the core business: collections from customers, payments to suppliers, payroll, rent, tax, and interest. فعالیت‌های عملیاتی یعنی وجه نقد از کسب‌وکار اصلی: وصول از مشتریان، پرداخت به تأمین‌کنندگان، حقوق و دستمزد، اجاره، مالیات و بهره. Investing activities are cash used for long-term assets: equipment, buildings, securities, or another business. فعالیت‌های سرمایه‌گذاری یعنی وجه نقد برای دارایی‌های بلندمدت: تجهیزات، ساختمان، اوراق بهادار یا یک کسب‌وکار دیگر. Financing activities are cash from owners and creditors: borrowing, repaying debt, issuing stock, dividends, or buybacks. فعالیت‌های تأمین مالی یعنی وجه نقد از مالکان و طلبکاران: گرفتن وام، بازپرداخت بدهی، انتشار سهام، پرداخت سود سهام یا بازخرید سهام. Big idea Profit and cash are different. The income statement uses accrual accounting, while the cash flow statement shows cash movement. ایده اصلی سود و وجه نقد یکی نیستند. صورت سود و زیان از حسابداری تعهدی استفاده می‌کند، اما صورت جریان وجوه نقد حرکت واقعی وجه نقد را نشان می‌دهد. Example cash flow statement: net income 32,850, depreciation 8,000, increase in accounts receivable 4,500, increase in inventory 6,000, increase in accounts payable 2,000, increase in accrued wages 1,200, cash from operating 33,550, purchase of equipment 20,000, business acquisition 12,000, cash from investing negative 32,000, proceeds from debt 25,000, repayment of debt 10,000, dividends paid 5,000, cash from financing 10,000, net change in cash 11,550. مثال صورت جریان وجوه نقد: سود خالص ۳۲٬۸۵۰، استهلاک ۸٬۰۰۰، افزایش حساب‌های دریافتنی ۴٬۵۰۰، افزایش موجودی ۶٬۰۰۰، افزایش حساب‌های پرداختنی ۲٬۰۰۰، افزایش دستمزدهای معوق ۱٬۲۰۰، جریان نقد عملیاتی ۳۳٬۵۵۰، خرید تجهیزات ۲۰٬۰۰۰، تحصیل یا خرید کسب‌وکار ۱۲٬۰۰۰، جریان نقد سرمایه‌گذاری منفی ۳۲٬۰۰۰، وجوه دریافتی از بدهی ۲۵٬۰۰۰، بازپرداخت بدهی ۱۰٬۰۰۰، سود سهام پرداختی ۵٬۰۰۰، جریان نقد تأمین مالی ۱۰٬۰۰۰، تغییر خالص وجه نقد ۱۱٬۵۵۰. Hard words: acquisition means تحصیل، خرید شرکت، یا تملک. CapEx means مخارج سرمایه‌ای. Securities means اوراق بهادار. Proceeds means وجوه دریافتی یا عواید حاصل از انتشار/فروش. Repayment means بازپرداخت بدهی. Buyback means بازخرید سهام. Pattern: mature company usually has positive operating, negative investing, negative financing. Growth company often has positive operating, negative investing, positive financing. Distressed company may have negative operating, positive investing from selling assets, and positive financing. الگو: شرکت بالغ معمولاً عملیاتی مثبت، سرمایه‌گذاری منفی و تأمین مالی منفی دارد. شرکت در حال رشد اغلب عملیاتی مثبت، سرمایه‌گذاری منفی و تأمین مالی مثبت دارد. شرکت بحرانی ممکن است عملیاتی منفی، سرمایه‌گذاری مثبت از فروش دارایی و تأمین مالی مثبت داشته باشد. Identity: cash from operating plus cash from investing plus cash from financing equals the change in cash on the balance sheet. رابطه اصلی: جریان نقد عملیاتی به علاوه جریان نقد سرمایه‌گذاری به علاوه جریان نقد تأمین مالی برابر است با تغییر وجه نقد در ترازنامه. Common mistake: negative investing cash flow is not always bad. اشتباه رایج: منفی بودن جریان نقد سرمایه‌گذاری همیشه بد نیست.';

const slideOverrides: Partial<Record<string, Partial<Slide>>> = {
	'05-equation': {
		body: accountingEquationBody,
		plain: accountingEquationPlain
	},
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
	},
	'26-balance-sheet': {
		body: balanceSheetBody,
		plain: balanceSheetPlain
	},
	'27-income-statement': {
		body: incomeStatementBody,
		plain: incomeStatementPlain
	},
	'28-cfs-structure': {
		body: cashFlowStatementBody,
		plain: cashFlowStatementPlain
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
