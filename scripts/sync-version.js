#!/usr/bin/env node
/**
 * 版本同步脚本
 * 以 package.json 的 version 为唯一来源，同步到：
 * - website/index.html（#siteVersionDisplay）
 * - extension/manifest.json
 * - README.md / README.zh-CN.md（Shields Version 徽章）
 */

const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')
const PKG_PATH = path.join(ROOT_DIR, 'package.json')
const HTML_PATH = path.join(ROOT_DIR, 'website', 'index.html')
const MANIFEST_PATH = path.join(ROOT_DIR, 'extension', 'manifest.json')
const README_PATHS = [
	path.join(ROOT_DIR, 'README.md'),
	path.join(ROOT_DIR, 'README.zh-CN.md'),
]

function readPkgVersion() {
	const pkg = JSON.parse(fs.readFileSync(PKG_PATH, 'utf8'))
	if (!pkg.version || typeof pkg.version !== 'string') {
		throw new Error('package.json 缺少有效的 version 字段')
	}
	return pkg.version
}

function writeIfChanged(filePath, nextContent) {
	const prev = fs.readFileSync(filePath, 'utf8')
	if (prev === nextContent) return false
	fs.writeFileSync(filePath, nextContent)
	return true
}

function syncIndexHtml(version) {
	const html = fs.readFileSync(HTML_PATH, 'utf8')
	const byId = new RegExp(
		'(<div class="stat-number" id="siteVersionDisplay">)[\\d.]+(</div>)'
	)
	let next = html.replace(byId, `$1${version}$2`)
	if (next === html) {
		next = html.replace(
			/(<div class="stat-number">)[\d.]+(<\/div>)/,
			`$1${version}$2`
		)
	}
	return writeIfChanged(HTML_PATH, next)
}

function syncManifest(version) {
	const text = fs.readFileSync(MANIFEST_PATH, 'utf8')
	const next = text.replace(/"version"\s*:\s*"[^"]*"/, `"version": "${version}"`)
	return writeIfChanged(MANIFEST_PATH, next)
}

function syncReadmeBadge(filePath, version) {
	if (!fs.existsSync(filePath)) return false
	const text = fs.readFileSync(filePath, 'utf8')
	const next = text.replace(
		/(img\.shields\.io\/badge\/Version-)[\d.]+(-blue)/g,
		`$1${version}$2`
	)
	return writeIfChanged(filePath, next)
}

function syncVersion() {
	const version = readPkgVersion()
	const changed = []

	if (syncIndexHtml(version)) {
		changed.push('website/index.html')
		console.log(`✓ website/index.html → ${version}`)
	}
	if (syncManifest(version)) {
		changed.push('extension/manifest.json')
		console.log(`✓ extension/manifest.json → ${version}`)
	}
	for (const p of README_PATHS) {
		if (syncReadmeBadge(p, version)) {
			changed.push(path.relative(ROOT_DIR, p))
			console.log(`✓ ${path.relative(ROOT_DIR, p)} → Version-${version}`)
		}
	}

	if (changed.length === 0) {
		console.log(`✓ 版本号已是最新 (${version})`)
	}

	return changed
}

if (require.main === module) {
	try {
		syncVersion()
		process.exit(0)
	} catch (error) {
		console.error('✗ 版本同步失败:', error.message)
		process.exit(1)
	}
}

module.exports = { syncVersion, readPkgVersion }
