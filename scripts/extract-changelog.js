#!/usr/bin/env node
/**
 * 从 CHANGELOG.md 提取指定版本的段落，作为 GitHub Release 正文。
 *
 * CHANGELOG 是唯一来源，避免发版时再手写一份 release notes 造成两处不一致。
 *
 * 用法：node scripts/extract-changelog.js 1.1.0 > release-notes.md
 *      node scripts/extract-changelog.js v1.1.0      （v 前缀会自动去掉）
 */
'use strict'

const fs = require('fs')
const path = require('path')

const raw = process.argv[2]
if (!raw) {
	console.error(
		'用法：node scripts/extract-changelog.js <version>（例如 1.1.0 或 v1.1.0）'
	)
	process.exit(1)
}

const version = raw.replace(/^v/, '')
const file = path.join(__dirname, '..', 'CHANGELOG.md')
const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)

const start = lines.findIndex((line) => line.startsWith(`## [${version}]`))
if (start < 0) {
	console.error(`CHANGELOG.md 中找不到 ${version} 的段落`)
	process.exit(1)
}

let end = lines.length
for (let i = start + 1; i < lines.length; i++) {
	if (/^## \[/.test(lines[i])) {
		end = i
		break
	}
}

// 跳过 "## [版本] - 日期" 标题行，正文从它下面的内容开始
const body = lines
	.slice(start + 1, end)
	.join('\n')
	.trim()

if (!body) {
	console.error(`${version} 的段落是空的`)
	process.exit(1)
}

process.stdout.write(body + '\n')
