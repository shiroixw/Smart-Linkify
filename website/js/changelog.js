;(function () {
	const RAW_URL =
		'https://raw.githubusercontent.com/shiroixw/Smart-Linkify/main/CHANGELOG.md'
	const GITHUB_BLOB =
		'https://github.com/shiroixw/Smart-Linkify/blob/main/CHANGELOG.md'

	function stripPresentationEmoji(markdown) {
		return markdown.replace(
			/(?:[\u{1F1E6}-\u{1F1FF}]{2}|[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}])(?:\uFE0F|\uFE0E)?(?:\u200D(?:[\u{1F000}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}])(?:\uFE0F|\uFE0E)?)*(?:\u20E3)?[ \t]?/gu,
			''
		)
	}

	function loadChangelog() {
		const loading = document.getElementById('changelog-loading')
		const body = document.getElementById('changelog-body')
		const err = document.getElementById('changelog-error')
		if (!body || !loading) return

		fetch(RAW_URL)
			.then(function (r) {
				if (!r.ok) throw new Error('HTTP ' + r.status)
				return r.text()
			})
			.then(function (md) {
				if (typeof marked === 'undefined') throw new Error('marked missing')
				body.innerHTML = marked.parse(stripPresentationEmoji(md))
				loading.style.display = 'none'
				body.style.display = 'block'
			})
			.catch(function () {
				loading.style.display = 'none'
				if (err) {
					err.style.display = 'block'
					const msg = err.querySelector('[data-changelog-error-msg]')
					if (msg && typeof i18n !== 'undefined' && i18n.t) {
						msg.textContent = i18n.t('changelog.loadError')
					}
				}
			})
	}

	const sourceLink = document.getElementById('changelog-source-link')
	if (sourceLink) sourceLink.href = GITHUB_BLOB

	if (document.getElementById('changelog-body')) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', loadChangelog)
		} else {
			loadChangelog()
		}
	}
})()
