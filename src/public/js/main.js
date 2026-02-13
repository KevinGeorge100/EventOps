// ═══════════════════════════════════════════════════════
// EventOps — Interactive UI Engine
// MakeMyPass-Inspired Interactions
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initTypingEffect();
    initCounterAnimation();
    initScrollReveal();
    initCursorGlow();
    initCardTilt();
    initAlertDismiss();
    initAdminSearch();
    initLoginParticles();
    initSmoothScroll();
});


// ─── Navbar Scroll Effect ───────────────────────────────
function initNavScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const onScroll = () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}


// ─── Typing Effect ──────────────────────────────────────
function initTypingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const words = ['create', 'manage', 'launch', 'scale', 'promote'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            delay = 2000; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 400;
        }

        timeout = setTimeout(type, delay);
    }

    type();
}


// ─── Counter Animation ─────────────────────────────────
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (counters.length === 0) return;

    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}


// ─── Scroll Reveal ──────────────────────────────────────
function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
}


// ─── Cursor Glow Effect ─────────────────────────────────
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    const hero = document.querySelector('.hero');
    if (!glow || !hero) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
        glow.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
}


// ─── Card Tilt Effect ───────────────────────────────────
function initCardTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -6;
            const rotateY = (x - centerX) / centerX * 6;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}


// ─── Alert Auto-Dismiss ─────────────────────────────────
function initAlertDismiss() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 400);
        }, 5000);
    });
}


// ─── Admin Search/Filter + Tabs ─────────────────────────
function initAdminSearch() {
    const input = document.getElementById('admin-search');
    const list = document.getElementById('admin-events-list');
    const tabsContainer = document.getElementById('dash-tabs');
    const formPanel = document.getElementById('form-panel');
    const overlay = document.getElementById('form-panel-overlay');

    if (!list) return;

    let activeFilter = 'all';

    // Apply combined search + tab filter
    function applyFilters() {
        const query = input ? input.value.toLowerCase().trim() : '';
        const cards = list.querySelectorAll('.dash-card');

        cards.forEach(card => {
            const title = card.dataset.title || '';
            const category = card.dataset.category || '';
            const status = card.dataset.status || '';

            const matchesSearch = !query || title.includes(query) || category.includes(query);
            const matchesTab = activeFilter === 'all' || status === activeFilter;

            card.style.display = (matchesSearch && matchesTab) ? '' : 'none';
        });
    }

    // Search input
    if (input) {
        input.addEventListener('input', applyFilters);
    }

    // Tab clicks
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            const tab = e.target.closest('.dash-tab');
            if (!tab) return;

            tabsContainer.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applyFilters();
        });
    }

    // Stat card clicks -> Trigger tab clicks
    const statCards = document.querySelectorAll('.dash-stat-card');
    if (statCards.length >= 3 && tabsContainer) {
        // Total Events -> All
        statCards[0].style.cursor = 'pointer';
        statCards[0].addEventListener('click', () => {
            const tab = tabsContainer.querySelector('[data-filter="all"]');
            if (tab) tab.click();
        });

        // Upcoming -> Upcoming
        statCards[1].style.cursor = 'pointer';
        statCards[1].addEventListener('click', () => {
            const tab = tabsContainer.querySelector('[data-filter="upcoming"]');
            if (tab) tab.click();
        });

        // Completed -> Past
        statCards[2].style.cursor = 'pointer';
        statCards[2].addEventListener('click', () => {
            const tab = tabsContainer.querySelector('[data-filter="past"]');
            if (tab) tab.click();
        });
    }

    // Initial filter application
    applyFilters();

    // Form panel overlay close
    if (overlay && formPanel) {
        overlay.addEventListener('click', () => {
            formPanel.classList.remove('open');
        });
    }

    // Close panel on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && formPanel && formPanel.classList.contains('open')) {
            formPanel.classList.remove('open');
        }
    });
}


// ─── Login Particles ────────────────────────────────────
function initLoginParticles() {
    const container = document.getElementById('login-particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'login-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}


// ─── Smooth Scroll for Anchor Links ─────────────────────
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}
