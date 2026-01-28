// LocalStorage wrapper for Qurtas data persistence

class Storage {
    constructor() {
        this.BOOKS_KEY = 'qurtas_books';
        this.SESSIONS_KEY = 'qurtas_sessions';
        this.GOALS_KEY = 'qurtas_goals';
        this.SETTINGS_KEY = 'qurtas_settings';
    }

    // ==================== Books ====================

    getBooks() {
        const books = localStorage.getItem(this.BOOKS_KEY);
        return books ? JSON.parse(books) : [];
    }

    addBook(book) {
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
        return book;
    }

    updateBook(id, updates) {
        const books = this.getBooks();
        const index = books.findIndex(b => b.id === id);
        if (index !== -1) {
            books[index] = { ...books[index], ...updates };
            localStorage.setItem(this.BOOKS_KEY, JSON.stringify(books));
            return books[index];
        }
        return null;
    }

    deleteBook(id) {
        const books = this.getBooks();
        const filtered = books.filter(b => b.id !== id);
        localStorage.setItem(this.BOOKS_KEY, JSON.stringify(filtered));

        // Also delete associated sessions
        const sessions = this.getSessions();
        const filteredSessions = sessions.filter(s => s.bookId !== id);
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filteredSessions));

        return true;
    }

    getBookById(id) {
        const books = this.getBooks();
        return books.find(b => b.id === id) || null;
    }

    // ==================== Sessions ====================

    getSessions(bookId = null) {
        const sessions = localStorage.getItem(this.SESSIONS_KEY);
        const allSessions = sessions ? JSON.parse(sessions) : [];

        if (bookId) {
            return allSessions.filter(s => s.bookId === bookId);
        }
        return allSessions;
    }

    addSession(session) {
        const sessions = this.getSessions();
        sessions.push(session);
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
        return session;
    }

    updateSession(id, updates) {
        const sessions = this.getSessions();
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
            sessions[index] = { ...sessions[index], ...updates };
            localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
            return sessions[index];
        }
        return null;
    }

    deleteSession(id) {
        const sessions = this.getSessions();
        const filtered = sessions.filter(s => s.id !== id);
        localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filtered));
        return true;
    }

    getSessionById(id) {
        const sessions = this.getSessions();
        return sessions.find(s => s.id === id) || null;
    }

    // Get active (unfinished) session for a book
    getActiveSession(bookId) {
        const sessions = this.getSessions(bookId);
        return sessions.find(s => !s.endTime) || null;
    }

    // ==================== Weekly Goals ====================

    getGoals() {
        const goals = localStorage.getItem(this.GOALS_KEY);
        return goals ? JSON.parse(goals) : { pagesTarget: 0, sessionsTarget: 0, weekStart: getStartOfWeek().toISOString() };
    }

    setGoals(goals) {
        localStorage.setItem(this.GOALS_KEY, JSON.stringify(goals));
        return goals;
    }

    // ==================== Settings ====================

    getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : {
            theme: 'dark',
            notifications: true,
            defaultSessionDuration: 30, // minutes
        };
    }

    updateSettings(updates) {
        const settings = this.getSettings();
        const newSettings = { ...settings, ...updates };
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(newSettings));
        return newSettings;
    }

    // ==================== Utility ====================

    // Clear all data (for testing or reset)
    clearAll() {
        localStorage.removeItem(this.BOOKS_KEY);
        localStorage.removeItem(this.SESSIONS_KEY);
        localStorage.removeItem(this.GOALS_KEY);
        localStorage.removeItem(this.SETTINGS_KEY);
    }

    // Export data (for backup)
    exportData() {
        return {
            books: this.getBooks(),
            sessions: this.getSessions(),
            goals: this.getGoals(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }

    // Import data (from backup)
    importData(data) {
        if (data.books) localStorage.setItem(this.BOOKS_KEY, JSON.stringify(data.books));
        if (data.sessions) localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(data.sessions));
        if (data.goals) localStorage.setItem(this.GOALS_KEY, JSON.stringify(data.goals));
        if (data.settings) localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
    }

    // Statistics moved to ReadingService
}

// Create global storage instance
const storage = new Storage();
