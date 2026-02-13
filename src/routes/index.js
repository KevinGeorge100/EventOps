// ─── Public Routes ───────────────────────────────────────
// Renders the main public-facing event pages
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel');

/**
 * GET / — Public landing page
 * Renders the main website with all event data, stats, and categories
 */
router.get('/', (req, res) => {
    const events = eventModel.getAllEvents();
    const stats = eventModel.getEventStats();

    // Separate upcoming and past events
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter(e => new Date(e.date) >= now && e.published !== false);
    const pastEvents = events.filter(e => new Date(e.date) < now && e.published !== false);

    res.render('index', {
        title: 'EventOps — Where Events Begin',
        upcomingEvents,
        pastEvents,
        totalEvents: events.length,
        stats,
        categories: eventModel.CATEGORIES
    });
});

/**
 * GET /event/:id — Individual event detail page
 */
router.get('/event/:id', (req, res) => {
    const event = eventModel.getEventById(req.params.id);

    if (!event) {
        return res.status(404).render('404', { title: 'Event Not Found' });
    }

    res.render('event', {
        title: `EventOps — ${event.title}`,
        event
    });
});

module.exports = router;
