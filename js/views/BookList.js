// Library (Book List) View Component for Qurtas

class BookListView {
    constructor() {
        this.container = null;
    }

    /**
     * Render the library view
     * @param {HTMLElement} container 
     */
    render(container) {
        this.container = container;
        const books = storage.getBooks();
        const stats = storage.getStats();

        if (books.length === 0) {
            this.renderEmptyState();
            return;
        }

        this.renderLibrary(books, stats);
    }

    renderEmptyState() {
        this.container.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-state-icon">📚</div>
        <h2 class="empty-state-title">No books in your library</h2>
        <p class="empty-state-description">
          Add your first book to start tracking your reading journey.
        </p>
        <button class="btn btn-primary" onclick="app.navigateTo('session')">
          Add Your First Book
        </button>
      </div>
    `;
    }

    renderLibrary(books, stats) {
        // Sort books: reading first, then added date
        const sortedBooks = [...books].sort((a, b) => {
            if (a.status === 'reading' && b.status !== 'reading') return -1;
            if (a.status !== 'reading' && b.status === 'reading') return 1;
            return new Date(b.dateAdded) - new Date(a.dateAdded);
        });

        this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
          <h1>My Library</h1>
          <button class="btn btn-secondary btn-icon" onclick="app.navigateTo('session')">
            <span>+</span>
          </button>
        </div>

        <!-- Mini Stats -->
        <div class="stats-row mb-xl" style="display: flex; gap: var(--space-sm); overflow-x: auto; padding-bottom: var(--space-sm); scrollbar-width: none;">
          <div class="card" style="flex: 1; min-width: 100px; padding: var(--space-md);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Total</div>
            <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${stats.totalBooks}</div>
          </div>
          <div class="card" style="flex: 1; min-width: 100px; padding: var(--space-md);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Reading</div>
            <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-accent-primary);">${stats.booksReading}</div>
          </div>
          <div class="card" style="flex: 1; min-width: 100px; padding: var(--space-md);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Done</div>
            <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); color: var(--color-success);">${stats.booksCompleted}</div>
          </div>
        </div>

        <!-- Book List -->
        <div class="book-list" style="display: grid; gap: var(--space-md);">
          ${sortedBooks.map(bookData => this.renderBookCard(Book.fromJSON(bookData))).join('')}
        </div>
      </div>
    `;

        // Add event listeners to book cards
        this.container.querySelectorAll('.book-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                // Navigation to book detail view (to be implemented)
                app.navigateToDetail(id);
            });
        });
    }

    renderBookCard(book) {
        const isCompleted = book.status === 'completed';
        const progressColor = isCompleted ? 'var(--color-success)' : 'var(--color-accent-primary)';

        return `
      <div class="card card-clickable book-card slide-up" data-id="${book.id}">
        <div style="display: flex; gap: var(--space-md);">
          <!-- Cover Thumbnail -->
          <div style="width: 70px; height: 100px; background: var(--color-bg-tertiary); border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; position: relative;">
            ${book.coverUrl ?
                `<img src="${book.coverUrl}" alt="${sanitizeHTML(book.title)}" style="width: 100%; height: 100%; object-fit: cover;">` :
                `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;">📕</div>`
            }
            ${isCompleted ?
                `<div style="position: absolute; bottom: 0; right: 0; background: var(--color-success); width: 24px; height: 24px; border-radius: var(--radius-full) 0 0 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">✅</div>` :
                ''
            }
          </div>

          <!-- Info -->
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
            <h3 style="font-size: var(--font-size-base); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</h3>
            <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">by ${sanitizeHTML(book.author)}</p>
            
            <!-- Progress -->
            <div class="progress-bar" style="height: 6px; margin-bottom: 4px;">
              <div class="progress-fill" style="width: ${book.progress}%; background: ${progressColor};"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
              <span>${book.currentPage} / ${book.totalPages} pages</span>
              <span>${book.progress}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
    }
}

// Global instance
const bookListView = new BookListView();
