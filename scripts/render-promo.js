#!/usr/bin/env node
/**
 * 宣传图批量渲染
 *
 * 原理：用本机 Chrome 的 headless 模式按「目标像素尺寸」开窗口，逐个打开
 * marketing/templates 下的版式页并截图。零依赖（只用 Node 内置模块 + 本机 Chrome）。
 *
 * 用法：
 *   npm run promo            # 全部语言 × 主题
 *   npm run promo -- zh      # 只出中文
 *
 * 产物：
 *   marketing/out/library/   全量母版（含备选语言/主题）
 *   marketing/out/store/     可直接按字段上传到 Chrome 应用商店的整理包
 * 前置：marketing/assets 下的真实 UI 截图需先采集（见 marketing/README.md）
 */
'use strict';

const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR = path.join(ROOT, 'marketing', 'templates');
const OUT_DIR = path.join(ROOT, 'marketing', 'out', 'library');
const STORE_DIR = path.join(ROOT, 'marketing', 'out', 'store');

const CHROME_CANDIDATES = [
	process.env.CHROME_PATH,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium',
];

/** 版式清单：name 决定输出文件名，template 对应 templates 下的页面 */
const LAYOUTS = [
	{ name: 'store-01-hero', template: 'store-hero.html', width: 1280, height: 800, themes: ['light', 'dark'] },
	{ name: 'store-02-autolink', template: 'store-autolink.html', width: 1280, height: 800, themes: ['light', 'dark'] },
	{ name: 'store-03-popup', template: 'store-popup.html', width: 1280, height: 800, themes: ['light', 'dark'] },
	{ name: 'store-04-options', template: 'store-options.html', width: 1280, height: 800, themes: ['light', 'dark'] },
	{ name: 'promo-440x280', template: 'promo-small.html', width: 440, height: 280, themes: ['light'] },
	{ name: 'promo-1400x560', template: 'promo-marquee.html', width: 1400, height: 560, themes: ['light', 'dark'] },
	{ name: 'og-1280x640', template: 'og-card.html', width: 1280, height: 640, themes: ['light'] },
	{ name: 'poster-1080x1440', template: 'poster.html', width: 1080, height: 1440, themes: ['dark'] },
];

const LANGUAGES = ['zh', 'en'];

/**
 * 商店上传包：后台字段 → 我们的文件。
 *
 * 依据 developer.chrome.com/docs/webstore/images：
 * - 截图 1280×800，1–5 张（这里每语言排 5 张：4 张浅色功能图 + 1 张深色）
 * - 小促销图 / Marquee 不支持按语言本地化，只能各传 1 张（默认英文版）
 * - 商店图标要求 128 画布 + 96 图形 + 四周 16px 透明边距
 */
const STORE_GLOBAL = [
	{ from: path.join(ROOT, 'extension', 'icons', 'icon128-store.png'), to: 'icon-128.png' },
	{ from: 'promo-440x280-en.png', to: 'small-promo-440x280.png' },
	{ from: 'promo-1400x560-en-light.png', to: 'marquee-1400x560.png' },
];

const STORE_SCREENSHOTS = [
	{ to: '1-hero.png', src: 'store-01-hero-{lang}-light.png' },
	{ to: '2-autolink.png', src: 'store-02-autolink-{lang}-light.png' },
	{ to: '3-popup.png', src: 'store-03-popup-{lang}-light.png' },
	{ to: '4-options.png', src: 'store-04-options-{lang}-light.png' },
	{ to: '5-popup-dark.png', src: 'store-03-popup-{lang}-dark.png' },
];

/** 商店后台的语言代码（与 extension/_locales 一致） */
const STORE_LANG_DIR = { zh: 'zh_CN', en: 'en' };

function findChrome() {
	for (const candidate of CHROME_CANDIDATES) {
		if (candidate && fs.existsSync(candidate)) return candidate;
	}
	throw new Error(
		'找不到 Chrome。请设置环境变量 CHROME_PATH 指向可执行文件，或安装 Chrome。'
	);
}

function renderOne(chrome, profileDir, job) {
	const url = `${pathToFileURL(path.join(TEMPLATE_DIR, job.template)).href}?lang=${job.lang}&theme=${job.theme}`;
	const outFile = path.join(OUT_DIR, job.file);

	if (fs.existsSync(outFile)) fs.unlinkSync(outFile);

	const args = [
		'--headless=new',
		'--disable-gpu',
		'--hide-scrollbars',
		'--force-device-scale-factor=1',
		'--no-first-run',
		'--no-default-browser-check',
		'--disable-extensions',
		'--virtual-time-budget=4000',
		`--window-size=${job.width},${job.height}`,
		`--user-data-dir=${profileDir}`,
		`--screenshot=${outFile}`,
		url,
	];

	const result = spawnSync(chrome, args, { encoding: 'utf8', timeout: 60000 });
	const ok = fs.existsSync(outFile);
	if (!ok) {
		const detail = (result.stderr || result.stdout || '').trim().split('\n').slice(-3).join(' | ');
		throw new Error(`渲染失败: ${job.file}${detail ? ' — ' + detail : ''}`);
	}
	return fs.statSync(outFile).size;
}

function buildJobs(langs) {
	const jobs = [];
	for (const layout of LAYOUTS) {
		for (const lang of langs) {
			for (const theme of layout.themes) {
				const suffix = layout.themes.length > 1 ? `-${theme}` : '';
				jobs.push({
					...layout,
					lang,
					theme,
					file: `${layout.name}-${lang}${suffix}.png`,
				});
			}
		}
	}
	return jobs;
}

/** 把母版整理成可直接上传的商店文件结构 */
function stageStore(langs) {
	fs.mkdirSync(STORE_DIR, { recursive: true });
	const copied = [];
	const skipped = [];

	for (const item of STORE_GLOBAL) {
		const src = path.isAbsolute(item.from) ? item.from : path.join(OUT_DIR, item.from);
		if (!fs.existsSync(src)) {
			skipped.push(item.to);
			continue;
		}
		fs.copyFileSync(src, path.join(STORE_DIR, item.to));
		copied.push(item.to);
	}

	for (const lang of langs) {
		const langDir = STORE_LANG_DIR[lang];
		fs.mkdirSync(path.join(STORE_DIR, langDir), { recursive: true });
		for (const shot of STORE_SCREENSHOTS) {
			const src = path.join(OUT_DIR, shot.src.replace('{lang}', lang));
			if (!fs.existsSync(src)) {
				skipped.push(`${langDir}/${shot.to}`);
				continue;
			}
			fs.copyFileSync(src, path.join(STORE_DIR, langDir, shot.to));
			copied.push(`${langDir}/${shot.to}`);
		}
	}

	return { copied, skipped };
}

function main() {
	const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
	const langs = only.length ? only.filter((l) => LANGUAGES.includes(l)) : LANGUAGES;
	if (!langs.length) {
		console.error(`语言参数无效，可选：${LANGUAGES.join(' / ')}`);
		process.exit(1);
	}

	const chrome = findChrome();
	const missing = ['ui-popup-light.png', 'ui-options-light.png', 'ui-demo-light.png'].filter(
		(name) => !fs.existsSync(path.join(ROOT, 'marketing', 'assets', name))
	);
	if (missing.length) {
		console.error(`缺少 UI 素材：${missing.join(', ')}（采集方法见 marketing/README.md）`);
		process.exit(1);
	}

	fs.mkdirSync(OUT_DIR, { recursive: true });
	const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'smart-linkify-promo-'));
	const jobs = buildJobs(langs);

	console.log(`Chrome: ${chrome}`);
	console.log(`输出: ${path.relative(ROOT, OUT_DIR)}  (${jobs.length} 张)\n`);

	let failed = 0;
	for (const job of jobs) {
		try {
			const bytes = renderOne(chrome, profileDir, job);
			console.log(`✓ ${job.file}  ${job.width}×${job.height}  ${(bytes / 1024).toFixed(1)} KB`);
		} catch (error) {
			failed++;
			console.error(`✗ ${error.message}`);
		}
	}

	fs.rmSync(profileDir, { recursive: true, force: true });

	const staged = stageStore(langs);
	console.log(`\n商店上传包: ${path.relative(ROOT, STORE_DIR)}  (${staged.copied.length} 个文件)`);
	for (const name of staged.copied) console.log(`  · ${name}`);
	if (staged.skipped.length) {
		console.warn(`\n跳过的文件（母版缺失，先补渲染）:\n  ${staged.skipped.join('\n  ')}`);
	}

	console.log(`\n完成 ${jobs.length - failed}/${jobs.length}`);
	if (failed) process.exit(1);
}

if (require.main === module) main();
