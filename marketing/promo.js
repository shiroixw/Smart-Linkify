/**
 * 宣传图模板运行时
 *
 * URL 参数：
 *   ?lang=zh|en      文案语言
 *   ?theme=light|dark 画布主题
 *
 * DOM 约定：
 *   data-copy="a.b.0"  从 marketing/copy.js 取文案填入
 *   data-img="popup|options|demo"  按语言 + 主题拼出 assets 里的真实截图
 *   data-url="..."     浏览器外框里的地址栏文字
 */
;(function () {
	const params = new URLSearchParams(location.search);
	const lang = window.promoLang();
	const theme = params.get('theme') === 'dark' ? 'dark' : 'light';
	const isEn = lang === 'en';

	document.documentElement.lang = isEn ? 'en' : 'zh-CN';
	document.documentElement.dataset.theme = theme;

	const copy = window.PROMO_COPY[lang];
	if (!copy) throw new Error('缺少文案: ' + lang);

	const pick = (path) =>
		path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), copy);

	document.querySelectorAll('[data-copy]').forEach((el) => {
		const value = pick(el.dataset.copy);
		if (value == null) {
			console.warn('[promo] 文案缺失:', el.dataset.copy);
			return;
		}
		// 某语言下不需要该元素（例如英文没有中文副名）时直接移除，避免留空占位
		if (value === '') {
			el.remove();
			return;
		}
		el.textContent = String(value);
	});

	const IMAGES = {
		popup: () => `ui-popup-${theme}${isEn ? '-en' : ''}.png`,
		options: () => `ui-options-${theme}${isEn ? '-en' : ''}.png`,
		demo: () => `ui-demo-${isEn ? 'en' : 'light'}.png`,
	};

	document.querySelectorAll('[data-img]').forEach((el) => {
		const resolver = IMAGES[el.dataset.img];
		if (!resolver) return;
		el.src = '../assets/' + resolver();
	});

	document.querySelectorAll('[data-url]').forEach((el) => {
		el.textContent = el.dataset.url;
	});

	document.body.dataset.ready = 'true';
})();
