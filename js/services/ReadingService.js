// Service for orchestrating reading workflows

class ReadingService {
    constructor(bookRepo, sessionRepo, validationSvc) {
        this.bookRepo = bookRepo;
        this.sessionRepo = sessionRepo;
        this.validationSvc = validationSvc;
    }

    /**
     * Start a new reading session for a book
     * @param {string} bookId 
     * @returns {Session}
     */
    startSession(bookId) {
        const book = this.bookRepo.getById(bookId);
        if (!book) throw new Error('Book not found');

        // Check for existing active session
        const activeSession = this.sessionRepo.getActive(bookId);
        if (activeSession) return activeSession;

        const session = new Session({
            bookId: book.id,
            startPage: book.currentPage
        });

        const validation = this.validationSvc.validateSession(session, book);
        if (!validation.isValid) {
            throw new Error(`Invalid session: ${validation.errors.join(', ')}`);
        }

        return this.sessionRepo.save(session);
    }

    /**
     * Complete an active reading session
     * @param {string} sessionId 
     * @param {number} endPage 
     * @param {Object} notes 
     * @returns {Session}
     */
    completeSession(sessionId, endPage, notes) {
        const session = this.sessionRepo.getById(sessionId);
        if (!session) throw new Error('Session not found');

        const book = this.bookRepo.getById(session.bookId);
        if (!book) throw new Error('Book not found');

        // Update session
        session.endSession(endPage, notes);

        // Validate
        const validation = this.validationSvc.validateSession(session, book);
        if (!validation.isValid) {
            throw new Error(`Invalid session completion: ${validation.errors.join(', ')}`);
        }

        // Persist session
        this.sessionRepo.save(session);

        // Update book progress
        book.updateProgress(endPage);
        this.bookRepo.save(book);

        return session;
    }

    /**
     * Get statistics for a book
     * @param {string} bookId 
     * @returns {Object}
     */
    getBookStats(bookId) {
        const sessions = this.sessionRepo.getAll(bookId);
        const totalPages = sessions.reduce((sum, s) => sum + s.pagesRead, 0);
        const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

        return {
            totalPages,
            totalDuration,
            sessionCount: sessions.length,
            averagePagesPerSession: sessions.length > 0 ? Math.round(totalPages / sessions.length) : 0,
            averageSpeed: totalDuration > 0 ? Math.round((totalPages / totalDuration) * 60) : 0
        };
    }

    /**
     * Get global statistics across all books and sessions
     * @returns {Object}
     */
    getGlobalStats() {
        const books = this.bookRepo.getAll();
        const sessions = this.sessionRepo.getAll();
        const weekSessions = sessions.filter(s => isInCurrentWeek(s.startTime));

        const totalPagesRead = sessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);
        const weeklyPagesRead = weekSessions.reduce((sum, s) => sum + (s.pagesRead || 0), 0);
        const totalReadingTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        return {
            totalBooks: books.length,
            booksReading: books.filter(b => b.status === 'reading').length,
            booksCompleted: books.filter(b => b.status === 'completed').length,
            totalSessions: sessions.length,
            weekSessions: weekSessions.length,
            totalPagesRead,
            weeklyPagesRead,
            totalReadingTime, // in minutes
            averageSessionLength: sessions.length > 0 ? Math.round(totalReadingTime / sessions.length) : 0
        }

        /**
         * Save notes for a completed session
         * @param {string} sessionId 
         * @param {Object} notes 
         * @returns {Session}
         */
        saveSessionNotes(sessionId, notes) {
            const session = this.sessionRepo.getById(sessionId);
            if (!session) throw new Error('Session not found');

            session.updateNotes(notes);
            return this.sessionRepo.save(session);
        }
    }

    const readingService = new ReadingService(bookRepository, sessionRepository, validationService);
