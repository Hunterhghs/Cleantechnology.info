/* ============================================
   Clean Technology — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.querySelector('.site-header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // --- Animated counter for metrics ---
    const metricValues = document.querySelectorAll('.metric-value[data-target]');

    if (metricValues.length > 0) {
        const animateCounter = (el) => {
            const target = parseFloat(el.dataset.target);
            const duration = 1800;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            const step = (timestamp) => {
                const progress = Math.min((timestamp - start) / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;

                el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        };

        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        metricValues.forEach(el => metricsObserver.observe(el));
    }

    // --- Fade-in on scroll ---
    const fadeTargets = document.querySelectorAll(
        '.insight-card, .expertise-card, .research-item, .theme-card, .coverage-item, .methodology-item, .value-block, .snapshot-card, .sector-data-block'
    );

    if (fadeTargets.length > 0) {
        fadeTargets.forEach(el => el.classList.add('fade-in'));

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeTargets.forEach(el => fadeObserver.observe(el));
    }

    // --- Research filter tabs ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const researchItems = document.querySelectorAll('[data-category]');

    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                researchItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = '';
                        // Re-trigger fade animation
                        item.classList.remove('visible');
                        requestAnimationFrame(() => {
                            item.classList.add('visible');
                        });
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- SVG chart animation ---
    const chartPath = document.querySelector('.hero-chart path:nth-of-type(2)');
    if (chartPath) {
        const length = chartPath.getTotalLength();
        chartPath.style.strokeDasharray = length;
        chartPath.style.strokeDashoffset = length;

        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    chartPath.style.transition = 'stroke-dashoffset 1.5s ease-out';
                    chartPath.style.strokeDashoffset = '0';
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        chartObserver.observe(chartPath.closest('svg'));
    }

});
