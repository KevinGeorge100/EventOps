// ─── Public Routes ───────────────────────────────────────
// Renders the main public-facing event landing page
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel');

/**
 * GET / — Public landing page
 * Renders the main website with all event data
 */
router.get('/', (req, res) => {
    const events = eventModel.getAllEvents();

    // Separate upcoming and past events
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingEvents = events.filter(e => new Date(e.date) >= now);
    const pastEvents = events.filter(e => new Date(e.date) < now);

    res.render('index', {
        title: 'EventOps — Curated Experiences',
        upcomingEvents,
        pastEvents,
        totalEvents: events.length
    });
});

module.exports = router;
