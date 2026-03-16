/* ============================================
   Clean Technology — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Header scroll effect ---
    const header = document.querySelector('.site-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // --- Mobile nav toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

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
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            const step = (timestamp) => {
                const progress = Math.min((timestamp - start) / duration, 1);
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
        '.insight-card, .expertise-card, .research-item, .theme-card, .coverage-item, .methodology-item, .value-block, .snapshot-card, .sector-data-block, .contact-detail'
    );

    if (fadeTargets.length > 0) {
        fadeTargets.forEach((el, i) => {
            el.classList.add('fade-in');
            // Stagger siblings within the same parent
            const siblings = Array.from(el.parentElement.children).filter(c => fadeTargets.length > 0);
            const index = siblings.indexOf(el);
            if (index > 0 && index < 4) {
                el.classList.add(`fade-in-delay-${index}`);
            }
        });

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        fadeTargets.forEach(el => fadeObserver.observe(el));
    }

    // --- Research filter tabs ---
    const filterTabs = document.querySelectorAll('.filter-tab');
    const researchItems = document.querySelectorAll('[data-category]');

    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.dataset.filter;

                researchItems.forEach(item => {
                    if (filter === 'all' || item.dataset.category === filter) {
                        item.style.display = '';
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

    // --- SVG chart line draw animation ---
    const chartPaths = document.querySelectorAll('.hero-chart path[fill="none"]');
    chartPaths.forEach(chartPath => {
        try {
            const length = chartPath.getTotalLength();
            chartPath.style.strokeDasharray = length;
            chartPath.style.strokeDashoffset = length;

            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        chartPath.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
                        chartPath.style.strokeDashoffset = '0';
                        chartObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            chartObserver.observe(chartPath.closest('svg'));
        } catch (e) {
            // SVG not yet rendered, skip animation
        }
    });

    // --- Smooth anchor scrolling for sector links ---
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const hash = this.getAttribute('href');
            if (hash.startsWith('#') || hash.includes('.html#')) {
                const targetId = hash.split('#')[1];
                if (targetId && document.getElementById(targetId)) {
                    e.preventDefault();
                    const target = document.getElementById(targetId);
                    const offset = document.querySelector('.site-header').offsetHeight + 20;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }
            }
        });
    });

});
