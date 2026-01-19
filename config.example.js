// Configuration file for Qurtas
// Copy this file to config.js and add your actual API key
// config.js is gitignored for security

const CONFIG = {
    // Google Books API Key
    // Get your key from: https://console.cloud.google.com/apis/credentials
    GOOGLE_BOOKS_API_KEY: 'YOUR_API_KEY_HERE',

    // API Endpoints
    GOOGLE_BOOKS_API_URL: 'https://www.googleapis.com/books/v1/volumes',
    OPENLIBRARY_API_URL: 'https://openlibrary.org',

    // App Settings
    MAX_SEARCH_RESULTS: 20,
    SESSION_AUTO_SAVE_INTERVAL: 30000, // 30 seconds
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
