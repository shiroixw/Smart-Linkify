#!/usr/bin/env node
/**
 * 打包扩展为可直接上传 Chrome Web Store 的 zip。
 *
 * 用 `git archive` 只打包 git 跟踪的 extension/ 内容：
 *   - zip 根目录直接是 manifest.json（商店要求，不带 extension/ 前缀）
 *   - 自动排除 dist/、临时脚本等未跟踪文件
 *
 * 用法：node scripts/pack.js
 * 输出：dist/Smart-Linkify-v<version>.zip
 */
'use strict'

const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const pkg = require(path.join(ROOT, 'package.json'))
const tag = `v${pkg.version}`
const zipName = `Smart-Linkify-${tag}.zip`

const distDir = path.join(ROOT, 'dist')
const zipPath = path.join(distDir, zipName)
const zipRel = path.relative(ROOT, zipPath).replace(/\\/g, '/')

fs.mkdirSync(distDir, { recursive: true })
fs.rmSync(zipPath, { force: true })

execFileSync('git', ['archive', '--format=zip', '-o', zipRel, 'HEAD:extension'], {
	cwd: ROOT,
	stdio: 'inherit',
})

const size = fs.statSync(zipPath).size
console.log(`✓ ${zipRel}  ${(size / 1024).toFixed(1)} KB  (tag ${tag})`)
