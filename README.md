# ✍️ Smart Linkify – Instant hyperlink conversion

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)](https://github.com/xiaowulang-turbo/Smart-Linkify)
[![Version](https://img.shields.io/badge/Version-1.0.5-blue)](https://github.com/xiaowulang-turbo/Smart-Linkify/releases)
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
-   **⚡ Real-time Dynamic Processing:** Handles not only content loaded during page load but also new content dynamically loaded via AJAX or JavaScript (e.g., when scrolling or clicking "load more").
-   **🧠 Smart Exclusion:** Designed with intelligent rules that skip text already inside hyperlinks and content within `<pre>`, `<code>`, `<script>`, `<style>` tags to avoid breaking code display or page styling.
-   **🛠️ Highly Configurable:** Users can adjust recognition regex patterns, excluded HTML tags, and attributes for newly created links (e.g., whether to open in `target="_blank"` by default).
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
    git clone https://github.com/xiaowulang-turbo/Smart-Linkify.git
    ```

2. Open `chrome://extensions` in Chrome browser

3. Enable the **"Developer mode"** switch in the top right corner

4. Click the **"Load unpacked"** button

5. Select the `extension` folder in the project to complete installation

## 🔧 Usage

After installation, the extension will automatically run on pages you visit.

### Basic Usage

1. **Auto Conversion:** Visit any page containing plain text URLs. You'll notice these texts (e.g., `google.com`) now have underlines and can be clicked like normal hyperlinks.

2. **Activate/Disable:** Click the extension icon (✍️) in the browser toolbar to quickly enable or disable the extension functionality for specific websites.

3. **Settings:** Right-click the extension icon (✍️), select **"Options"**, you can:
    - Adjust whether new links open in new tabs
    - Add website blacklist (disable extension on specific sites)
    - Customize excluded HTML tags

### Example Scenario

**Before Conversion:**

```
Visit our website www.example.com or email contact@example.com
For more info see https://github.com/example/project
```

**After Conversion:**

```
Visit our website [www.example.com] or email [contact@example.com]
For more info see [https://github.com/example/project]
```

(Text in brackets becomes clickable hyperlinks)

## 💻 Development & Contributing

All forms of contributions are welcome! If you want to participate in project development, report bugs, or suggest features, please follow these steps.

### Local Development Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/xiaowulang-turbo/Smart-Linkify.git
    cd Smart-Linkify
    ```

2. **Load in Chrome:**

    - Open `chrome://extensions`
    - Ensure **"Developer mode"** is enabled
    - Click **"Load unpacked"** and select the project root directory

3. **Refresh after code changes:**
    - Click the refresh button for the extension on the `chrome://extensions` page
    - Or reload the extension

### Project Structure

```
Smart-Linkify/
├── extension/            # Chrome Extension
│   ├── manifest.json    # Extension configuration
│   ├── background.js    # Background service script
│   ├── content.js       # Content script (core conversion logic)
│   ├── popup.html       # Popup UI
│   ├── popup.css        # Popup styles
│   ├── popup.js         # Popup logic
│   ├── options.html     # Options page UI
│   ├── options.css      # Options page styles
│   ├── options.js       # Options page logic
│   ├── welcome.html     # Welcome page
│   └── icons/           # Icons folder (generated by scripts/generate-icons.js)
│       ├── icon.svg     # Vector source of truth
│       └── icon{16,32,48,96,128,256}.png
├── website/             # Project website
│   ├── index.html       # Homepage
│   ├── css/
│   │   └── style.css    # Styles
│   ├── js/
│   │   └── main.js      # Scripts
│   └── images/          # Images
└── docs/                # Documentation
    ├── README.md
    ├── INSTALL.md
    ├── QUICKSTART.md
    └── ...
```

### Version sync

The canonical version is the `version` field in `package.json`. Use `npm version patch|minor|major` to bump; the `version` lifecycle script runs `npm run sync-version`, which updates `extension/manifest.json`, `website/index.html`, and the Version badges in `README.md` / `README.zh-CN.md`. If you edit `package.json` manually, run `npm run sync-version` before committing (also runs from the pre-commit hook).

### Contributing Workflow

1. Fork this repository
2. Create a new feature branch (`git checkout -b feature/FixUrlRegex`)
3. Commit your changes (`git commit -m 'Improve URL matching regex'`)
4. Push to the branch (`git push origin feature/FixUrlRegex`)
5. Create a Pull Request

### Development Guidelines

-   Follow JavaScript ES6+ standards
-   Keep code concise and readable
-   Add necessary comments
-   Test new features on different websites

## 🐛 Known Issues

-   Some websites using Shadow DOM may not work properly
-   Rarely conflicts with other extensions

## 🗺️ Roadmap

-   [ ] Support custom URL matching rules
-   [ ] Add link preview feature
-   [ ] Support more protocols (like `ftp://`, `file://`)
-   [ ] Add statistics (show number of converted links)
-   [ ] Support internationalization (multiple languages)
-   [ ] Optimize performance, reduce processing time for large pages

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

-   **Project Homepage:** [GitHub Repository](https://github.com/xiaowulang-turbo/Smart-Linkify)
-   **Issue Tracker:** [GitHub Issues](https://github.com/xiaowulang-turbo/Smart-Linkify/issues)
-   **Feature Requests:** Welcome to share your ideas via Issues

---

<div align="center">
  <p>If this project helps you, please give us a ⭐️ Star!</p>
  <p>Made with ❤️ by Smart Linkify – Instant hyperlink conversion Team</p>
</div>
