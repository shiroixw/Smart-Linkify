// 智能超链接识别官网 - 主脚本

const THEME_KEY = 'theme'
const DARK_MEDIA = '(prefers-color-scheme: dark)'

// 尽早执行，避免主题闪烁
initTheme()

document.addEventListener('DOMContentLoaded', function () {
	initThemeToggle()
	initMobileMenu()
	initFAQ()
	initSmoothScroll()
	initAnimations()
})

function prefersDark() {
	return !!(window.matchMedia && window.matchMedia(DARK_MEDIA).matches)
}

function prefersReducedMotion() {
	return !!(
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches
	)
}

/**
 * 用户显式选择优先，否则跟随系统
 * @returns {'light' | 'dark'}
 */
function resolveTheme() {
	const saved = localStorage.getItem(THEME_KEY)
	if (saved === 'light' || saved === 'dark') return saved
	return prefersDark() ? 'dark' : 'light'
}

/**
 * 把解析结果写到 <html data-theme>，CSS 只需一层 [data-theme='dark'] 覆盖
 * @param {'light' | 'dark'} [theme]
 */
function applyTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme || resolveTheme())
}

function initTheme() {
	applyTheme()
	if (!window.matchMedia) return
	window.matchMedia(DARK_MEDIA).addEventListener('change', function () {
		// 只有"跟随系统"时才响应系统切换
		const saved = localStorage.getItem(THEME_KEY)
		if (saved !== 'light' && saved !== 'dark') applyTheme()
	})
}

function initThemeToggle() {
	const themeToggle = document.querySelector('.theme-toggle')
	if (!themeToggle) return

	themeToggle.addEventListener('click', function () {
		const current = document.documentElement.getAttribute('data-theme')
		const newTheme = current === 'dark' ? 'light' : 'dark'
		applyTheme(newTheme)
		localStorage.setItem(THEME_KEY, newTheme)
	})
}

function initMobileMenu() {
	const toggle = document.querySelector('.mobile-menu-toggle')
	const menu = document.querySelector('.nav-menu')
	if (!toggle || !menu) return

	if (!menu.id) menu.id = 'navMenu'
	toggle.setAttribute('aria-controls', menu.id)

	function setOpen(open) {
		menu.classList.toggle('active', open)
		toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
	}

	toggle.addEventListener('click', function () {
		setOpen(!menu.classList.contains('active'))
	})

	menu.querySelectorAll('a').forEach(function (item) {
		item.addEventListener('click', function () {
			setOpen(false)
		})
	})
}

function initFAQ() {
	const faqItems = document.querySelectorAll('.faq-item')

	faqItems.forEach(function (item) {
		const question = item.querySelector('.faq-question')
		if (!question) return

		question.addEventListener('click', function () {
			faqItems.forEach(function (other) {
				if (other !== item && other.classList.contains('active')) {
					other.classList.remove('active')
					const btn = other.querySelector('.faq-question')
					if (btn) btn.setAttribute('aria-expanded', 'false')
				}
			})
			const open = item.classList.toggle('active')
			question.setAttribute('aria-expanded', open ? 'true' : 'false')
		})
	})
}

function initSmoothScroll() {
	const links = document.querySelectorAll('a[href^="#"]')

	links.forEach(function (link) {
		link.addEventListener('click', function (e) {
			const href = link.getAttribute('href')
			if (href === '#' || href === '#!') return

			const target = document.querySelector(href)
			if (!target) return

			e.preventDefault()
			const navbar = document.querySelector('.navbar')
			const navbarHeight = navbar ? navbar.offsetHeight : 0
			window.scrollTo({
				top: target.offsetTop - navbarHeight,
				behavior: prefersReducedMotion() ? 'auto' : 'smooth',
			})
		})
	})
}

function initAnimations() {
	// 尊重"减少动态效果"：直接显示，不做入场动画
	if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

	const observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return
				entry.target.style.opacity = '1'
				observer.unobserve(entry.target)
			})
		},
		{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
	)

	const animatedElements = document.querySelectorAll(
		'.feature-card, .use-case-card, .doc-card, .download-card, .step'
	)

	animatedElements.forEach(function (el) {
		el.style.opacity = '0'
		el.style.transition = 'opacity var(--dur-slow, 300ms) var(--ease, ease)'
		observer.observe(el)
	})
}
