/**
 * 宣传图文案（单一来源）
 *
 * 约束：
 * - 只有文案在这里，版式在 promo.css / templates 里，不要在模板里写死字符串
 * - 文案要与扩展内 i18n（extension/i18n.js）的说法保持一致，避免商店页与产品两种口径
 * - 中英两套结构必须一一对应，新增 key 时两边同时补
 */
;(function (global) {
	const COPY = {
		'zh-CN': {
			brand: 'Smart Linkify',
			brandCn: '智能超链接助手',
			hero: {
				title: '把纯文本 URL\n变成可点击的链接',
				sub: '任意网页上的裸链接自动识别、就地转换，不改动页面原有结构。',
			},
			chips: ['自动识别', '逐站开关', '精准匹配'],
			autolink: {
				title: '识别即转换，页面零侵入',
				sub: '只在文本节点内包裹 <a>，编辑器、代码块与已有链接全部跳过。',
				tag: '真实页面实测',
				legend: ['纯文本 URL', '可点击链接'],
			},
			popup: {
				title: '当前网站状态，一眼看清',
				sub: '开关即生效，已转换数量实时统计。',
				feats: ['已转换链接数量统计', '为当前站点一键启用', '深浅色自动跟随系统'],
			},
			options: {
				title: '把识别精度调到刚好',
				sub: '只在你指定的站点生效，误匹配和隐私都握在自己手里。',
				bullets: [
					['精确匹配模式', '不再把版本号、统计数字误认成链接'],
					['排除文件扩展名', '.js / .css / .json 不会被当成链接'],
					['本地处理', '不联网、不收集任何数据'],
				],
			},
			promo: {
				tagline: '页面里的裸链接，直接可点',
			},
			og: {
				sub: '自动识别 · 逐站开关 · 本地处理，不收集任何数据',
			},
			poster: {
				title: '让网页里的\n每一条链接都能点',
				sub: 'Chrome 扩展 · 本地运行 · 不上传数据',
				rows: [
					['01', '自动识别', '文本里的 URL 即扫即转，无需手动复制粘贴'],
					['02', '逐站控制', '只在你信任的站点生效，其余站点保持原样'],
					['03', '深浅自适应', '界面跟随系统主题，暗色下同样不刺眼'],
				],
				footer: 'chrome 应用商店 · smart-linkify.vercel.app',
			},
		},
		en: {
			brand: 'Smart Linkify',
			brandCn: '',
			hero: {
				title: 'Turn plain-text URLs\ninto clickable links',
				sub: 'Bare links become clickable in place, on any page — without touching the page markup.',
			},
			chips: ['Auto-detect', 'Per-site toggle', 'Strict matching'],
			autolink: {
				title: 'Converts in place, zero intrusion',
				sub: 'Only text nodes are wrapped in <a>. Editors, code blocks and existing links are skipped.',
				tag: 'Captured on a real page',
				legend: ['plain URL', 'clickable link'],
			},
			popup: {
				title: 'The current site, at a glance',
				sub: 'Flip the switch and it applies instantly, with a live count of converted links.',
				feats: ['Live converted-link count', 'One-click enable per site', 'Light and dark, following the system'],
			},
			options: {
				title: 'Tune matching to your taste',
				sub: 'Runs only on the sites you trust — accuracy and privacy both stay in your hands.',
				bullets: [
					['Strict match mode', 'Stops treating version numbers and stats as links'],
					['Exclude file extensions', '.js / .css / .json are never linkified'],
					['Runs locally', 'No network calls, no data collection'],
				],
			},
			promo: {
				tagline: 'Bare links, instantly clickable',
			},
			og: {
				sub: 'Auto-detect · Per-site toggle · Runs locally, no data collection',
			},
			poster: {
				title: 'Every link on the page,\nclickable at last',
				sub: 'Chrome extension · Runs locally · No data collected',
				rows: [
					['01', 'Auto-detect', 'URLs in plain text are converted on the spot'],
					['02', 'Per-site control', 'Works only on sites you trust, others stay untouched'],
					['03', 'Light and dark', 'The UI follows your system theme'],
				],
				footer: 'Chrome Web Store · smart-linkify.vercel.app',
			},
		},
	};

	/**
	 * 用 ?lang=zh|en 决定语言；缺省中文。
	 * @returns {'zh-CN'|'en'}
	 */
	function currentLang() {
		const param = new URLSearchParams(location.search).get('lang');
		return param === 'en' ? 'en' : 'zh-CN';
	}

	global.PROMO_COPY = COPY;
	global.promoLang = currentLang;
})(window);
