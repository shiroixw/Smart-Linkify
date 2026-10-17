#!/usr/bin/env node
/**
 * 图标生成器 —— 单一真源：本文件顶部的 DESIGN / GLYPH 常量。
 *
 * 同一个几何定义会同时产出：
 *   - extension/icons/icon.svg           （矢量源，便于后续改色 / 改形）
 *   - extension/icons/icon{16,32,48,96,128,256}.png （各尺寸独立渲染，互不缩放）
 *
 * 为什么不用现成渲染库：项目零运行时/构建依赖，此脚本只用 Node 内置模块
 * （zlib 做 PNG 压缩），几何按有符号距离场（SDF）解析式逐像素求覆盖率，
 * 每个尺寸都是"原生绘制"而非缩放，避免小尺寸糊掉。
 *
 * 用法：node scripts/generate-icons.js
 * 图标字形来自 Lucide `link`（ISC License, https://lucide.dev）。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ---------------------------------------------------------------------------
// 设计 token（改这里即可调整图标，禁止在绘制逻辑里散落魔数）
// ---------------------------------------------------------------------------
const DESIGN = {
	/** 圆角方块背景：圆角半径 = 尺寸 × 该比例 */
	cornerRadiusRatio: 0.22,
	/** 字形占画布比例（按尺寸微调，小尺寸给得更大以保可读性） */
	glyphRatio: { 16: 0.7, 32: 0.64, default: 0.58 },
	/** 渐变起止色（左上 → 右下） */
	gradientFrom: [0x25, 0x63, 0xeb],
	gradientTo: [0x1e, 0x40, 0xaf],
	/** 字形颜色 */
	glyphColor: [0xff, 0xff, 0xff],
	/** 字形描边宽度（24 单位坐标系下的基准值） */
	strokeBase: 2,
	/** 任意尺寸下描边的物理像素下限，避免小图标笔画消失 */
	strokeMinPx: 1.6,
	/** 输出尺寸列表 */
	sizes: [16, 32, 48, 96, 128, 256],
	/** 生成 SVG 时使用的参考画布尺寸 */
	svgSize: 128,
	/**
	 * Chrome 应用商店专用图标：官方要求 128×128 画布上图形只占 96×96，
	 * 四周各留 16px 透明边距（扩展包内仍用满幅版本）。
	 */
	storeIcon: { canvas: 128, art: 96 },
	/** 官网品牌资产：与扩展图标同源，避免站内 logo 与插件图标不一致 */
	siteAssets: [
		{ file: 'website/images/icon512.png', size: 512 },
		{ file: 'website/images/apple-touch-icon.png', size: 180 },
	],
	/** favicon.ico 内打包的尺寸（单文件多分辨率） */
	favicon: { file: 'website/favicon.ico', sizes: [16, 32, 48] },
};

/** Lucide `link` 图标路径（stroke 型，viewBox 24×24，ISC License） */
const GLYPH = {
	viewBox: 24,
	paths: [
		'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
		'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
	],
};

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'extension', 'icons');

// ---------------------------------------------------------------------------
// SVG path 解析：只支持本图标用到的命令，遇到未知命令直接抛错，不静默降级
// ---------------------------------------------------------------------------
function parsePath(d) {
	const segments = [];
	let i = 0;
	let cmd = null;
	let cx = 0;
	let cy = 0;
	let startX = 0;
	let startY = 0;
	let polyline = null;

	const isCommand = (ch) => /[MmLlHhVvCcSsQqTtAaZz]/.test(ch);
	const numRe = /-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;

	const readNumber = () => {
		skipSeparators();
		numRe.lastIndex = i;
		const m = numRe.exec(d);
		if (!m) throw new Error(`无法在位置 ${i} 解析数字: ${d.slice(i, i + 12)}`);
		i = numRe.lastIndex;
		return parseFloat(m[0]);
	};
	const skipSeparators = () => {
		while (i < d.length && /[\s,]/.test(d[i])) i++;
	};

	while (i < d.length) {
		skipSeparators();
		if (i >= d.length) break;

		if (isCommand(d[i])) {
			cmd = d[i];
			i++;
			if (cmd === 'Z' || cmd === 'z') {
				if (polyline) {
					polyline.push([startX, startY]);
					polyline.closed = true;
					segments.push(polyline);
					polyline = null;
				}
				cx = startX;
				cy = startY;
				continue;
			}
		} else if (cmd === null) {
			throw new Error(`路径必须以命令开头: ${d}`);
		}

		const rel = cmd === cmd.toLowerCase();
		const ox = rel ? cx : 0;
		const oy = rel ? cy : 0;

		switch (cmd.toUpperCase()) {
			case 'M': {
				if (polyline) segments.push(polyline);
				const x = readNumber() + ox;
				const y = readNumber() + oy;
				cx = x;
				cy = y;
				startX = x;
				startY = y;
				polyline = [[x, y]];
				// 后续隐式坐标视为 lineto
				cmd = rel ? 'l' : 'L';
				break;
			}
			case 'L': {
				const x = readNumber() + ox;
				const y = readNumber() + oy;
				polyline.push([x, y]);
				cx = x;
				cy = y;
				break;
			}
			case 'H': {
				const x = readNumber() + ox;
				polyline.push([x, cy]);
				cx = x;
				break;
			}
			case 'V': {
				const y = readNumber() + oy;
				polyline.push([cx, y]);
				cy = y;
				break;
			}
			case 'C': {
				const x1 = readNumber() + ox;
				const y1 = readNumber() + oy;
				const x2 = readNumber() + ox;
				const y2 = readNumber() + oy;
				const x = readNumber() + ox;
				const y = readNumber() + oy;
				flattenCubic(polyline, cx, cy, x1, y1, x2, y2, x, y);
				cx = x;
				cy = y;
				break;
			}
			case 'A': {
				const rx = readNumber();
				const ry = readNumber();
				const rot = readNumber();
				const largeArc = readNumber() ? 1 : 0;
				const sweep = readNumber() ? 1 : 0;
				const x = readNumber() + ox;
				const y = readNumber() + oy;
				flattenArc(polyline, cx, cy, rx, ry, rot, largeArc, sweep, x, y);
				cx = x;
				cy = y;
				break;
			}
			default:
				throw new Error(`暂不支持的 SVG 路径命令: ${cmd}`);
		}
	}
	if (polyline) segments.push(polyline);
	return segments;
}

/** 三次贝塞尔 → 折线（按弦高误差自适应分段） */
function flattenCubic(pts, x0, y0, x1, y1, x2, y2, x3, y3) {
	const steps = 24;
	for (let s = 1; s <= steps; s++) {
		const t = s / steps;
		const mt = 1 - t;
		const x = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
		const y = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
		pts.push([x, y]);
	}
}

/** 椭圆弧 → 折线（SVG 规范 F.6.5 端点参数转中心参数） */
function flattenArc(pts, x1, y1, rx, ry, rotDeg, largeArc, sweep, x2, y2) {
	if (rx === 0 || ry === 0) {
		pts.push([x2, y2]);
		return;
	}
	const phi = (rotDeg * Math.PI) / 180;
	const cosPhi = Math.cos(phi);
	const sinPhi = Math.sin(phi);
	const dx = (x1 - x2) / 2;
	const dy = (y1 - y2) / 2;
	const x1p = cosPhi * dx + sinPhi * dy;
	const y1p = -sinPhi * dx + cosPhi * dy;

	let arx = Math.abs(rx);
	let ary = Math.abs(ry);
	const lambda = (x1p * x1p) / (arx * arx) + (y1p * y1p) / (ary * ary);
	if (lambda > 1) {
		const k = Math.sqrt(lambda);
		arx *= k;
		ary *= k;
	}

	const sign = largeArc === sweep ? -1 : 1;
	const numer = arx * arx * ary * ary - arx * arx * y1p * y1p - ary * ary * x1p * x1p;
	const denom = arx * arx * y1p * y1p + ary * ary * x1p * x1p;
	const coef = sign * Math.sqrt(Math.max(0, numer / denom));
	const cxp = (coef * arx * y1p) / ary;
	const cyp = (-coef * ary * x1p) / arx;
	const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
	const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

	const angle = (ux, uy, vx, vy) => {
		const dot = ux * vx + uy * vy;
		const len = Math.hypot(ux, uy) * Math.hypot(vx, vy);
		const a = Math.acos(Math.min(1, Math.max(-1, dot / len)));
		return ux * vy - uy * vx < 0 ? -a : a;
	};

	const theta1 = angle(1, 0, (x1p - cxp) / arx, (y1p - cyp) / ary);
	let dTheta = angle((x1p - cxp) / arx, (y1p - cyp) / ary, (-x1p - cxp) / arx, (-y1p - cyp) / ary);
	if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
	if (sweep && dTheta < 0) dTheta += 2 * Math.PI;

	const radius = Math.max(arx, ary);
	const step = Math.max(0.03, Math.sqrt(0.02 / radius));
	const count = Math.max(8, Math.ceil(Math.abs(dTheta) / step));
	for (let s = 1; s <= count; s++) {
		const th = theta1 + (dTheta * s) / count;
		const px = arx * Math.cos(th);
		const py = ary * Math.sin(th);
		pts.push([cosPhi * px - sinPhi * py + cx, sinPhi * px + cosPhi * py + cy]);
	}
}

// ---------------------------------------------------------------------------
// 几何工具
// ---------------------------------------------------------------------------
function bboxOf(polylines) {
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const line of polylines) {
		for (const [x, y] of line) {
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
	}
	return { minX, minY, maxX, maxY };
}

/** 点到线段距离的平方 */
function segDistSq(px, py, x1, y1, x2, y2) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const lenSq = dx * dx + dy * dy;
	let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
	t = t < 0 ? 0 : t > 1 ? 1 : t;
	const ex = px - (x1 + t * dx);
	const ey = py - (y1 + t * dy);
	return ex * ex + ey * ey;
}

/** 圆角矩形有符号距离（负值在内部） */
function roundRectSdf(px, py, size, radius) {
	const half = size / 2;
	const qx = Math.abs(px - half) - (half - radius);
	const qy = Math.abs(py - half) - (half - radius);
	const ax = Math.max(qx, 0);
	const ay = Math.max(qy, 0);
	return Math.hypot(ax, ay) + Math.min(Math.max(qx, qy), 0) - radius;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;

/** 把 24 单位坐标系下的字形适配到目标尺寸的画布上 */
function layoutGlyph(size) {
	const ratio = DESIGN.glyphRatio[size] ?? DESIGN.glyphRatio.default;
	const target = size * ratio;
	const polylines = GLYPH.paths.map(parsePath).flat();

	// 描边变粗会撑大包围盒，迭代收敛，保证字形始终落在安全区内
	let stroke = DESIGN.strokeBase;
	for (let iter = 0; iter < 8; iter++) {
		const box = bboxOf(polylines);
		const w = box.maxX - box.minX + stroke;
		const h = box.maxY - box.minY + stroke;
		const nextScale = target / Math.max(w, h);
		stroke = Math.max(DESIGN.strokeBase, DESIGN.strokeMinPx / nextScale);
	}

	const box = bboxOf(polylines);
	const scale = target / Math.max(box.maxX - box.minX + stroke, box.maxY - box.minY + stroke);
	const cx = (box.minX + box.maxX) / 2;
	const cy = (box.minY + box.maxY) / 2;

	const transform = (polyline) =>
		polyline.map(([x, y]) => [size / 2 + (x - cx) * scale, size / 2 + (y - cy) * scale]);

	return {
		polylines: polylines.map(transform),
		strokePx: stroke * scale,
		scale,
		target,
	};
}

// ---------------------------------------------------------------------------
// 渲染
// ---------------------------------------------------------------------------
function render(size) {
	const { polylines, strokePx } = layoutGlyph(size);
	const halfStroke = strokePx / 2;
	const radius = size * DESIGN.cornerRadiusRatio;
	const pixels = Buffer.alloc(size * size * 4);

	for (let y = 0; y < size; y++) {
		for (let x = 0; x < size; x++) {
			const px = x + 0.5;
			const py = y + 0.5;

			const dBase = roundRectSdf(px, py, size, radius);
			const alpha = clamp01(0.5 - dBase);
			const offset = (y * size + x) * 4;

			if (alpha <= 0) {
				pixels.writeUInt32BE(0, offset);
				continue;
			}

			// 字形覆盖率：到中心线的距离减去半描边
			let dGlyph = Infinity;
			for (const line of polylines) {
				for (let s = 0; s < line.length - 1; s++) {
					const d = segDistSq(px, py, line[s][0], line[s][1], line[s + 1][0], line[s + 1][1]);
					if (d < dGlyph) dGlyph = d;
				}
			}
			dGlyph = Math.sqrt(dGlyph) - halfStroke;
			const coverage = clamp01(0.5 - dGlyph);

			// 45° 渐变
			const t = clamp01((x + y) / (2 * (size - 1)));
			const bgR = lerp(DESIGN.gradientFrom[0], DESIGN.gradientTo[0], t);
			const bgG = lerp(DESIGN.gradientFrom[1], DESIGN.gradientTo[1], t);
			const bgB = lerp(DESIGN.gradientFrom[2], DESIGN.gradientTo[2], t);

			const r = lerp(bgR, DESIGN.glyphColor[0], coverage);
			const g = lerp(bgG, DESIGN.glyphColor[1], coverage);
			const b = lerp(bgB, DESIGN.glyphColor[2], coverage);

			pixels[offset] = Math.round(r);
			pixels[offset + 1] = Math.round(g);
			pixels[offset + 2] = Math.round(b);
			pixels[offset + 3] = Math.round(alpha * 255);
		}
	}
	return pixels;
}

// ---------------------------------------------------------------------------
// 极简 PNG 编码（8-bit RGBA，无过滤）
// ---------------------------------------------------------------------------
const CRC_TABLE = (() => {
	const table = new Int32Array(256);
	for (let n = 0; n < 256; n++) {
		let c = n;
		for (let k = 0; k < 8; k++) {
			c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		}
		table[n] = c;
	}
	return table;
})();

function crc32(buf) {
	let c = 0xffffffff;
	for (let i = 0; i < buf.length; i++) {
		c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
	}
	return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
	const length = Buffer.alloc(4);
	length.writeUInt32BE(data.length, 0);
	const typeBuf = Buffer.from(type, 'ascii');
	const crc = Buffer.alloc(4);
	crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
	return Buffer.concat([length, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
	const stride = width * 4;
	const raw = Buffer.alloc((stride + 1) * height);
	for (let y = 0; y < height; y++) {
		raw[y * (stride + 1)] = 0; // filter: none
		rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
	}

	const ihdr = Buffer.alloc(13);
	ihdr.writeUInt32BE(width, 0);
	ihdr.writeUInt32BE(height, 4);
	ihdr[8] = 8; // bit depth
	ihdr[9] = 6; // color type: RGBA
	ihdr[10] = 0;
	ihdr[11] = 0;
	ihdr[12] = 0;

	return Buffer.concat([
		Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		pngChunk('IHDR', ihdr),
		pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
		pngChunk('IEND', Buffer.alloc(0)),
	]);
}

// ---------------------------------------------------------------------------
// SVG 输出（与 PNG 共用同一套几何）
// ---------------------------------------------------------------------------
function toSvg() {
	const size = DESIGN.svgSize;
	const { scale, strokePx } = layoutGlyph(size);
	const box = bboxOf(GLYPH.paths.map(parsePath).flat());
	const cx = (box.minX + box.maxX) / 2;
	const cy = (box.minY + box.maxY) / 2;
	const r = (size * DESIGN.cornerRadiusRatio).toFixed(2);
	const hex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

	return `<!-- Smart Linkify 图标（由 scripts/generate-icons.js 生成，勿手改）
     字形：Lucide "link" (ISC License, https://lucide.dev) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" fill="none">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="${hex(DESIGN.gradientFrom)}"/>
			<stop offset="1" stop-color="${hex(DESIGN.gradientTo)}"/>
		</linearGradient>
	</defs>
	<rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
	<g transform="translate(${(size / 2 - cx * scale).toFixed(3)} ${(size / 2 - cy * scale).toFixed(3)}) scale(${scale.toFixed(4)})"
	   stroke="${hex(DESIGN.glyphColor)}" stroke-width="${(strokePx / scale).toFixed(3)}"
	   stroke-linecap="round" stroke-linejoin="round">
${GLYPH.paths.map((d) => `\t\t<path d="${d}"/>`).join('\n')}
	</g>
</svg>
`;
}

// ---------------------------------------------------------------------------
// 商店图标：图形 96×96 居中放进 128×128 透明画布
// ---------------------------------------------------------------------------
function renderStoreIcon() {
	const { canvas, art } = DESIGN.storeIcon;
	const artPixels = render(art);
	const offset = (canvas - art) / 2;
	const pixels = Buffer.alloc(canvas * canvas * 4); // 全透明

	for (let y = 0; y < art; y++) {
		const src = y * art * 4;
		const dst = ((y + offset) * canvas + offset) * 4;
		artPixels.copy(pixels, dst, src, src + art * 4);
	}
	return { pixels, canvas };
}

// ---------------------------------------------------------------------------
// ICO 封装：多分辨率 favicon（内嵌 PNG，Vista 及以上浏览器均支持）
// ---------------------------------------------------------------------------
function encodeIco(entries) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(entries.length, 4);

	const directory = Buffer.alloc(16 * entries.length);
	let offset = header.length + directory.length;

	entries.forEach((entry, index) => {
		const base = index * 16;
		directory[base] = entry.size >= 256 ? 0 : entry.size;
		directory[base + 1] = entry.size >= 256 ? 0 : entry.size;
		directory[base + 2] = 0; // palette
		directory[base + 3] = 0; // reserved
		directory.writeUInt16LE(1, base + 4); // color planes
		directory.writeUInt16LE(32, base + 6); // bits per pixel
		directory.writeUInt32LE(entry.png.length, base + 8);
		directory.writeUInt32LE(offset, base + 12);
		offset += entry.png.length;
	});

	return Buffer.concat([header, directory, ...entries.map((entry) => entry.png)]);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
function main() {
	fs.mkdirSync(OUT_DIR, { recursive: true });

	for (const size of DESIGN.sizes) {
		const png = encodePng(size, size, render(size));
		const file = path.join(OUT_DIR, `icon${size}.png`);
		fs.writeFileSync(file, png);
		console.log(`✓ ${path.relative(process.cwd(), file)}  ${size}×${size}  ${png.length} bytes`);
	}

	const store = renderStoreIcon();
	const storeFile = path.join(OUT_DIR, `icon${store.canvas}-store.png`);
	const storePng = encodePng(store.canvas, store.canvas, store.pixels);
	fs.writeFileSync(storeFile, storePng);
	console.log(
		`✓ ${path.relative(process.cwd(), storeFile)}  ${store.canvas}×${store.canvas}（图形 ${DESIGN.storeIcon.art}）  ${storePng.length} bytes`
	);

	const svgFile = path.join(OUT_DIR, 'icon.svg');
	fs.writeFileSync(svgFile, toSvg(), 'utf8');
	console.log(`✓ ${path.relative(process.cwd(), svgFile)}`);

	// 官网品牌资产（与扩展图标同源）
	for (const asset of DESIGN.siteAssets) {
		const target = path.join(ROOT, asset.file);
		fs.mkdirSync(path.dirname(target), { recursive: true });
		const png = encodePng(asset.size, asset.size, render(asset.size));
		fs.writeFileSync(target, png);
		console.log(`✓ ${asset.file}  ${asset.size}×${asset.size}  ${png.length} bytes`);
	}

	// favicon.ico：多分辨率打包
	const icoEntries = DESIGN.favicon.sizes.map((size) => ({
		size,
		png: encodePng(size, size, render(size)),
	}));
	const icoFile = path.join(ROOT, DESIGN.favicon.file);
	fs.writeFileSync(icoFile, encodeIco(icoEntries));
	console.log(
		`✓ ${DESIGN.favicon.file}  ${DESIGN.favicon.sizes.join('/')}  ${fs.statSync(icoFile).size} bytes`
	);
}

if (require.main === module) {
	main();
}

module.exports = { render, encodePng, parsePath, layoutGlyph, DESIGN };
