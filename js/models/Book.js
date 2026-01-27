// Book Model

class Book {
    constructor({
        id = generateUUID(),
        title,
        author,
        totalPages,
        coverUrl = null,
        isbn = null,
        publisher = null,
        publishedDate = null,
        description = null,
        currentPage = 0,
        status = 'reading', // reading, completed, dropped, shelved
        dateAdded = new Date().toISOString(),
        dateCompleted = null,
        conclusionNotes = null
    }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.totalPages = totalPages;
        this.coverUrl = coverUrl;
        this.isbn = isbn;
        this.publisher = publisher;
        this.publishedDate = publishedDate;
        this.description = description;
        this.currentPage = currentPage;
        this.status = status;
        this.dateAdded = dateAdded;
        this.dateCompleted = dateCompleted;
        this.conclusionNotes = conclusionNotes;
    }

    // Calculate reading progress percentage
    get progress() {
        if (this.totalPages === 0) return 0;
        return Math.round((this.currentPage / this.totalPages) * 100);
    }

    // Get pages remaining
    get pagesRemaining() {
        return Math.max(0, this.totalPages - this.currentPage);
    }

    // Check if book is completed
    get isCompleted() {
        return this.status === 'completed' || this.currentPage >= this.totalPages;
    }

    // Update progress
    updateProgress(endPage) {
        this.currentPage = Math.min(endPage, this.totalPages);

        // Auto-complete if reached last page
        if (this.currentPage >= this.totalPages && this.status !== 'completed') {
            this.status = 'completed';
            this.dateCompleted = new Date().toISOString();
        }
    }

    // Mark as completed
    markCompleted() {
        this.status = 'completed';
        this.currentPage = this.totalPages;
        this.dateCompleted = new Date().toISOString();
    }

    // Mark as dropped
    markDropped() {
        this.status = 'dropped';
    }

    // Resume reading (if dropped)
    markReading() {
        this.status = 'reading';
    }

    // Convert to plain object for storage
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            totalPages: this.totalPages,
            coverUrl: this.coverUrl,
            isbn: this.isbn,
            publisher: this.publisher,
            publishedDate: this.publishedDate,
            description: this.description,
            currentPage: this.currentPage,
            status: this.status,
            dateAdded: this.dateAdded,
            dateCompleted: this.dateCompleted,
            conclusionNotes: this.conclusionNotes
        };
    }

    // Create from plain object
    static fromJSON(obj) {
        return new Book(obj);
    }
}
