// 国际化 (i18n) 模块

const i18n = {
	// 翻译词典
	translations: {
		'zh-CN': {
			// 导航栏
			'nav.brand': '智能超链接识别',
			'nav.home': '首页',
			'nav.features': '功能',
			'nav.demo': '演示',
			'nav.download': '下载',
			'nav.docs': '文档',
			'common.switchTheme': '切换主题',

			// Hero 区域
			'hero.title': '智能超链接识别',
			'hero.subtitle': 'Smart Linkify – Instant hyperlink conversion',
			'hero.description':
				'自动将网页中的纯文本 URL 转换为可点击的超链接<br>让您的浏览体验更加顺畅，告别复制粘贴！',
			'hero.download': '立即下载',
			'hero.demo': '查看演示',
			'hero.version': '当前版本',
			'hero.free': '免费',
			'hero.opensource': '开源项目',
			'hero.license': '许可证',
			// 首屏场景（网页 + 悬浮状态卡）
			'hero.scene.eyebrow': '发布说明',
			'hero.scene.title': 'v1.1.0 · 更稳的链接识别',
			'hero.scene.body':
				'修复了动态内容里漏转的链接，新增站点白名单与更严格的匹配规则。',
			'hero.scene.link1':
				'完整变更见 <a href="https://github.com/shiroixw/Smart-Linkify/releases" target="_blank" rel="noopener">github.com/shiroixw/Smart-Linkify/releases</a>',
			'hero.scene.link2':
				'遇到问题？<a href="https://github.com/shiroixw/Smart-Linkify/issues" target="_blank" rel="noopener">github.com/shiroixw/Smart-Linkify/issues</a>',
			'hero.scene.chip.title': '本站已启用',
			'hero.scene.chip.meta': '4 条链接已转换',

			// 功能特性
			'features.title': '核心功能',
			'features.subtitle': '强大而智能的链接识别与转换能力',
			'features.smart.title': '智能识别',
			'features.smart.desc':
				'自动识别网页中的 URL、邮箱地址等文本链接，支持多种格式',
			'features.realtime.title': '实时转换',
			'features.realtime.desc':
				'不仅处理页面加载时的内容，还能实时处理动态加载的新内容',
			'features.exclude.title': '智能排除',
			'features.exclude.desc':
				'自动跳过代码块、已有链接等特殊区域，避免破坏页面结构',
			'features.config.title': '高度可配置',
			'features.config.desc':
				'支持自定义排除规则、白名单、链接打开方式等多项配置',
			'features.privacy.title': '安全隐私',
			'features.privacy.desc':
				'所有操作在本地完成，不收集任何数据，保护您的隐私安全',
			'features.performance.title': '高性能',
			'features.performance.desc':
				'经过优化的算法，对页面性能影响极小，流畅的使用体验',

			// 演示区域
			'demo.title': '实时演示',
			'demo.subtitle': '看看插件是如何工作的',
			'demo.video.alt': '录屏：在网页里发布带裸链接的评论，链接立即变为可点击',
			'demo.caption':
				'真实录屏：在网页里发布一条带裸链接的评论，链接当场变成可点击',

			// 真实界面
			'screens.title': '真实界面',
			'screens.subtitle': '插件里你每天会用到的两个界面',
			'screens.popup': '弹出面板：本站一键开关，实时显示已转换链接数',
			'screens.popup.alt': '弹出面板：本站开关与已转换链接统计',
			'screens.options': '设置页：精确匹配、排除文件扩展名、站点白名单',
			'screens.options.alt': '设置页：匹配精度与站点白名单',

			// 使用场景
			'usecases.title': '使用场景',
			'usecases.subtitle': '适用于各种网页浏览场景',
			'usecases.forum.title': '论坛和社区',
			'usecases.forum.desc':
				'在 Reddit、知乎等社区，用户分享的纯文本链接自动可点击',
			'usecases.docs.title': '技术文档',
			'usecases.docs.desc':
				'阅读技术文档时，文档中的 URL 引用自动变成超链接',
			'usecases.work.title': '工作协作',
			'usecases.work.desc': '在线协作工具中的链接分享更加便捷高效',
			'usecases.email.title': '邮件和联系',
			'usecases.email.desc': '网页上的邮箱地址自动变成 mailto 链接',

			// 下载安装
			'download.title': '下载安装',
			'download.subtitle': '快速开始使用智能超链接识别',
			'download.chrome.title': 'Chrome Web Store',
			'download.chrome.desc': '推荐方式，一键安装，自动更新',
			'download.chrome.btn': '从商店安装',
			'download.chrome.soon': '即将上架',
			'download.github.title': 'GitHub Release',
			'download.github.desc': '下载最新版本，手动安装',
			'download.github.btn': '前往 GitHub',
			'download.steps.title': '安装步骤',
			'download.step1.title': '下载扩展',
			'download.step1.desc': '从 Chrome Web Store 或 GitHub 下载',
			'download.step2.title': '加载扩展',
			'download.step2.desc': '打开 chrome://extensions 加载',
			'download.step3.title': '开始使用',
			'download.step3.desc': '访问任何网页，自动转换链接',

			// 文档资源
			'docs.title': '文档资源',
			'docs.subtitle': '详细的使用指南和开发文档',
			'docs.quickstart.title': '快速开始',
			'docs.quickstart.desc': '5 分钟快速上手指南',
			'docs.install.title': '安装指南',
			'docs.install.desc': '详细的安装步骤说明',
			'docs.full.title': '完整文档',
			'docs.full.desc': '项目完整说明文档',
			'docs.dev.title': '开发指南',
			'docs.dev.desc': '开发者技术文档',

			// FAQ
			'faq.title': '常见问题',
			'faq.subtitle': 'FAQ',
			'faq.q1': '插件是否免费？',
			'faq.a1':
				'是的，本插件完全免费且开源，采用 MIT 许可证。您可以自由使用、修改和分发。',
			'faq.q2': '插件会收集我的数据吗？',
			'faq.a2':
				'不会。所有操作都在本地完成，不会收集、存储或传输任何用户数据，完全保护您的隐私。',
			'faq.q3': '插件会影响浏览速度吗？',
			'faq.a3':
				'不会。插件经过性能优化，使用高效的算法，对页面加载和浏览速度的影响微乎其微。',
			'faq.q4': '如何为特定网站启用转换？',
			'faq.a4':
				'在插件弹窗中点击开关即可为当前网站启用链接转换，或在设置页面的白名单中添加域名。子域名会自动包含。',
			'faq.q5': '支持哪些浏览器？',
			'faq.a5':
				'目前支持 Chrome 88 及以上版本。未来计划支持 Edge、Firefox 等其他浏览器。',

			// 页脚
			'footer.tagline': '让网页浏览更加便捷',
			'footer.quicklinks': '快速链接',
			'footer.resources': '资源',
			'footer.about': '关于',
			'footer.docs': '项目文档',
			'footer.changelog': '更新日志',
			'footer.issues': '问题反馈',
			'footer.license': '开源许可',
			'footer.privacy': '隐私政策',
			'footer.github': 'GitHub 仓库',
			'footer.contribute': '贡献指南',
			'footer.conduct': '行为准则',
			'footer.copyright':
				'© 2024-2026 Smart Linkify – Instant hyperlink conversion. 保留所有权利。',
			'footer.mit': '基于 MIT 许可证发布',

			// 隐私政策页面
			'privacy.page.title': '隐私政策 - 智能超链接识别',
			'privacy.title': '隐私政策',
			'privacy.lastUpdated': '最后更新：2026年3月',
			'privacy.summary':
				'<strong>简要说明：</strong>智能超链接识别扩展不会收集、存储或传输任何用户数据。所有功能完全在您的浏览器本地运行。',
			'privacy.intro.title': '概述',
			'privacy.intro.content':
				'智能超链接识别（"本扩展"）是一款开源的 Chrome 浏览器扩展，旨在帮助用户自动将网页中的纯文本 URL 转换为可点击的超链接。我们非常重视用户隐私，本隐私政策将详细说明我们如何处理您的信息。',
			'privacy.collect.title': '信息收集',
			'privacy.collect.content':
				'本扩展不收集任何个人信息或使用数据。具体来说：',
			'privacy.collect.item1': '不收集您的浏览历史',
			'privacy.collect.item2': '不收集您访问的网站信息',
			'privacy.collect.item3': '不收集任何个人身份信息',
			'privacy.collect.item4': '不收集设备信息或位置数据',
			'privacy.collect.item5': '不使用任何分析或追踪服务',
			'privacy.storage.title': '本地存储',
			'privacy.storage.content':
				'本扩展仅在您的浏览器本地存储以下设置信息：',
			'privacy.storage.item1': '网站白名单配置',
			'privacy.storage.item2': '用户自定义的排除规则',
			'privacy.storage.item3': '链接打开方式等用户偏好',
			'privacy.storage.item4': '界面主题和语言偏好',
			'privacy.storage.note':
				'这些数据仅存储在您的本地设备上，不会被传输到任何外部服务器。您可以随时通过浏览器的扩展管理功能清除这些数据。',
			'privacy.permissions.title': '权限说明',
			'privacy.permissions.content': '本扩展请求以下权限：',
			'privacy.permissions.item1':
				'<strong>activeTab</strong>：允许扩展在当前活动标签页上运行，用于检测和转换文本链接',
			'privacy.permissions.item2':
				'<strong>storage</strong>：允许扩展在本地存储您的设置偏好',
			'privacy.permissions.item3':
				'<strong>所有网址访问权限</strong>：允许扩展在所有网页上运行链接转换功能',
			'privacy.permissions.note':
				'这些权限仅用于实现扩展的核心功能，不会被用于收集或传输任何数据。',
			'privacy.thirdparty.title': '第三方服务',
			'privacy.thirdparty.content':
				'本扩展不使用任何第三方分析、广告或追踪服务。扩展的所有功能完全在本地运行，不与任何外部服务器通信。',
			'privacy.opensource.title': '开源透明',
			'privacy.opensource.content':
				'本扩展是完全开源的，源代码托管在 GitHub 上。您可以随时审查我们的代码，验证我们的隐私承诺。',
			'privacy.opensource.link': '查看源代码',
			'privacy.changes.title': '政策更新',
			'privacy.changes.content':
				'如果我们对本隐私政策进行重大更改，我们将在此页面上发布更新后的政策，并更新"最后更新"日期。建议您定期查看本页面以了解任何变化。',
			'privacy.contact.title': '联系我们',
			'privacy.contact.content':
				'如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：',
			'privacy.contact.github': 'GitHub Issues：',
			'privacy.contact.githubLink': '提交问题反馈',
			'privacy.contact.email': '电子邮件：',

			// 文档页面
			'docs.page.title': '使用文档 - 智能超链接识别',
			'docs.page.heading': '使用文档',
			'docs.page.subtitle': '从安装到开发，一站式了解智能超链接识别',
			'docs.nav.quickstart': '快速开始',
			'docs.nav.install': '安装指南',
			'docs.nav.development': '开发指南',

			'docs.qs.title': '快速开始',
			'docs.qs.intro': '只需三步，即可开始使用智能超链接识别扩展。',
			'docs.qs.step1': '访问 <a href="https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl" target="_blank">Chrome Web Store</a>，点击「添加至 Chrome」安装扩展。',
			'docs.qs.step2': '打开任意网页，点击工具栏中的扩展图标，开启当前网站的开关。',
			'docs.qs.step3': '页面中的纯文本 URL 和邮箱地址将自动转换为可点击的超链接，工具栏图标会显示转换数量。',
			'docs.qs.tip': '<strong>提示：</strong>扩展采用白名单机制，需要手动为每个网站启用。在设置页面可以批量管理已启用的网站，子域名会自动包含。',

			'docs.install.title': '安装指南',
			'docs.install.store.title': '方式一：Chrome Web Store（推荐）',
			'docs.install.store.step1': '访问 <a href="https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl" target="_blank">Chrome Web Store 页面</a>。',
			'docs.install.store.step2': '点击「添加至 Chrome」按钮，在弹出的对话框中点击「添加扩展程序」。',
			'docs.install.store.step3': '安装完成后，工具栏会出现扩展图标，后续版本将自动更新。',
			'docs.install.github.title': '方式二：GitHub Release',
			'docs.install.github.step1': '前往 <a href="https://github.com/xiaowulang-turbo/Smart-Linkify/releases" target="_blank">GitHub Releases</a> 下载最新版本的 ZIP 文件并解压。',
			'docs.install.github.step2': '在 Chrome 地址栏输入 <code>chrome://extensions</code>，开启右上角的「开发者模式」。',
			'docs.install.github.step3': '点击「加载已解压的扩展程序」，选择解压后的 <code>extension</code> 文件夹。',
			'docs.install.dev.title': '方式三：开发者模式',
			'docs.install.dev.desc': '克隆仓库后，按方式二的步骤 2-3 加载 <code>extension</code> 文件夹即可。修改代码后在扩展管理页面点击刷新按钮重新加载。',
			'docs.install.requirements.title': '系统要求',
			'docs.install.requirements.item1': 'Chrome 88 及以上版本（Manifest V3）',
			'docs.install.requirements.item2': '兼容基于 Chromium 的浏览器（Edge、Brave 等）',

			'docs.dev.title': '开发指南',
			'docs.dev.structure.title': '项目结构',
			'docs.dev.arch.title': '架构概览',
			'docs.dev.arch.desc': '扩展基于 Manifest V3，由四个核心模块组成：',
			'docs.dev.arch.item1': '<strong>Service Worker</strong>（background.js）：管理配置、白名单切换、Badge 计数更新。',
			'docs.dev.arch.item2': '<strong>Content Script</strong>（content.js）：使用 TreeWalker 遍历文本节点，正则匹配 URL/邮箱并转换为超链接；通过 MutationObserver 实时处理动态内容。',
			'docs.dev.arch.item3': '<strong>Popup</strong>（popup.html/js）：显示当前域名、白名单开关和转换统计。',
			'docs.dev.arch.item4': '<strong>Options</strong>（options.html/js）：白名单管理、排除标签、精确模式等高级设置。',
			'docs.dev.dataflow.title': '数据流',
			'docs.dev.dataflow.desc': '配置存储在 <code>chrome.storage.sync</code>。页面加载时 Content Script 读取配置，检查白名单后执行转换，并通过消息机制将链接计数上报给 Service Worker 更新 Badge。',
			'docs.dev.workflow.title': '本地开发流程',
			'docs.dev.workflow.step1': '克隆仓库：<code>git clone</code> 并进入项目目录。',
			'docs.dev.workflow.step2': '在 <code>chrome://extensions</code> 开启开发者模式，加载 <code>extension</code> 文件夹。',
			'docs.dev.workflow.step3': '修改代码后，点击扩展管理页面的刷新按钮重新加载，或刷新目标网页查看效果。',
			'docs.dev.workflow.step4': '调试时使用 DevTools：Service Worker 可在扩展详情页打开；Content Script 在目标页面的控制台查看；Popup 右键「检查」打开。',
			'docs.dev.contributing.title': '参与贡献',
			'docs.dev.contributing.desc': '欢迎提交 Issue 和 Pull Request！请遵循 ES6+ 规范，保持代码简洁可读，并在不同网站上测试新功能。',
			'docs.dev.contributing.link': '前往 GitHub 仓库',

			// 更新日志页面（内容从 GitHub Raw 拉取 CHANGELOG.md）
			'changelog.page.title': '更新日志 - 智能超链接识别',
			'changelog.page.heading': '更新日志',
			'changelog.page.subtitle':
				'内容与 GitHub 仓库 main 分支的 CHANGELOG.md 同步',
			'changelog.loading': '正在加载更新日志…',
			'changelog.loadError':
				'无法加载更新日志。请检查网络或直接在 GitHub 上查看 CHANGELOG.md。',
			'changelog.viewSource': '在 GitHub 上查看源文件',
		},
		en: {
			// 导航栏
			'nav.brand': 'Smart Linkify – Instant hyperlink conversion',
			'nav.home': 'Home',
			'nav.features': 'Features',
			'nav.demo': 'Demo',
			'nav.download': 'Download',
			'nav.docs': 'Docs',
			'common.switchTheme': 'Switch theme',

			// Hero 区域
			'hero.title': 'Smart Linkify – Instant hyperlink conversion',
			'hero.subtitle': 'Smart Linkify – Instant hyperlink conversion',
			'hero.description':
				'Automatically convert plain text URLs into clickable hyperlinks<br>Make your browsing experience smoother, say goodbye to copy-paste!',
			'hero.download': 'Download Now',
			'hero.demo': 'View Demo',
			'hero.version': 'Version',
			'hero.free': 'Free',
			'hero.opensource': 'Open Source',
			'hero.license': 'License',
			// 首屏场景（网页 + 悬浮状态卡）
			'hero.scene.eyebrow': 'Release notes',
			'hero.scene.title': 'v1.1.0 · steadier link detection',
			'hero.scene.body':
				'Fixes links missed in dynamic content, plus a site allow-list and stricter matching.',
			'hero.scene.link1':
				'Full changelog: <a href="https://github.com/shiroixw/Smart-Linkify/releases" target="_blank" rel="noopener">github.com/shiroixw/Smart-Linkify/releases</a>',
			'hero.scene.link2':
				'Found a bug? <a href="https://github.com/shiroixw/Smart-Linkify/issues" target="_blank" rel="noopener">github.com/shiroixw/Smart-Linkify/issues</a>',
			'hero.scene.chip.title': 'Enabled on this site',
			'hero.scene.chip.meta': '4 links converted',

			// 功能特性
			'features.title': 'Core Features',
			'features.subtitle': 'Powerful and intelligent link recognition',
			'features.smart.title': 'Smart Detection',
			'features.smart.desc':
				'Automatically detect URLs, email addresses and other text links on web pages',
			'features.realtime.title': 'Real-time Conversion',
			'features.realtime.desc':
				'Process not only page load content, but also dynamically loaded content',
			'features.exclude.title': 'Smart Exclusion',
			'features.exclude.desc':
				'Automatically skip code blocks, existing links to avoid breaking page structure',
			'features.config.title': 'Highly Configurable',
			'features.config.desc':
				'Support custom exclusion rules, whitelist, link opening methods and more',
			'features.privacy.title': 'Privacy & Security',
			'features.privacy.desc':
				'All operations are done locally, no data collection, protecting your privacy',
			'features.performance.title': 'High Performance',
			'features.performance.desc':
				'Optimized algorithms with minimal impact on page performance',

			// 演示区域
			'demo.title': 'Live Demo',
			'demo.subtitle': 'See how the extension works',
			'demo.video.alt':
				'Screen recording: posting a comment with bare URLs, which turn into clickable links instantly',
			'demo.caption':
				'Real screen recording: post a comment with bare URLs and they become clickable on the spot',

			// 真实界面
			'screens.title': 'Inside the extension',
			'screens.subtitle': 'The two screens you will actually use every day',
			'screens.popup':
				'Popup: one switch for the current site, with a live converted-link count',
			'screens.popup.alt':
				'Popup: per-site switch and converted-link statistics',
			'screens.options':
				'Options: strict matching, excluded file extensions, allow-list',
			'screens.options.alt': 'Options: matching precision and site allow-list',

			// 使用场景
			'usecases.title': 'Use Cases',
			'usecases.subtitle': 'Suitable for various web browsing scenarios',
			'usecases.forum.title': 'Forums & Communities',
			'usecases.forum.desc':
				'Plain text links shared on Reddit, Stack Overflow become clickable',
			'usecases.docs.title': 'Technical Docs',
			'usecases.docs.desc':
				'URL references in documentation automatically become hyperlinks',
			'usecases.work.title': 'Work Collaboration',
			'usecases.work.desc':
				'Link sharing in online collaboration tools becomes more convenient',
			'usecases.email.title': 'Email & Contact',
			'usecases.email.desc':
				'Email addresses on web pages automatically become mailto links',

			// 下载安装
			'download.title': 'Download',
			'download.subtitle': 'Get started with Smart Linkify – Instant hyperlink conversion',
			'download.chrome.title': 'Chrome Web Store',
			'download.chrome.desc':
				'Recommended, one-click install, auto update',
			'download.chrome.btn': 'Install from Store',
			'download.chrome.soon': 'Coming Soon',
			'download.github.title': 'GitHub Release',
			'download.github.desc': 'Download latest version, manual install',
			'download.github.btn': 'Go to GitHub',
			'download.steps.title': 'Installation Steps',
			'download.step1.title': 'Download',
			'download.step1.desc': 'From Chrome Web Store or GitHub',
			'download.step2.title': 'Load Extension',
			'download.step2.desc': 'Open chrome://extensions to load',
			'download.step3.title': 'Start Using',
			'download.step3.desc': 'Visit any webpage, links auto-convert',

			// 文档资源
			'docs.title': 'Documentation',
			'docs.subtitle': 'Detailed guides and developer docs',
			'docs.quickstart.title': 'Quick Start',
			'docs.quickstart.desc': '5-minute getting started guide',
			'docs.install.title': 'Installation',
			'docs.install.desc': 'Detailed installation instructions',
			'docs.full.title': 'Full Docs',
			'docs.full.desc': 'Complete project documentation',
			'docs.dev.title': 'Developer Guide',
			'docs.dev.desc': 'Technical documentation for developers',

			// FAQ
			'faq.title': 'FAQ',
			'faq.subtitle': 'Frequently Asked Questions',
			'faq.q1': 'Is the extension free?',
			'faq.a1':
				'Yes, this extension is completely free and open source under MIT license. You can freely use, modify and distribute it.',
			'faq.q2': 'Does the extension collect my data?',
			'faq.a2':
				'No. All operations are done locally, no data is collected, stored or transmitted. Your privacy is fully protected.',
			'faq.q3': 'Will the extension slow down my browser?',
			'faq.a3':
				'No. The extension is optimized with efficient algorithms, with minimal impact on page loading and browsing speed.',
			'faq.q4': 'How to enable conversion for specific websites?',
			'faq.a4':
				'Toggle the switch in the extension popup to enable link conversion for the current site, or add domains in the settings whitelist. Subdomains are included automatically.',
			'faq.q5': 'Which browsers are supported?',
			'faq.a5':
				'Currently supports Chrome 88 and above. Future support for Edge, Firefox and other browsers is planned.',

			// 页脚
			'footer.tagline': 'Making web browsing more convenient',
			'footer.quicklinks': 'Quick Links',
			'footer.resources': 'Resources',
			'footer.about': 'About',
			'footer.docs': 'Documentation',
			'footer.changelog': 'Changelog',
			'footer.issues': 'Report Issues',
			'footer.license': 'License',
			'footer.privacy': 'Privacy Policy',
			'footer.github': 'GitHub Repo',
			'footer.contribute': 'Contributing',
			'footer.conduct': 'Code of Conduct',
			'footer.copyright':
				'© 2024-2026 Smart Linkify – Instant hyperlink conversion. All rights reserved.',
			'footer.mit': 'Released under the MIT License',

			// Privacy Policy Page
			'privacy.page.title':
				'Privacy Policy - Smart Linkify – Instant hyperlink conversion',
			'privacy.title': 'Privacy Policy',
			'privacy.lastUpdated': 'Last Updated: March 2026',
			'privacy.summary':
				'<strong>Summary:</strong> The Smart Linkify – Instant hyperlink conversion extension does not collect, store, or transmit any user data. All features run entirely locally in your browser.',
			'privacy.intro.title': 'Overview',
			'privacy.intro.content':
				'Smart Linkify – Instant hyperlink conversion ("the Extension") is an open-source Chrome browser extension designed to help users automatically convert plain text URLs into clickable hyperlinks. We take user privacy very seriously, and this privacy policy details how we handle your information.',
			'privacy.collect.title': 'Information Collection',
			'privacy.collect.content':
				'This extension does not collect any personal information or usage data. Specifically:',
			'privacy.collect.item1': 'We do not collect your browsing history',
			'privacy.collect.item2':
				'We do not collect information about websites you visit',
			'privacy.collect.item3':
				'We do not collect any personally identifiable information',
			'privacy.collect.item4':
				'We do not collect device information or location data',
			'privacy.collect.item5':
				'We do not use any analytics or tracking services',
			'privacy.storage.title': 'Local Storage',
			'privacy.storage.content':
				'This extension only stores the following settings locally in your browser:',
			'privacy.storage.item1': 'Website whitelist configuration',
			'privacy.storage.item2': 'User-defined exclusion rules',
			'privacy.storage.item3': 'Link opening preferences',
			'privacy.storage.item4': 'Interface theme and language preferences',
			'privacy.storage.note':
				"This data is only stored on your local device and is never transmitted to any external servers. You can clear this data at any time through your browser's extension management.",
			'privacy.permissions.title': 'Permissions',
			'privacy.permissions.content':
				'This extension requests the following permissions:',
			'privacy.permissions.item1':
				'<strong>activeTab</strong>: Allows the extension to run on the current active tab for detecting and converting text links',
			'privacy.permissions.item2':
				'<strong>storage</strong>: Allows the extension to store your settings preferences locally',
			'privacy.permissions.item3':
				'<strong>All URLs access</strong>: Allows the extension to run link conversion on all web pages',
			'privacy.permissions.note':
				'These permissions are only used to implement core extension functionality and will not be used to collect or transmit any data.',
			'privacy.thirdparty.title': 'Third-Party Services',
			'privacy.thirdparty.content':
				'This extension does not use any third-party analytics, advertising, or tracking services. All extension features run entirely locally and do not communicate with any external servers.',
			'privacy.opensource.title': 'Open Source Transparency',
			'privacy.opensource.content':
				'This extension is completely open source, with source code hosted on GitHub. You can review our code at any time to verify our privacy commitments.',
			'privacy.opensource.link': 'View Source Code',
			'privacy.changes.title': 'Policy Updates',
			'privacy.changes.content':
				'If we make significant changes to this privacy policy, we will post the updated policy on this page and update the "Last Updated" date. We recommend checking this page periodically for any changes.',
			'privacy.contact.title': 'Contact Us',
			'privacy.contact.content':
				'If you have any questions or suggestions about this privacy policy, please contact us through:',
			'privacy.contact.github': 'GitHub Issues: ',
			'privacy.contact.githubLink': 'Submit Feedback',
			'privacy.contact.email': 'Email: ',

			// Documentation page
			'docs.page.title': 'Documentation - Smart Linkify – Instant hyperlink conversion',
			'docs.page.heading': 'Documentation',
			'docs.page.subtitle': 'Everything you need from installation to development',
			'docs.nav.quickstart': 'Quick Start',
			'docs.nav.install': 'Installation',
			'docs.nav.development': 'Development',

			'docs.qs.title': 'Quick Start',
			'docs.qs.intro': 'Get started with Smart Linkify – Instant hyperlink conversion in just three steps.',
			'docs.qs.step1': 'Visit the <a href="https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl" target="_blank">Chrome Web Store</a> and click "Add to Chrome" to install.',
			'docs.qs.step2': 'Open any webpage, click the extension icon in the toolbar, and toggle the switch on for the current site.',
			'docs.qs.step3': 'Plain text URLs and email addresses on the page will be automatically converted to clickable hyperlinks. The toolbar icon shows the conversion count.',
			'docs.qs.tip': '<strong>Tip:</strong> The extension uses a whitelist model — you need to manually enable it for each site. Manage enabled sites in the settings page. Subdomains are included automatically.',

			'docs.install.title': 'Installation Guide',
			'docs.install.store.title': 'Option 1: Chrome Web Store (Recommended)',
			'docs.install.store.step1': 'Visit the <a href="https://chromewebstore.google.com/detail/dcfgdgniapopldemehcepddjcfhakhfl" target="_blank">Chrome Web Store page</a>.',
			'docs.install.store.step2': 'Click "Add to Chrome", then click "Add extension" in the confirmation dialog.',
			'docs.install.store.step3': 'Once installed, the extension icon appears in your toolbar. Future updates are automatic.',
			'docs.install.github.title': 'Option 2: GitHub Release',
			'docs.install.github.step1': 'Go to <a href="https://github.com/xiaowulang-turbo/Smart-Linkify/releases" target="_blank">GitHub Releases</a>, download the latest ZIP file and extract it.',
			'docs.install.github.step2': 'Navigate to <code>chrome://extensions</code> in Chrome and enable "Developer mode" in the top right.',
			'docs.install.github.step3': 'Click "Load unpacked" and select the extracted <code>extension</code> folder.',
			'docs.install.dev.title': 'Option 3: Developer Mode',
			'docs.install.dev.desc': 'After cloning the repository, follow steps 2-3 from Option 2 to load the <code>extension</code> folder. After code changes, click the refresh button on the extensions page to reload.',
			'docs.install.requirements.title': 'System Requirements',
			'docs.install.requirements.item1': 'Chrome 88 or later (Manifest V3)',
			'docs.install.requirements.item2': 'Compatible with Chromium-based browsers (Edge, Brave, etc.)',

			'docs.dev.title': 'Development Guide',
			'docs.dev.structure.title': 'Project Structure',
			'docs.dev.arch.title': 'Architecture Overview',
			'docs.dev.arch.desc': 'The extension is built on Manifest V3 with four core modules:',
			'docs.dev.arch.item1': '<strong>Service Worker</strong> (background.js): Manages configuration, whitelist toggling, and badge count updates.',
			'docs.dev.arch.item2': '<strong>Content Script</strong> (content.js): Uses TreeWalker to traverse text nodes, regex-matches URLs/emails and converts them to hyperlinks; MutationObserver handles dynamic content in real time.',
			'docs.dev.arch.item3': '<strong>Popup</strong> (popup.html/js): Shows current domain, whitelist toggle, and conversion statistics.',
			'docs.dev.arch.item4': '<strong>Options</strong> (options.html/js): Whitelist management, excluded tags, strict mode, and other advanced settings.',
			'docs.dev.dataflow.title': 'Data Flow',
			'docs.dev.dataflow.desc': 'Configuration is stored in <code>chrome.storage.sync</code>. On page load, the content script reads config, checks the whitelist, performs conversion, and reports the link count to the service worker via messaging to update the badge.',
			'docs.dev.workflow.title': 'Local Development Workflow',
			'docs.dev.workflow.step1': 'Clone the repository: <code>git clone</code> and enter the project directory.',
			'docs.dev.workflow.step2': 'Open <code>chrome://extensions</code>, enable Developer mode, and load the <code>extension</code> folder.',
			'docs.dev.workflow.step3': 'After making changes, click the refresh button on the extensions page to reload, or refresh the target webpage to see results.',
			'docs.dev.workflow.step4': 'Debug with DevTools: Open service worker from extension details; view content script in the target page console; right-click the popup and select "Inspect".',
			'docs.dev.contributing.title': 'Contributing',
			'docs.dev.contributing.desc': 'Issues and pull requests are welcome! Follow ES6+ conventions, keep code clean and readable, and test new features across different websites.',
			'docs.dev.contributing.link': 'Go to GitHub Repository',

			// Changelog page (fetches CHANGELOG.md from GitHub Raw)
			'changelog.page.title': 'Changelog - Smart Linkify – Instant hyperlink conversion',
			'changelog.page.heading': 'Changelog',
			'changelog.page.subtitle':
				'Synced with CHANGELOG.md on the main branch of the GitHub repository',
			'changelog.loading': 'Loading changelog…',
			'changelog.loadError':
				'Could not load the changelog. Check your network or view CHANGELOG.md on GitHub.',
			'changelog.viewSource': 'View source file on GitHub',
		},
	},

	// 当前语言
	currentLang: 'zh-CN',

	// 初始化
	init() {
		// 从 localStorage 读取语言设置
		const savedLang = localStorage.getItem('lang')
		if (savedLang && this.translations[savedLang]) {
			this.currentLang = savedLang
		} else {
			// 检测浏览器语言
			const browserLang = navigator.language || navigator.userLanguage
			this.currentLang = browserLang.startsWith('zh') ? 'zh-CN' : 'en'
		}

		// 设置 HTML lang 属性
		document.documentElement.setAttribute(
			'lang',
			this.currentLang === 'zh-CN' ? 'zh-CN' : 'en'
		)

		// 应用翻译
		this.applyTranslations()

		// 更新切换按钮状态
		this.updateToggleButton()
	},

	// 应用翻译
	applyTranslations() {
		const elements = document.querySelectorAll('[data-i18n]')
		elements.forEach((el) => {
			const key = el.getAttribute('data-i18n')
			const translation = this.t(key)
			if (translation) {
				// 检查是否包含 HTML
				if (translation.includes('<')) {
					el.innerHTML = translation
				} else {
					el.textContent = translation
				}
			}
		})

		// 更新 placeholder 属性
		const placeholders = document.querySelectorAll(
			'[data-i18n-placeholder]'
		)
		placeholders.forEach((el) => {
			const key = el.getAttribute('data-i18n-placeholder')
			const translation = this.t(key)
			if (translation) {
				el.placeholder = translation
			}
		})

		// 更新 title 属性
		const titles = document.querySelectorAll('[data-i18n-title]')
		titles.forEach((el) => {
			const key = el.getAttribute('data-i18n-title')
			const translation = this.t(key)
			if (translation) {
				el.title = translation
			}
		})

		// 更新 aria-label 属性
		const ariaLabels = document.querySelectorAll(
			'[data-i18n-aria-label]'
		)
		ariaLabels.forEach((el) => {
			const key = el.getAttribute('data-i18n-aria-label')
			const translation = this.t(key)
			if (translation) {
				el.setAttribute('aria-label', translation)
			}
		})

		// 更新 img 的 alt 属性
		const alts = document.querySelectorAll('[data-i18n-alt]')
		alts.forEach((el) => {
			const key = el.getAttribute('data-i18n-alt')
			const translation = this.t(key)
			if (translation) {
				el.setAttribute('alt', translation)
			}
		})
	},

	// 获取翻译
	t(key) {
		return this.translations[this.currentLang]?.[key] || key
	},

	// 切换语言
	setLang(lang) {
		if (this.translations[lang]) {
			this.currentLang = lang
			localStorage.setItem('lang', lang)
			document.documentElement.setAttribute(
				'lang',
				lang === 'zh-CN' ? 'zh-CN' : 'en'
			)
			this.applyTranslations()
			this.updateToggleButton()
		}
	},

	// 切换语言（中英文互切）
	toggle() {
		const newLang = this.currentLang === 'zh-CN' ? 'en' : 'zh-CN'
		this.setLang(newLang)
	},

	// 更新切换按钮状态
	updateToggleButton() {
		const btn = document.querySelector('.lang-toggle')
		if (btn) {
			btn.textContent = this.currentLang === 'zh-CN' ? 'EN' : '中'
			btn.title =
				this.currentLang === 'zh-CN'
					? 'Switch to English'
					: '切换到中文'
		}
	},
}

// 页面加载时初始化
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => i18n.init())
} else {
	i18n.init()
}
