// ─── Admin Routes ────────────────────────────────────────
// Protected dashboard for event management (CRUD)
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel');
const { requireAuth } = require('../middleware/auth');

// ─── Login Page ──────────────────────────────────────────

/**
 * GET /admin/login — Render login form
 */
router.get('/login', (req, res) => {
    if (req.session && req.session.isAuthenticated) {
        return res.redirect('/admin');
    }
    res.render('login', {
        title: 'EventOps — Admin Login',
        error: null
    });
});

/**
 * POST /admin/login — Process login credentials
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'eventops2024';

    if (username === adminUser && password === adminPass) {
        req.session.isAuthenticated = true;
        const returnTo = req.session.returnTo || '/admin';
        delete req.session.returnTo;
        return res.redirect(returnTo);
    }

    res.render('login', {
        title: 'EventOps — Admin Login',
        error: 'Invalid username or password'
    });
});

/**
 * GET /admin/logout — Destroy session and redirect
 */
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error('Session destroy error:', err);
        res.redirect('/admin/login');
    });
});

// ─── Dashboard (Protected) ──────────────────────────────

/**
 * GET /admin — Render admin dashboard with all events
 */
router.get('/', requireAuth, (req, res) => {
    const events = eventModel.getAllEvents();
    res.render('admin', {
        title: 'EventOps — Dashboard',
        events,
        editEvent: null,
        success: req.query.success || null,
        error: req.query.error || null
    });
});

/**
 * GET /admin/edit/:id — Render dashboard with event loaded for editing
 */
router.get('/edit/:id', requireAuth, (req, res) => {
    const events = eventModel.getAllEvents();
    const editEvent = eventModel.getEventById(req.params.id);

    if (!editEvent) {
        return res.redirect('/admin?error=Event+not+found');
    }

    res.render('admin', {
        title: 'EventOps — Edit Event',
        events,
        editEvent,
        success: null,
        error: null
    });
});

// ─── CRUD Operations ─────────────────────────────────────

/**
 * POST /admin/event — Create a new event
 */
router.post('/event', requireAuth, (req, res) => {
    const { title, date, description } = req.body;

    // Validation
    if (!title || !date || !description) {
        return res.redirect('/admin?error=All+fields+are+required');
    }

    try {
        eventModel.createEvent({ title, date, description });
        res.redirect('/admin?success=Event+created+successfully');
    } catch (err) {
        console.error('Create event error:', err);
        res.redirect('/admin?error=Failed+to+create+event');
    }
});

/**
 * POST /admin/event/:id — Update an existing event
 */
router.post('/event/:id', requireAuth, (req, res) => {
    const { title, date, description } = req.body;

    if (!title || !date || !description) {
        return res.redirect(`/admin/edit/${req.params.id}?error=All+fields+are+required`);
    }

    try {
        const updated = eventModel.updateEvent(req.params.id, { title, date, description });
        if (!updated) {
            return res.redirect('/admin?error=Event+not+found');
        }
        res.redirect('/admin?success=Event+updated+successfully');
    } catch (err) {
        console.error('Update event error:', err);
        res.redirect('/admin?error=Failed+to+update+event');
    }
});

/**
 * POST /admin/event/:id/delete — Delete an event
 */
router.post('/event/:id/delete', requireAuth, (req, res) => {
    try {
        const deleted = eventModel.deleteEvent(req.params.id);
        if (!deleted) {
            return res.redirect('/admin?error=Event+not+found');
        }
        res.redirect('/admin?success=Event+deleted+successfully');
    } catch (err) {
        console.error('Delete event error:', err);
        res.redirect('/admin?error=Failed+to+delete+event');
    }
});

module.exports = router;
