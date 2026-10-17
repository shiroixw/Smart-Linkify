# ✍️ Smart Linkify – Instant hyperlink conversion

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)](https://github.com/shiroixw/Smart-Linkify)
[![Version](https://img.shields.io/badge/Version-1.1.0-blue)](https://github.com/shiroixw/Smart-Linkify/releases)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> 🌐 [简体中文](README.zh-CN.md) | English

## ✨ Introduction

**Smart Linkify – Instant hyperlink conversion** is an efficient Chrome browser extension that automatically **scans and converts plain text URLs (like `http://example.com` or `www.google.com`) into clickable HTML hyperlinks (`<a>` tags)**.

No more copying and pasting text links into the address bar! This extension makes your browsing experience smoother, making all visible links instantly clickable.

## 🚀 Features

-   **🔗 Smart Link Conversion:** Real-time scanning of web page content, automatically recognizing and replacing text in the following formats:
    -   URLs with protocols (e.g., `https://`, `http://`, `ftp://`)
    -   Common domain formats without protocols (e.g., `www.example.com`, `example.com/page`)
    -   Email addresses (e.g., `user@domain.com`)
-   **⚡ Real-time Dynamic Processing:** Handles not only content loaded during page load but also new content inserted via AJAX or JavaScript (scrolling, "load more", client-side route changes).
-   **🧠 Smart Exclusion:** Skips text already inside hyperlinks, and content within `<pre>`, `<code>`, `<script>`, `<style>`, `<textarea>` and `contenteditable` regions — so code blocks, page styling and your own typing stay untouched.
-   **🛠️ Opt-in per site:** Nothing is modified by default. Turn the toggle on for the current site in the popup; subdomains are covered (enabling `github.com` also covers `docs.github.com`) and the list can be managed in bulk from the options page.
-   **🔒 Security & Performance:** Fast and efficient conversion process, all operations are performed locally, won't significantly impact browsing speed, and no data is collected.

## 🌐 Official Website

Visit our website for more information: [https://smart-linkify.vercel.app/](https://smart-linkify.vercel.app/)

Website source code is located in the `website/` directory.

## 📥 Installation

### Option 1: Chrome Web Store (Recommended)

1. Visit [Chrome Web Store](https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl) to install the extension
2. Click the **"Add to Chrome"** button
3. Click **"Add extension"** in the confirmation dialog

### Option 2: Developer Mode (For Local Development)

1. Clone or download this repository:

    ```bash
    git clone https://github.com/shiroixw/Smart-Linkify.git
    ```

2. Open `chrome://extensions` in Chrome browser

3. Enable the **"Developer mode"** switch in the top right corner

4. Click the **"Load unpacked"** button

5. Select the `extension` folder in the project to complete installation

## 🔧 Usage

After installation the extension does **not** touch any page yet — you opt in per site first.

### Basic Usage

1. **Enable for a site:** Click the extension icon in the toolbar and turn on the toggle for the current site. The page reloads, and from then on plain text URLs on that site become clickable.

2. **See the count:** The number badge on the toolbar icon shows how many links were converted on the current page; the popup shows the same number.

3. **Settings:** Click **Settings** in the popup, or right-click the icon and choose **Options**, where you can:
    - Choose whether converted links open in a new tab
    - Manage the enabled-sites list (one domain per line)
    - Customize excluded HTML tags
    - Toggle strict matching and file-extension exclusion to avoid matching version numbers, statistics or `config.json`
    - Switch UI theme and language

### Example Scenario

**On an enabled site, this text:**

```
Visit our website www.example.com or email contact@example.com
For more info see https://github.com/example/project
```

**becomes:**

```
Visit our website [www.example.com] or email [contact@example.com]
For more info see [https://github.com/example/project]
```

(Text in brackets becomes clickable hyperlinks; on sites that are not enabled nothing changes)

## 💻 Development & Contributing

All forms of contributions are welcome! If you want to participate in project development, report bugs, or suggest features, please follow these steps.

### Local Development Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/shiroixw/Smart-Linkify.git
    cd Smart-Linkify
    ```

2. **Load in Chrome:**

    - Open `chrome://extensions`
    - Ensure **"Developer mode"** is enabled
    - Click **"Load unpacked"** and select the `extension/` directory

3. **Refresh after code changes:**
    - Click the refresh button for the extension on the `chrome://extensions` page
    - Or reload the extension
    - After editing `content.js`, also reload the target page (content scripts are not hot-reloaded)

### Project Structure

```
Smart-Linkify/
├── extension/                # Chrome extension (load this folder)
│   ├── manifest.json
│   ├── background.js         # Service worker: config migration, allow-list, badge
│   ├── content.js            # Content script: DOM walking and conversion
│   ├── lib/                  # Pure modules, directly testable in Node
│   │   ├── linkify.js        # URL / email detection
│   │   ├── dom-rules.js      # Exclusion rules
│   │   └── config.js         # Config defaults (single source)
│   ├── shared/               # Cross-page assets
│   │   ├── tokens.css        # Design tokens (color/space/radius/motion)
│   │   ├── theme.js          # Theme resolution (auto -> light/dark)
│   │   └── link.css          # Injected link styles
│   ├── popup.*               # Popup
│   ├── options.*             # Options page
│   ├── welcome.*             # First-run page
│   └── icons/                # icon.svg is the vector source, PNG set is generated
├── website/                  # Static marketing site
├── test/                     # node:test unit tests
├── scripts/                  # Version sync, git hooks, icon generation
├── docs/superpowers/         # Design and analysis documents
└── .github/workflows/ci.yml  # CI: tests / lint / type check
```

### Tests and quality gates

```bash
npm test                     # node:test unit tests
npx eslint .                 # ESLint
npx tsc -p jsconfig.json     # JSDoc type check (covers extension/lib)
```

The project has no runtime dependencies, so the toolchain is intentionally not listed in `package.json`; `npx` fetches it on first use. CI (`.github/workflows/ci.yml`) runs all three on every PR, plus manifest JSON validity and version consistency.

### Version sync

The canonical version is the `version` field in `package.json`. Use `npm version patch|minor|major` to bump; the `version` lifecycle script runs `npm run sync-version`, which updates `extension/manifest.json`, `website/index.html`, and the Version badges in `README.md` / `README.zh-CN.md`. If you edit `package.json` manually, run `npm run sync-version` before committing (also runs from the pre-commit hook).

### Contributing Workflow

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/FixUrlRegex`)
3. Commit your changes (`git commit -m 'Improve URL matching regex'`)
4. Push to the branch (`git push origin feature/FixUrlRegex`)
5. Create a Pull Request

### Development Guidelines

-   Follow JavaScript ES6+ standards; put new logic in `extension/lib/` with unit tests
-   Keep code concise and readable, comment where it matters
-   Before committing, make sure `npm test`, `npx eslint .` and `npx tsc -p jsconfig.json` are green
-   Test new features on real websites, especially `contenteditable` and Shadow DOM cases
-   Route colors / spacing / motion through `extension/shared/tokens.css` — no hardcoded values

## 🐛 Known Issues

-   Some websites using Shadow DOM may not work properly
-   Rarely conflicts with other extensions
-   Text-only updates that reuse an element (`element.textContent = …`) are covered by a `characterData` observer, but extremely fast-updating pages may still miss an occasional update

## 🗺️ Roadmap

-   [ ] Replace `<all_urls>` with `optional_host_permissions` + on-demand injection to shrink the install-time permission prompt
-   [ ] Support custom URL matching rules
-   [ ] Add link preview feature
-   [ ] Support more protocols such as `file://`
-   [ ] Process very large pages in batches to further reduce main-thread cost

## 📜 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) file for details.

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

## 🙏 Acknowledgments

Thanks to all developers and users who have contributed to this project!

## 📞 Contact

-   **Project Homepage:** [GitHub Repository](https://github.com/shiroixw/Smart-Linkify)
-   **Issue Tracker:** [GitHub Issues](https://github.com/shiroixw/Smart-Linkify/issues)
-   **Feature Requests:** Welcome to share your ideas via Issues

---

<div align="center">
  <p>If this project helps you, please give us a ⭐️ Star!</p>
  <p>Made with ❤️ by Smart Linkify – Instant hyperlink conversion Team</p>
</div>
