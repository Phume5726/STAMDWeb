// Injects SEO meta tags, OG/Twitter tags, canonical, JSON-LD and a simple breadcrumb/back-link
(function () {
    const siteName = 'Empowering the Nation';
    const siteUrl = (location.origin + location.pathname).replace(/\/[^/]+$/, '/');
    const logoPath = location.origin + '/images/IMG_7186.jpg';

    const pageMeta = {
        'home.html': {
            title: 'Home - Empowering the Nation',
            description: 'Empowering the Nation — free and low-cost skills training to help communities Skill 2 Earn. Browse courses and register today.',
            keywords: 'skills training, empowerment, courses, Johannesburg, vocational'
        },
        'courses.html': {
            title: 'Courses - Empowering the Nation',
            description: 'Explore our hands-on courses: First Aid, Sewing, Landscaping, Life Skills and more. Practical training for real jobs.',
            keywords: 'first aid, sewing, landscaping, life skills, vocational courses'
        },
        'fees.html': {
            title: 'Fees - Empowering the Nation',
            description: 'Course fee overview and payment options. Find discounts and flexible payment plans for our short and long courses.',
            keywords: 'course fees, payment options, discounts, vocational fees'
        },
        'contact.html': {
            title: 'Contact - Empowering the Nation',
            description: 'Get in touch with Empowering the Nation — contact details, office hours and how to register for courses.',
            keywords: 'contact, office hours, support, register'
        }
    };

    function getPageKey() {
        const p = location.pathname.split('/').pop();
        return p || 'home.html';
    }

    function createOrUpdateMeta(attr, name, content) {
        let selector = attr === 'name' ? `meta[name="${name}"]` : `meta[property="${name}"]`;
        let el = document.head.querySelector(selector);
        if (!el) {
            el = document.createElement('meta');
            if (attr === 'name') el.setAttribute('name', name);
            else el.setAttribute('property', name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    function ensureLinkRel(rel, href) {
        let el = document.head.querySelector(`link[rel="${rel}"]`);
        if (!el) {
            el = document.createElement('link');
            el.setAttribute('rel', rel);
            document.head.appendChild(el);
        }
        el.setAttribute('href', href);
    }

    function addJsonLd(json) {
        let el = document.head.querySelector('script[type="application/ld+json"]');
        if (!el) {
            el = document.createElement('script');
            el.type = 'application/ld+json';
            document.head.appendChild(el);
        }
        el.text = JSON.stringify(json, null, 2);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const key = getPageKey();
        const meta = pageMeta[key] || {
            title: document.title || siteName,
            description: '',
            keywords: ''
        };

        // Title
        if (meta.title) document.title = meta.title;

        // Standard meta
        if (meta.description) createOrUpdateMeta('name', 'description', meta.description);
        if (meta.keywords) createOrUpdateMeta('name', 'keywords', meta.keywords);
        createOrUpdateMeta('name', 'author', siteName);
        createOrUpdateMeta('name', 'viewport', 'width=device-width, initial-scale=1');

        // Robots
        if (!document.head.querySelector('meta[name="robots"]')) {
            createOrUpdateMeta('name', 'robots', 'index, follow');
        }

        // Canonical
        ensureLinkRel('canonical', location.href);

        // Open Graph
        createOrUpdateMeta('property', 'og:site_name', siteName);
        createOrUpdateMeta('property', 'og:title', meta.title || document.title);
        createOrUpdateMeta('property', 'og:description', meta.description || '');
        createOrUpdateMeta('property', 'og:type', 'website');
        createOrUpdateMeta('property', 'og:url', location.href);
        createOrUpdateMeta('property', 'og:image', logoPath);

        // Twitter Card
        createOrUpdateMeta('name', 'twitter:card', 'summary_large_image');
        createOrUpdateMeta('name', 'twitter:title', meta.title || document.title);
        createOrUpdateMeta('name', 'twitter:description', meta.description || '');
        createOrUpdateMeta('name', 'twitter:image', logoPath);

        // Prev/Next (basic internal navigation hints) — optional mapping
        const navOrder = ['home.html', 'courses.html', 'fees.html', 'contact.html'];
        const idx = navOrder.indexOf(key);
        if (idx > -1) {
            if (idx > 0) ensureLinkRel('prev', navOrder[idx - 1]);
            if (idx < navOrder.length - 1) ensureLinkRel('next', navOrder[idx + 1]);
        }

        // JSON-LD Organization + WebSite + BreadcrumbList
        const jsonLd = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Organization",
                    "@id": location.origin + "/#org",
                    "name": siteName,
                    "url": location.origin + "/",
                    "logo": logoPath,
                    "sameAs": []
                },
                {
                    "@type": "WebSite",
                    "url": location.origin + "/",
                    "name": siteName,
                    "publisher": { "@id": location.origin + "/#org" }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": navOrder.map((p, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "name": p.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                        "item": location.origin + '/' + p
                    }))
                }
            ]
        };
        addJsonLd(jsonLd);

        // Insert a simple breadcrumb/back-link under header for easy navigation
        const header = document.querySelector('header');
        if (header && !document.querySelector('.page-breadcrumb')) {
            const crumb = document.createElement('nav');
            crumb.className = 'page-breadcrumb';
            crumb.setAttribute('aria-label', 'Breadcrumb');
            const homeLink = document.createElement('a');
            homeLink.href = 'home.html';
            homeLink.textContent = 'Home';
            const sep = document.createElement('span');
            sep.textContent = ' \u203A ';
            const cur = document.createElement('span');
            cur.textContent = (meta.title || document.title).replace(' - ' + siteName, '');
            crumb.appendChild(homeLink);
            crumb.appendChild(sep);
            crumb.appendChild(cur);
            // Style as a back button in top right
            crumb.style.fontSize = '14px';
            crumb.style.position = 'absolute';
            crumb.style.right = '16px';
            crumb.style.top = '50%';
            crumb.style.transform = 'translateY(-50%)';
            crumb.style.display = 'inline-flex';
            crumb.style.alignItems = 'center';
            crumb.style.padding = '8px 12px';
            crumb.style.background = '#fff';
            crumb.style.border = '1px solid #ccc';
            crumb.style.borderRadius = '6px';
            crumb.style.textDecoration = 'none';
            crumb.style.color = '#333';
            crumb.style.gap = '8px';
            crumb.style.zIndex = '100';

            // Make header position relative for absolute positioning of crumb
            if (window.getComputedStyle(header).position === 'static') {
                header.style.position = 'relative';
            }

            // Modify the breadcrumb to be a simpler back navigation
            crumb.innerHTML = '';
            const backLink = document.createElement('a');
            backLink.href = document.referrer || 'home.html';
            backLink.textContent = '← Back';
            backLink.style.textDecoration = 'none';
            backLink.style.color = 'inherit';
            crumb.appendChild(backLink);

            // Add hover effect
            crumb.addEventListener('mouseenter', () => {
                crumb.style.background = '#f0f0f0';
                crumb.style.borderColor = '#999';
            });
            crumb.addEventListener('mouseleave', () => {
                crumb.style.background = '#fff';
                crumb.style.borderColor = '#ccc';
            });

            header.appendChild(crumb);
        }

        // Inject footer social links (WhatsApp, Instagram, Email)
        (function injectFooterSocial() {
            const footer = document.querySelector('footer');
            if (!footer) return;

            let social = footer.querySelector('.social-links');
            if (!social) {
                social = document.createElement('div');
                social.className = 'social-links';
                social.setAttribute('aria-label', 'Follow us on social media');
                footer.appendChild(social);
            }

            // Clear existing content to avoid duplicates when the script runs multiple times
            social.innerHTML = '';

            const icons = [
                {
                    href: 'https://wa.me/27123456789',
                    label: 'Chat with us on WhatsApp',
                    svg: `
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .02 5.373.02 12c0 2.116.56 4.14 1.62 5.93L0 24l6.29-1.66A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.21-1.25-6.22-3.48-8.52z" fill="#25D366"/>
                            <path d="M17.24 14.08c-.29-.14-1.72-.85-1.99-.95-.27-.1-.47-.14-.67.14-.2.29-.77.95-.95 1.15-.18.2-.36.22-.66.07-.3-.14-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.29-.02-.45.13-.59.13-.13.29-.36.43-.54.14-.18.18-.3.3-.5.12-.2.04-.37-.02-.51-.06-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.9 1.23 3.1c.14.2 2.12 3.25 5.13 4.55 3.01 1.3 3.01.87 3.56.82.55-.05 1.78-.72 2.03-1.41.25-.69.25-1.28.18-1.41-.06-.13-.23-.2-.52-.34z" fill="#fff"/>
                        </svg>
                    `
                },
                {
                    href: 'https://instagram.com/yourpage',
                    label: 'Visit our Instagram',
                    svg: `
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="#E4405F"/>
                            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="#fff"/>
                            <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
                        </svg>
                    `
                },
                {
                    href: 'mailto:info@empowerthenation.org',
                    label: 'Send us an email',
                    svg: `
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" fill="#fff" stroke="#333" stroke-width="0.8"/>
                            <path d="M3 6l9 7 9-7" stroke="#333" stroke-width="0.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `
                }
            ];

            icons.forEach(info => {
                const a = document.createElement('a');
                a.href = info.href;
                if (!info.href.startsWith('mailto:')) {
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
                a.setAttribute('aria-label', info.label);
                a.innerHTML = info.svg;
                social.appendChild(a);
            });
        })();
    });
})();