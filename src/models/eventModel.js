// ─── Event Data Model ────────────────────────────────────
// JSON-based data persistence for event management
// ─────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'events.json');

// Available categories for events
const CATEGORIES = ['Conference', 'Workshop', 'Meetup', 'Webinar', 'Hackathon', 'Expo', 'Bootcamp', 'Show'];

/**
 * Read all events from the JSON file
 * @returns {Array} Array of event objects
 */
function getAllEvents() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        const events = JSON.parse(data);
        // Sort by date ascending (nearest events first)
        return events.sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (err) {
        console.error('Error reading events:', err.message);
        return [];
    }
}

/**
 * Get a single event by ID
 * @param {string} id - Event ID
 * @returns {Object|null} Event object or null
 */
function getEventById(id) {
    const events = getAllEvents();
    return events.find(event => event.id === id) || null;
}

/**
 * Get events filtered by category
 * @param {string} category
 * @returns {Array}
 */
function getEventsByCategory(category) {
    const events = getAllEvents();
    return events.filter(e => e.category === category);
}

/**
 * Get aggregate stats about events
 * @returns {Object} Stats object
 */
function getEventStats() {
    const events = getAllEvents();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events.filter(e => new Date(e.date) >= now);
    const past = events.filter(e => new Date(e.date) < now);
    const categories = [...new Set(events.map(e => e.category).filter(Boolean))];
    const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);

    return {
        total: events.length,
        upcoming: upcoming.length,
        past: past.length,
        categories: categories.length,
        totalCapacity
    };
}

/**
 * Create a new event
 * @param {Object} eventData - { title, date, description, location, capacity, category, image }
 * @returns {Object} The newly created event
 */
function createEvent(eventData) {
    const events = getAllEvents();
    const newEvent = {
        id: `evt-${uuidv4().slice(0, 8)}`,
        title: eventData.title.trim(),
        date: eventData.date,
        endDate: eventData.endDate || '',
        time: (eventData.time || '').trim(),
        description: eventData.description.trim(),
        location: (eventData.location || '').trim() || 'TBA',
        capacity: parseInt(eventData.capacity) || 100,
        category: eventData.category || 'Conference',
        image: eventData.image || '🎪',
        organizer: (eventData.organizer || '').trim() || 'EventOps',
        highlights: (eventData.highlights || '').trim(),
        tags: (eventData.tags || '').trim(),
        ticketPrice: (eventData.ticketPrice || '').trim() || 'Free',
        registrationUrl: (eventData.registrationUrl || '').trim(),
        published: eventData.published === 'on' || eventData.published === true,
        banner: eventData.banner || '',
        status: 'active',
        createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    saveEvents(events);
    return newEvent;
}

/**
 * Update an existing event
 * @param {string} id - Event ID
 * @param {Object} eventData - Updated fields
 * @returns {Object|null} Updated event or null if not found
 */
function updateEvent(id, eventData) {
    const events = getAllEvents();
    const index = events.findIndex(event => event.id === id);
    if (index === -1) return null;

    events[index] = {
        ...events[index],
        title: eventData.title.trim(),
        date: eventData.date,
        endDate: eventData.endDate || events[index].endDate || '',
        time: (eventData.time || '').trim(),
        description: eventData.description.trim(),
        location: (eventData.location || '').trim() || events[index].location,
        capacity: parseInt(eventData.capacity) || events[index].capacity,
        category: eventData.category || events[index].category,
        image: eventData.image || events[index].image,
        organizer: (eventData.organizer || '').trim() || events[index].organizer || 'EventOps',
        highlights: (eventData.highlights || '').trim(),
        tags: (eventData.tags || '').trim(),
        ticketPrice: (eventData.ticketPrice || '').trim() || events[index].ticketPrice || 'Free',
        registrationUrl: (eventData.registrationUrl || '').trim(),
        published: eventData.published === 'on' || eventData.published === true,
        banner: eventData.banner !== undefined ? eventData.banner : (events[index].banner || ''),
        updatedAt: new Date().toISOString()
    };
    saveEvents(events);
    return events[index];
}

/**
 * Delete an event by ID
 * @param {string} id - Event ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteEvent(id) {
    const events = getAllEvents();
    const filtered = events.filter(event => event.id !== id);
    if (filtered.length === events.length) return false;
    saveEvents(filtered);
    return true;
}

/**
 * Save events array to JSON file
 * @param {Array} events - Array of event objects
 */
function saveEvents(events) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

module.exports = {
    getAllEvents,
    getEventById,
    getEventsByCategory,
    getEventStats,
    createEvent,
    updateEvent,
    deleteEvent,
    CATEGORIES
};
