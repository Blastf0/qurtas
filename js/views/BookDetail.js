// Book Detail View Component for Qurtas

class BookDetailView {
    constructor() {
        this.container = null;
        this.book = null;
    }

    /**
     * Render the book detail view
     * @param {HTMLElement} container 
     * @param {string} bookId 
     */
    render(container, bookId) {
        this.container = container;
        const bookData = storage.getBookById(bookId);

        if (!bookData) {
            showToast('Book not found', 'error');
            app.navigateTo('library');
            return;
        }

        this.book = Book.fromJSON(bookData);
        const stats = storage.getSessions(bookId);

        this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl);">
          <button class="btn btn-ghost" onclick="app.navigateTo('library')" style="padding: var(--space-sm); min-width: auto;">
            ← Back
          </button>
          <h1 style="margin-bottom: 0; font-size: var(--font-size-xl);">Book Details</h1>
        </div>

        <!-- Book Header Card -->
        <div class="card mb-xl" style="display: flex; gap: var(--space-lg); align-items: flex-start;">
          <div style="width: 100px; height: 150px; background: var(--color-bg-tertiary); border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; box-shadow: var(--shadow-md);">
            ${this.book.coverUrl ?
                `<img src="${this.book.coverUrl}" alt="${sanitizeHTML(this.book.title)}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem;">📕</div>`
            }
          </div>
          <div style="flex: 1;">
            <h2 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-xs);">${sanitizeHTML(this.book.title)}</h2>
            <p style="font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: var(--space-md);">by ${sanitizeHTML(this.book.author)}</p>
            
            <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
              <span class="badge" style="background: var(--color-bg-tertiary); padding: 4px 12px; border-radius: var(--radius-full); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
                ${this.book.totalPages} pages
              </span>
              <span class="badge" style="background: ${this.getStatusColor()}; padding: 4px 12px; border-radius: var(--radius-full); font-size: var(--font-size-xs); color: white;">
                ${this.book.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <!-- Progress Card -->
        <div class="card mb-xl">
          <h3 style="margin-bottom: var(--space-md);">Reading Progress</h3>
          <div class="progress-bar" style="height: 12px; margin-bottom: var(--space-md);">
            <div class="progress-fill" style="width: ${this.book.progress}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--font-size-base); font-weight: var(--font-weight-medium);">
            <span>${this.book.currentPage} / ${this.book.totalPages} pages</span>
            <span>${this.book.progress}%</span>
          </div>
          <p style="margin-top: var(--space-sm); font-size: var(--font-size-sm); color: var(--color-text-tertiary);">
            ${this.book.pagesRemaining} pages left to finish
          </p>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-2xl);">
          ${this.book.status === 'backlog' ? `
            <button id="start-reading-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
              📖 Start Reading This Book
            </button>
          ` : this.book.status === 'reading' ? `
            <button id="start-session-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
              📖 Start Reading Session
            </button>
            <div style="display: flex; gap: var(--space-md);">
              <button id="mark-completed-btn" class="btn btn-secondary" style="flex: 1;">✅ Mark as Completed</button>
              <button id="mark-dropped-btn" class="btn btn-ghost" style="flex: 1; color: var(--color-error);">🚫 Drop Book</button>
            </div>
          ` : this.book.status === 'completed' ? `
            <button class="btn btn-secondary btn-full" disabled>
              ✅ Book Completed
            </button>
            <button id="move-to-reading-btn" class="btn btn-ghost btn-full">↩ Move Back to Reading</button>
          ` : this.book.status === 'dropped' ? `
            <button class="btn btn-secondary btn-full" style="background: var(--color-bg-tertiary); color: var(--color-text-secondary);" disabled>
              🚫 Book Dropped
            </button>
            <button id="move-to-reading-btn" class="btn btn-ghost btn-full">↩ Move Back to Reading</button>
          ` : ``}

          <button id="edit-progress-btn" class="btn btn-secondary btn-full">Update Progress</button>
        </div>

        <!-- Session History -->
        <div>
          <h3 style="margin-bottom: var(--space-lg);">Recent Sessions</h3>
          ${this.renderSessionHistory(stats)}
        </div>
      </div>
    `;

        this.setupEventListeners();
    }

    getStatusColor() {
        switch (this.book.status) {
            case 'backlog': return 'var(--color-text-tertiary)';
            case 'reading': return 'var(--color-accent-primary)';
            case 'completed': return 'var(--color-success)';
            case 'dropped': return 'var(--color-error)';
            default: return 'var(--color-text-tertiary)';
        }
    }

    renderSessionHistory(sessions) {
        if (sessions.length === 0) {
            return '<p style="color: var(--color-text-tertiary); text-align: center; padding: var(--space-xl);">No sessions yet for this book.</p>';
        }

        // Show last 5 sessions
        const recentSessions = [...sessions].reverse().slice(0, 5);

        return `
      <div style="display: grid; gap: var(--space-md);">
        ${recentSessions.map(sessionData => {
            const session = Session.fromJSON(sessionData);
            return `
            <div class="card" style="padding: var(--space-md); font-size: var(--font-size-sm);">
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-xs);">
                <span style="font-weight: var(--font-weight-bold);">${formatDate(session.startTime)}</span>
                <span style="color: var(--color-accent-primary); font-weight: var(--font-weight-semibold);">+${session.pagesRead} pages</span>
              </div>
              <div style="display: flex; justify-content: space-between; color: var(--color-text-tertiary); font-size: var(--font-size-xs);">
                <span>Pages ${session.startPage} → ${session.endPage}</span>
                <span>${formatDuration(session.duration)}</span>
              </div>
            </div>
          `;
        }).join('')}
        ${sessions.length > 5 ? `
          <button class="btn btn-ghost btn-full" style="font-size: var(--font-size-sm);">View all sessions</button>
        ` : ''}
      </div>
    `;
    }

    setupEventListeners() {
        const startReadingBtn = document.getElementById('start-reading-btn');
        const startBtn = document.getElementById('start-session-btn');
        const editBtn = document.getElementById('edit-progress-btn');

        if (startReadingBtn) {
            startReadingBtn.addEventListener('click', () => {
                storage.updateBook(this.book.id, { status: 'reading' });
                showToast('Moved to Reading', 'success');
                this.render(this.container, this.book.id);
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                app.startSession(this.book.id);
            });
        }

        const markCompletedBtn = document.getElementById('mark-completed-btn');
        if (markCompletedBtn) {
            markCompletedBtn.addEventListener('click', () => {
                storage.updateBook(this.book.id, { status: 'completed', currentPage: this.book.totalPages });
                showToast('Book marked as completed', 'success');
                this.render(this.container, this.book.id);
            });
        }

        const markDroppedBtn = document.getElementById('mark-dropped-btn');
        if (markDroppedBtn) {
            markDroppedBtn.addEventListener('click', () => {
                if (confirm('Mark this book as dropped?')) {
                    storage.updateBook(this.book.id, { status: 'dropped' });
                    showToast('Book marked as dropped', 'info');
                    this.render(this.container, this.book.id);
                }
            });
        }

        const moveToReadingBtn = document.getElementById('move-to-reading-btn');
        if (moveToReadingBtn) {
            moveToReadingBtn.addEventListener('click', () => {
                storage.updateBook(this.book.id, { status: 'reading' });
                showToast('Moved back to Reading', 'success');
                this.render(this.container, this.book.id);
            });
        }

        editBtn.addEventListener('click', () => {
            const newPage = prompt(`Current page is ${this.book.currentPage}. Enter new page number:`, this.book.currentPage);
            if (newPage !== null) {
                const pageNum = parseInt(newPage);
                if (!isNaN(pageNum) && pageNum >= 0 && pageNum <= this.book.totalPages) {
                    storage.updateBook(this.book.id, { currentPage: pageNum });
                    showToast('Progress updated', 'success');
                    this.render(this.container, this.book.id);
                } else {
                    showToast('Invalid page number', 'warning');
                }
            }
        });
    }
}

// Global instance
const bookDetailView = new BookDetailView();
