// Layout helpers: inject a small accessible dropdown menu into each page's nav
// The script adds a "Features" dropdown to the right side of <nav> with useful links.

(function () {
	function createDropdown() {
		const navs = document.querySelectorAll('nav');
		if (!navs || navs.length === 0) return;

		navs.forEach(nav => {
			// make sure nav is positioned correctly for absolute dropdown
			if (getComputedStyle(nav).position === 'static') nav.style.position = 'relative';

			const wrapper = document.createElement('div');
			wrapper.className = 'nav-dropdown';

			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'nav-drop-btn';
			button.setAttribute('aria-haspopup', 'true');
			button.setAttribute('aria-expanded', 'false');
			button.textContent = 'Features ▾';

			const list = document.createElement('ul');
			list.className = 'nav-drop-list';
			list.setAttribute('role', 'menu');
			list.hidden = true;

			const items = [
				{ href: 'home.html', label: 'Home' },
				{ href: 'courses.html', label: 'Courses' },
				{ href: 'fees.html', label: 'Fees & Enrollment' },
				{ href: 'contact.html', label: 'Contact' },
				{ href: 'contact.html#enroll', label: 'Quick Enrol' }
			];

			items.forEach(i => {
				const li = document.createElement('li');
				li.setAttribute('role', 'none');
				const a = document.createElement('a');
				a.setAttribute('role', 'menuitem');
				a.href = i.href;
				a.textContent = i.label;
				a.tabIndex = -1; // will be set when menu opens
				li.appendChild(a);
				list.appendChild(li);
			});

			// append button and list to wrapper
			wrapper.appendChild(button);
			wrapper.appendChild(list);

			// insert wrapper at end of nav (right side)
			nav.appendChild(wrapper);

			// event handlers
			button.addEventListener('click', (e) => {
				const isOpen = !list.hidden;
				toggleMenu(!isOpen, button, list);
			});

			// keyboard support
			button.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggleMenu(true, button, list);
					focusFirstMenuItem(list);
				}
			});

			list.addEventListener('keydown', (e) => {
				const focusable = Array.from(list.querySelectorAll('a'));
				const idx = focusable.indexOf(document.activeElement);
				if (e.key === 'ArrowDown') {
					e.preventDefault();
					const next = focusable[(idx + 1) % focusable.length];
					next.focus();
				} else if (e.key === 'ArrowUp') {
					e.preventDefault();
					const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
					prev.focus();
				} else if (e.key === 'Escape') {
					toggleMenu(false, button, list);
					button.focus();
				}
			});

			// close when clicking outside
			document.addEventListener('click', (ev) => {
				if (!wrapper.contains(ev.target)) {
					toggleMenu(false, button, list);
				}
			});

			// close on focusout when focus moves outside
			wrapper.addEventListener('focusout', (ev) => {
				const related = ev.relatedTarget;
				if (!wrapper.contains(related)) {
					toggleMenu(false, button, list);
				}
			});
		});
	}

	function toggleMenu(show, button, list) {
		if (show) {
			list.hidden = false;
			button.setAttribute('aria-expanded', 'true');
			list.querySelectorAll('a').forEach(a => a.tabIndex = 0);
			list.classList.add('show');
		} else {
			list.hidden = true;
			button.setAttribute('aria-expanded', 'false');
			list.querySelectorAll('a').forEach(a => a.tabIndex = -1);
			list.classList.remove('show');
		}
	}

	function focusFirstMenuItem(list) {
		const first = list.querySelector('a');
		if (first) first.focus();
	}

	document.addEventListener('DOMContentLoaded', () => {
		try {
			createDropdown();
		} catch (err) {
			// Fail silently to avoid breaking pages
			console.error('Layout dropdown failed to initialize', err);
		}
	});
})();

