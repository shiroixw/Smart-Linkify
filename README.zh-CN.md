# ✍️ 智能超链接识别 (Smart Linkify – Instant hyperlink conversion)

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)](https://github.com/xiaowulang-turbo/Smart-Linkify)
[![Version](https://img.shields.io/badge/Version-1.0.5-blue)](https://github.com/xiaowulang-turbo/Smart-Linkify/releases)
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
-   **⚡ 实时动态处理:** 不仅处理页面加载时的内容，还能处理通过 AJAX 或 JavaScript 动态加载进来的新内容（例如，在滚动或点击"加载更多"时）。
-   **🧠 智能排除:** 插件设计有智能规则，会跳过已是超链接内部的文本，以及 `<pre>`, `<code>`, `<script>`, `<style>` 等标签内的内容，以避免破坏代码展示或页面样式。
-   **🛠️ 高度可配置:** 用户可以在设置中调整识别的正则表达式、排除的 HTML 标签，以及新创建链接的属性（例如：是否默认设置 `target="_blank"` 新窗口打开）。
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

安装完成后，插件将自动在您访问的网页上运行。

### 基本使用

1. **自动转换:** 访问任何包含纯文本 URL 的页面。您会发现这些文本（例如：`google.com`）现在有了下划线，并且可以像正常的超链接一样点击。

2. **激活/禁用:** 点击浏览器工具栏上的插件图标 (✍️)，可以快速启用或禁用插件功能，以应对可能需要关闭转换的特定网站。

3. **设置调整:** 右键点击插件图标 (✍️)，选择 **"选项"**，您可以：
    - 调整新链接是否在新标签页打开
    - 添加网站黑名单（在特定网站禁用插件）
    - 自定义排除的 HTML 标签

### 示例场景

**转换前：**

```
访问我们的网站 www.example.com 或发送邮件到 contact@example.com
更多信息请查看 https://github.com/example/project
```

**转换后：**

```
访问我们的网站 [www.example.com] 或发送邮件到 [contact@example.com]
更多信息请查看 [https://github.com/example/project]
```

（方括号内的文本将变成可点击的超链接）

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
    - 点击 **"加载已解压的扩展程序"**，并选择项目根目录

3. **修改代码后刷新:**
    - 在 `chrome://extensions` 页面点击插件的刷新按钮
    - 或者重新加载扩展程序

### 项目结构

```
Smart-Linkify/
├── extension/            # Chrome 扩展程序
│   ├── manifest.json    # 插件配置文件
│   ├── background.js    # 后台服务脚本
│   ├── content.js       # 内容脚本（核心转换逻辑）
│   ├── popup.html       # 弹出窗口界面
│   ├── popup.css        # 弹出窗口样式
│   ├── popup.js         # 弹出窗口逻辑
│   ├── options.html     # 设置页面界面
│   ├── options.css      # 设置页面样式
│   ├── options.js       # 设置页面逻辑
│   ├── welcome.html     # 欢迎页面
│   └── icons/           # 图标文件夹（由 scripts/generate-icons.js 生成）
│       ├── icon.svg     # 矢量源文件（唯一改动入口）
│       └── icon{16,32,48,96,128,256}.png
├── website/             # 项目官网
│   ├── index.html       # 官网首页
│   ├── css/
│   │   └── style.css    # 官网样式
│   ├── js/
│   │   └── main.js      # 官网脚本
│   └── images/          # 官网图片
└── docs/                # 文档文件
    ├── README.md
    ├── INSTALL.md
    ├── QUICKSTART.md
    └── ...
```

### 版本号同步

唯一版本来源为 `package.json` 中的 `version`。使用 `npm version patch|minor|major` 升级时，会执行 `npm run sync-version`，并同步更新 `extension/manifest.json`、`website/index.html` 以及 `README.md` / `README.zh-CN.md` 中的 Version 徽章。若手动修改 `package.json`，请在提交前运行 `npm run sync-version`（pre-commit 钩子也会执行同步）。

### 贡献流程

1. Fork 本仓库
2. 创建一个新的功能分支 (`git checkout -b feature/FixUrlRegex`)
3. 提交您的修改 (`git commit -m 'Improve URL matching regex'`)
4. 推送到分支 (`git push origin feature/FixUrlRegex`)
5. 创建一个 Pull Request

### 开发规范

-   遵循 JavaScript ES6+ 标准
-   保持代码简洁易读
-   添加必要的注释
-   测试新功能在不同网站上的表现

## 🐛 已知问题

-   某些使用 Shadow DOM 的网站可能无法正常转换
-   极少数情况下可能与其他扩展程序冲突

## 🗺️ 开发路线图

-   [ ] 支持自定义 URL 匹配规则
-   [ ] 添加链接预览功能
-   [ ] 支持更多协议（如 `ftp://`, `file://`）
-   [ ] 添加统计功能（显示转换的链接数量）
-   [ ] 支持国际化（多语言）
-   [ ] 优化性能，减少大型页面的处理时间

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
