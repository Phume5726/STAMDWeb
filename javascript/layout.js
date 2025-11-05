(function () {
	'use strict';

	// Small helper to safely create elements
	function createEl(tag, attrs = {}, text) {
		var el = document.createElement(tag);
		for (var k in attrs) {
			if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
			el.setAttribute(k, attrs[k]);
		}
		if (text) el.textContent = text;
		return el;
	}

	// Show a transient, unobtrusive error toast to users
	function showToast(message) {
		try {
			var container = document.getElementById('app-toast-container');
			if (!container) {
				container = createEl('div', { id: 'app-toast-container' });
				container.style.position = 'fixed';
				container.style.right = '16px';
				container.style.bottom = '16px';
				container.style.zIndex = '9999';
				document.body.appendChild(container);
			}

			var toast = createEl('div', { 'class': 'app-toast' }, message);
			toast.style.background = 'rgba(0,0,0,0.75)';
			toast.style.color = '#fff';
			toast.style.padding = '10px 14px';
			toast.style.borderRadius = '6px';
			toast.style.marginTop = '8px';
			toast.style.fontSize = '13px';
			toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

			container.appendChild(toast);

			// Auto-remove after 5s
			setTimeout(function () {
				try { container.removeChild(toast); } catch (e) { /* ignore */ }
			}, 5000);
		} catch (e) {
			// If even the toast fails, silently ignore to avoid cascading errors
			console.warn('Failed to show toast', e);
		}
	}

	// Add Back button when it makes sense
	function addBackButton() {
		try {
			// Determine if we can go back. history.length > 1 is a heuristic; referrer is a useful fallback.
			var canGoBack = window.history && window.history.length > 1;
			var hasReferrer = document.referrer && document.referrer.length > 0;

			if (!canGoBack && !hasReferrer) return; // nothing to do

			// Create button
			var btn = createEl('button', { type: 'button', id: 'site-back-button', title: 'Go back' }, '← Back');
			btn.style.cursor = 'pointer';
			btn.style.padding = '8px 10px';
			// we'll use flex spacing to push the button to the right when placed in the header
			btn.style.marginRight = '0';
			btn.style.border = '1px solid #ccc';
			btn.style.background = '#fff';
			btn.style.borderRadius = '6px';
			btn.style.fontSize = '14px';
			btn.style.display = 'inline-flex';
			btn.style.alignItems = 'center';

			btn.addEventListener('click', function (e) {
				e.preventDefault();
				try {
					if (window.history && window.history.length > 1) {
						window.history.back();
					} else if (document.referrer) {
						// Only navigate to referrer if same origin to avoid cross-site surprises
						var ref = document.referrer;
						var sameOrigin = false;
						try { sameOrigin = (new URL(ref)).origin === window.location.origin; } catch (err) { sameOrigin = false; }
						if (sameOrigin) window.location.href = ref;
						else window.location.href = '/';
					} else {
						window.location.href = '/';
					}
				} catch (err) {
					console.error('Back navigation failed', err);
					showToast('Unable to go back.');
				}
			});

			// Try to insert into header first, then nav, then body top-left as fallback
			var inserted = false;
			var header = document.querySelector('header');
			if (header) {
				// Append to header and use margin-left:auto so the button sits on the right side
				try {
					// ensure header is a flex container (most pages already set this)
					var headerStyle = window.getComputedStyle(header);
					if (headerStyle.display !== 'flex') {
						header.style.display = header.style.display || 'flex';
						header.style.alignItems = header.style.alignItems || 'center';
					}

					btn.style.marginLeft = 'auto';
					header.appendChild(btn);
					inserted = true;
				} catch (e) {
					// fallback to previous behavior if append fails
					var firstH1 = header.querySelector('h1');
					if (firstH1) header.insertBefore(btn, firstH1);
					else header.insertBefore(btn, header.firstChild);
					inserted = true;
				}
			}

			if (!inserted) {
				var nav = document.querySelector('nav');
				if (nav) {
					nav.parentNode.insertBefore(btn, nav);
					inserted = true;
				}
			}

			if (!inserted) {
				// fallback: fixed positioned button
				btn.style.position = 'fixed';
				btn.style.left = '12px';
				btn.style.top = '12px';
				btn.style.zIndex = '10000';
				document.body.appendChild(btn);
			}
		} catch (err) {
			console.error('Failed to add back button', err);
		}
	}

	// Install global error handlers
	function installErrorHandlers() {
		try {
			window.addEventListener('error', function (evt) {
				try {
					console.error('Global error:', evt.message || evt.error || evt);
					// Show a minimal message to the user without exposing internals
					showToast('An unexpected error occurred.');
				} catch (e) { /* ignore */ }
			});

			window.addEventListener('unhandledrejection', function (evt) {
				try {
					console.error('Unhandled promise rejection:', evt.reason);
					showToast('An internal error occurred.');
				} catch (e) { /* ignore */ }
			});
		} catch (err) {
			console.warn('Could not install global error handlers', err);
		}
	}

	// Boot
	function init() {
		try {
			installErrorHandlers();
			addBackButton();
		} catch (err) {
			console.error('layout.js initialization failed', err);
		}
	}

	// Run when DOM ready (but also attempt to run sooner if already ready)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		setTimeout(init, 0);
	}

})();

