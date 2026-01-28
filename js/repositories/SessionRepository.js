// Repository for Session data operations

class SessionRepository {
    constructor(storage) {
        this.storage = storage;
    }

    getAll(bookId = null) {
        return this.storage.getSessions(bookId).map(data => Session.fromJSON(data));
    }

    getById(id) {
        const data = this.storage.getSessionById(id);
        return data ? Session.fromJSON(data) : null;
    }

    getActive(bookId) {
        const data = this.storage.getActiveSession(bookId);
        return data ? Session.fromJSON(data) : null;
    }

    save(session) {
        const data = session.toJSON();
        const existing = this.storage.getSessionById(session.id);
        if (existing) {
            this.storage.updateSession(session.id, data);
        } else {
            this.storage.addSession(data);
        }
        return session;
    }

    delete(id) {
        return this.storage.deleteSession(id);
    }
}

const sessionRepository = new SessionRepository(storage);
