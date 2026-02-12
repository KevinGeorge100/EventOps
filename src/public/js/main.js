// ─── EventOps Client-Side JavaScript ─────────────────────
// Handles animations, interactions, and UI enhancements
// ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // ─── Scroll-triggered animations ───────────────────────
    initScrollAnimations();

    // ─── Auto-dismiss alerts ───────────────────────────────
    initAlertDismiss();

    // ─── Smooth scroll for anchor links ────────────────────
    initSmoothScroll();
});

/**
 * Intersection Observer for scroll-triggered card animations
 */
function initScrollAnimations() {
    const cards = document.querySelectorAll('.event-card');
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
    });
}

/**
 * Auto-dismiss success/error alerts after 5 seconds
 */
function initAlertDismiss() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach((alert) => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            alert.style.transition = 'all 0.4s ease-out';
            setTimeout(() => alert.remove(), 400);
        }, 5000);
    });
}

/**
 * Smooth scroll for in-page anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
