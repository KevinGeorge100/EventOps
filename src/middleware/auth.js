// ─── Auth Middleware ──────────────────────────────────────
// Protects admin routes with session-based authentication
// ─────────────────────────────────────────────────────────

/**
 * Middleware to check if user is authenticated
 * Redirects to admin login page if not authenticated
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.isAuthenticated) {
        return next();
    }
    // Store the originally requested URL to redirect after login
    req.session.returnTo = req.originalUrl;
    res.redirect('/admin/login');
}

module.exports = { requireAuth };
