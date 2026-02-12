// ─── Event Data Model ────────────────────────────────────
// JSON-based data persistence for event management
// ─────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '..', '..', 'data', 'events.json');

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
        // If file doesn't exist or is corrupted, return empty array
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
 * Create a new event
 * @param {Object} eventData - { title, date, description }
 * @returns {Object} The newly created event
 */
function createEvent(eventData) {
    const events = getAllEvents();
    const newEvent = {
        id: `evt-${uuidv4().slice(0, 8)}`,
        title: eventData.title.trim(),
        date: eventData.date,
        description: eventData.description.trim(),
        createdAt: new Date().toISOString()
    };
    events.push(newEvent);
    saveEvents(events);
    return newEvent;
}

/**
 * Update an existing event
 * @param {string} id - Event ID
 * @param {Object} eventData - Updated fields { title, date, description }
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
        description: eventData.description.trim(),
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
    createEvent,
    updateEvent,
    deleteEvent
};
