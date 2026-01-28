// Repository for Book data operations

class BookRepository {
    constructor(storage) {
        this.storage = storage;
    }

    getAll() {
        return this.storage.getBooks().map(data => Book.fromJSON(data));
    }

    getById(id) {
        const data = this.storage.getBookById(id);
        return data ? Book.fromJSON(data) : null;
    }

    save(book) {
        const data = book.toJSON();
        const existing = this.storage.getBookById(book.id);
        if (existing) {
            this.storage.updateBook(book.id, data);
        } else {
            this.storage.addBook(data);
        }
        return book;
    }

    delete(id) {
        return this.storage.deleteBook(id);
    }

    update(id, updates) {
        const data = this.storage.updateBook(id, updates);
        return data ? Book.fromJSON(data) : null;
    }
}

const bookRepository = new BookRepository(storage);
