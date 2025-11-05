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
    });
})();