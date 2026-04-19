// One-shot: render static/og-image.svg → static/og-image.png so social crawlers (iMessage,
// Slack, WhatsApp, Discord, FB, etc.) that don't accept SVG still get a real preview.
// Re-run after editing the SVG: `node scripts/generate-og.mjs`
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'static', 'og-image.svg');
const pngPath = join(root, 'static', 'og-image.png');

const svg = readFileSync(svgPath, 'utf-8');

// Wrap in an HTML page that loads our exact display fonts so the rendered PNG
// matches the in-app brand. Google Fonts gives us Fraunces + Inter at runtime.
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400&display=swap"
/>
<style>
  html, body { margin: 0; padding: 0; background: #FBF6EE; }
  svg { display: block; width: 1200px; height: 630px; }
</style>
</head>
<body>${svg}</body>
</html>`;

const tmp = mkdtempSync(join(tmpdir(), 'accrev-og-'));
const htmlPath = join(tmp, 'og.html');
writeFileSync(htmlPath, html, 'utf-8');

const browser = await chromium.launch();
try {
	const ctx = await browser.newContext({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 1
	});
	const page = await ctx.newPage();
	await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(300);
	await page.screenshot({
		path: pngPath,
		type: 'png',
		omitBackground: false,
		clip: { x: 0, y: 0, width: 1200, height: 630 }
	});
	console.log('wrote', pngPath);
} finally {
	await browser.close();
}
