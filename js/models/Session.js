// Reading Session Model

class Session {
    constructor({
        id = generateUUID(),
        bookId,
        startTime = new Date().toISOString(),
        endTime = null,
        startPage,
        endPage = null,
        notes = {
            whatStoodOut: '',
            keyIdeas: '',
            questionsRaised: ''
        }
    }) {
        this.id = id;
        this.bookId = bookId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.startPage = startPage;
        this.endPage = endPage;
        this.notes = notes;
    }

    // Calculate pages read in this session
    get pagesRead() {
        if (this.endPage === null) return 0;
        return Math.max(0, this.endPage - this.startPage);
    }

    // Calculate reading duration in minutes
    get duration() {
        if (!this.endTime) {
            // Session still active - calculate from start to now
            const now = new Date();
            const start = new Date(this.startTime);
            return Math.round((now - start) / 60000);
        }

        const start = new Date(this.startTime);
        const end = new Date(this.endTime);
        return Math.round((end - start) / 60000);
    }

    // Check if session is active (not ended yet)
    get isActive() {
        return this.endTime === null;
    }

    // Check if session has notes
    get hasNotes() {
        return Boolean(
            this.notes.whatStoodOut ||
            this.notes.keyIdeas ||
            this.notes.questionsRaised
        );
    }

    // Calculate reading speed (pages per hour)
    get readingSpeed() {
        if (this.duration === 0 || this.pagesRead === 0) return 0;
        return Math.round((this.pagesRead / this.duration) * 60);
    }

    // End the session
    endSession(endPage, notes = null) {
        this.endTime = new Date().toISOString();
        this.endPage = endPage;
        if (notes) {
            this.notes = { ...this.notes, ...notes };
        }
    }

    // Update notes
    updateNotes(notes) {
        this.notes = { ...this.notes, ...notes };
    }

    // Convert to plain object for storage
    toJSON() {
        return {
            id: this.id,
            bookId: this.bookId,
            startTime: this.startTime,
            endTime: this.endTime,
            startPage: this.startPage,
            endPage: this.endPage,
            notes: this.notes
        };
    }

    // Create from plain object
    static fromJSON(obj) {
        return new Session(obj);
    }

    // Format session for display
    getDisplayData() {
        return {
            id: this.id,
            date: formatDate(this.startTime, true),
            pagesRead: this.pagesRead,
            duration: formatDuration(this.duration),
            readingSpeed: this.readingSpeed,
            hasNotes: this.hasNotes,
            isActive: this.isActive
        };
    }
}
