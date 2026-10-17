# ✍️ 智能超链接识别 (Smart Linkify – Instant hyperlink conversion)

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)](https://github.com/xiaowulang-turbo/Smart-Linkify)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue)](https://github.com/xiaowulang-turbo/Smart-Linkify/releases)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> 🌐 简体中文 | [English](README.md)

## ✨ 简介

**智能超链接识别 (Smart Linkify – Instant hyperlink conversion)** 是一款高效的 Chrome 浏览器扩展程序，其核心功能是**扫描并自动将网页内容中以纯文本形式存在的 URL 字符串（如 `http://example.com` 或 `www.google.com`）转换为可点击的 HTML 超链接 (`<a>` 标签）**。

不再需要手动复制粘贴文本链接到地址栏！本插件让您的浏览体验更加顺畅，所有可见的链接都将立即变得可点击。

## 🚀 核心功能

-   **🔗 文本链接智能转换:** 实时扫描加载的网页内容，自动识别并替换以下格式的文本：
    -   包含协议的 URL (例如：`https://`, `http://`, `ftp://`)
    -   不包含协议但常见的域名格式 (例如：`www.example.com`, `example.com/page`)
    -   邮件地址 (例如：`user@domain.com`)
-   **⚡ 实时动态处理:** 既处理页面加载时的内容，也处理通过 AJAX 或 JavaScript 动态插入的新内容（滚动、点击"加载更多"、路由切换等）。
-   **🧠 智能排除:** 跳过已是超链接内部的文本，以及 `<pre>`, `<code>`, `<script>`, `<style>`, `<textarea>` 与 `contenteditable` 可编辑区域内的内容，避免破坏代码展示、页面样式或用户正在编辑的文本。
-   **🛠️ 按站点启用:** 默认不修改任何页面。在弹窗中为当前网站打开开关后才生效，支持子域名（启用 `github.com` 同时覆盖 `docs.github.com`），可在设置里批量管理。
-   **🔒 安全与性能:** 转换过程快速高效，所有操作都在本地完成，不会对您的浏览速度造成明显影响，且不收集任何数据。

## 🌐 官网

访问我们的官网了解更多信息：[https://smart-linkify.vercel.app/](https://smart-linkify.vercel.app/)

官网源码位于 `website/` 目录。

## 📥 安装指南

### 选项 1: 通过 Chrome Web Store (推荐)

1. 访问 [Chrome Web Store](https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl) 安装插件
2. 点击 **"添加到 Chrome"** 按钮
3. 在弹出的确认对话框中点击 **"添加扩展程序"**

### 选项 2: 开发者模式安装 (适用于本地开发)

1. 克隆或下载本仓库：

    ```bash
    git clone https://github.com/xiaowulang-turbo/Smart-Linkify.git
    ```

2. 在 Chrome 浏览器中打开 `chrome://extensions`

3. 启用右上角的 **"开发者模式"** 开关

4. 点击 **"加载已解压的扩展程序"** 按钮

5. 选择项目中的 `extension` 文件夹即可完成安装

## 🔧 使用方法

安装完成后，插件**不会**立刻修改任何网页 —— 需要先为站点启用。

### 基本使用

1. **为站点启用:** 点击浏览器工具栏上的插件图标，打开"当前网站"的开关。页面会重新加载，此后该站点上的纯文本 URL 才会变成可点击链接。

2. **查看转换数量:** 工具栏图标上的数字徽章表示当前页面已转换的链接数，弹窗中也会显示同一计数。

3. **设置调整:** 点击弹窗里的"设置"，或右键插件图标选择 **"选项"**，您可以：
    - 调整转换出的链接是否在新标签页打开
    - 管理"已启用的网站"列表（每行一个域名）
    - 自定义排除的 HTML 标签
    - 切换"精确匹配模式"与"排除文件扩展名"，减少版本号、统计数据、`config.json` 等误识别
    - 切换界面主题与语言

### 示例场景

**在已启用的站点上，页面中的：**

```
访问我们的网站 www.example.com 或发送邮件到 contact@example.com
更多信息请查看 https://github.com/example/project
```

**会变成：**

```
访问我们的网站 [www.example.com] 或发送邮件到 [contact@example.com]
更多信息请查看 [https://github.com/example/project]
```

（方括号内的文本将变成可点击的超链接；未启用的网站上不会有任何变化）

## 💻 开发与贡献

欢迎所有形式的贡献！如果您想参与项目开发、报告 Bug 或提出功能建议，请遵循以下步骤。

### 本地开发设置

1. **克隆仓库:**

    ```bash
    git clone https://github.com/xiaowulang-turbo/Smart-Linkify.git
    cd Smart-Linkify
    ```

2. **在 Chrome 中加载:**

    - 打开 `chrome://extensions`
    - 确保 **"开发者模式"** 启用
    - 点击 **"加载已解压的扩展程序"**，选择仓库内的 `extension/` 目录

3. **修改代码后刷新:**
    - 在 `chrome://extensions` 页面点击插件的刷新按钮
    - 或者重新加载扩展程序
    - 修改 `content.js` 后还需要刷新目标网页（内容脚本不会热更新）

### 项目结构

```
Smart-Linkify/
├── extension/                # Chrome 扩展（"加载已解压的扩展程序"选这个目录）
│   ├── manifest.json
│   ├── background.js         # Service Worker：配置迁移、白名单、徽章
│   ├── content.js            # 内容脚本：DOM 遍历与转换调度
│   ├── lib/                  # 纯函数核心模块，可在 Node 中直接测试
│   │   ├── linkify.js        # URL / 邮箱识别
│   │   ├── dom-rules.js      # 排除规则
│   │   └── config.js         # 配置默认值（单一来源）
│   ├── shared/               # 跨页面共享资源
│   │   ├── tokens.css        # 设计 token（颜色/间距/圆角/动效）
│   │   ├── theme.js          # 主题解析（auto → light/dark）
│   │   └── link.css          # 注入页面的链接样式
│   ├── popup.*               # 弹窗
│   ├── options.*             # 设置页
│   ├── welcome.*             # 首装引导
│   └── icons/                # icon.svg 为矢量源，PNG 由脚本生成
├── website/                  # 官网（静态站点）
├── test/                     # node:test 单元测试
├── scripts/                  # 版本同步、git hook、图标生成
├── docs/superpowers/         # 设计与分析文档
└── .github/workflows/ci.yml  # CI：测试 / Lint / 类型检查
```

### 测试与质量门禁

```bash
npm test                     # node:test 单元测试
npx eslint .                 # ESLint
npx tsc -p jsconfig.json     # JSDoc 类型检查（覆盖 extension/lib）
```

仓库没有运行时依赖，因此工具链不写进 `package.json`，首次执行由 `npx` 自动拉取。CI（`.github/workflows/ci.yml`）在每次 PR 上运行上述三项，并额外校验 `manifest.json` 合法性与版本号一致性。

### 版本号同步

唯一版本来源为 `package.json` 中的 `version`。使用 `npm version patch|minor|major` 升级时，会执行 `npm run sync-version`，并同步更新 `extension/manifest.json`、`website/index.html` 以及 `README.md` / `README.zh-CN.md` 中的 Version 徽章。若手动修改 `package.json`，请在提交前运行 `npm run sync-version`（pre-commit 钩子也会执行同步）。

### 贡献流程

1. Fork 本仓库
2. 创建一个新的功能分支 (`git checkout -b feature/FixUrlRegex`)
3. 提交您的修改 (`git commit -m 'Improve URL matching regex'`)
4. 推送到分支 (`git push origin feature/FixUrlRegex`)
5. 创建一个 Pull Request

### 开发规范

-   遵循 JavaScript ES6+ 标准；新逻辑优先沉淀到 `extension/lib/` 并配单元测试
-   保持代码简洁易读，必要时补充注释
-   提交前确保 `npm test`、`npx eslint .`、`npx tsc -p jsconfig.json` 全绿
-   在真实网站上验证新功能，特别注意 `contenteditable` 与 Shadow DOM 场景
-   视觉相关的颜色 / 间距 / 动效走 `extension/shared/tokens.css`，不要硬编码

## 🐛 已知问题

-   某些使用 Shadow DOM 的网站可能无法正常转换
-   极少数情况下可能与其他扩展程序冲突
-   只改文本、不新增元素的高频更新（如 `element.textContent = …`）已由 `characterData` 监听覆盖，但刷新极快的页面仍可能漏掉个别更新

## 🗺️ 开发路线图

-   [ ] 用 `optional_host_permissions` + 按需注入替代当前的 `<all_urls>`，减少安装时的权限提示
-   [ ] 支持自定义 URL 匹配规则
-   [ ] 添加链接预览功能
-   [ ] 支持 `file://` 等更多协议
-   [ ] 超大页面分批处理，进一步降低主线程占用

## 📜 许可

本项目采用 **MIT 许可**。详情请参阅 [LICENSE](LICENSE) 文件。

```
MIT License

Copyright (c) 2024 Smart Linkify – Instant hyperlink conversion

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 致谢

感谢所有为本项目做出贡献的开发者和用户！

## 📞 联系方式

-   **项目主页:** [GitHub Repository](https://github.com/xiaowulang-turbo/Smart-Linkify)
-   **问题反馈:** [GitHub Issues](https://github.com/xiaowulang-turbo/Smart-Linkify/issues)
-   **功能建议:** 欢迎通过 Issues 提出您的想法

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐️ Star！</p>
  <p>Made with ❤️ by Smart Linkify – Instant hyperlink conversion Team</p>
</div>
