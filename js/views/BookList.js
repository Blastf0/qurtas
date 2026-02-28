// Library (Book List) View Component for Qurtas

class BookListView {
  constructor() {
    this.container = null;
    this.currentFilter = 'all';
  }

  render(container) {
    this.container = container;
    const books = storage.getBooks();

    if (books.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.renderLibrary(books);
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-state-icon">📚</div>
        <h2 class="empty-state-title">No books in your library</h2>
        <p class="empty-state-description">
          Add your first book to start tracking your reading journey.
        </p>
        <button class="btn btn-primary" onclick="bookSearchView.render(app.viewContainer)">
          Add Your First Book
        </button>
      </div>
    `;
  }

  getFilteredBooks(books, filter) {
    if (filter === 'all') {
      return [...books].sort((a, b) => {
        const order = { reading: 0, backlog: 1, completed: 2, dropped: 3 };
        const aOrder = order[a.status] ?? 4;
        const bOrder = order[b.status] ?? 4;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      });
    }
    return [...books]
      .filter(b => b.status === filter)
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }

  renderLibrary(books) {
    const filtered = this.getFilteredBooks(books, this.currentFilter);
    const tabs = [
      { key: 'all', label: 'All' },
      { key: 'backlog', label: 'Backlog' },
      { key: 'reading', label: 'Reading' },
      { key: 'completed', label: 'Completed' },
      { key: 'dropped', label: 'Dropped' },
    ];

    this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
          <h1>My Library</h1>
          <button class="btn btn-secondary btn-icon" id="add-book-btn">
            <span>+</span>
          </button>
        </div>

        <!-- Filter Tabs -->
        <div style="display: flex; gap: var(--space-xs); overflow-x: auto; padding-bottom: var(--space-sm); margin-bottom: var(--space-lg); scrollbar-width: none;">
          ${tabs.map(tab => `
            <button
              class="filter-tab${this.currentFilter === tab.key ? ' filter-tab-active' : ''}"
              data-filter="${tab.key}"
              style="
                flex-shrink: 0;
                padding: var(--space-xs) var(--space-md);
                border-radius: var(--radius-full);
                border: 1px solid ${this.currentFilter === tab.key ? 'var(--color-accent-primary)' : 'var(--color-border)'};
                background: ${this.currentFilter === tab.key ? 'var(--color-accent-primary)' : 'transparent'};
                color: ${this.currentFilter === tab.key ? 'white' : 'var(--color-text-secondary)'};
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-medium);
                cursor: pointer;
                white-space: nowrap;
              "
            >${tab.label}</button>
          `).join('')}
        </div>

        <!-- Book List -->
        <div id="book-list-grid" class="book-list" style="display: grid; gap: var(--space-md);">
          ${filtered.length > 0
        ? this.renderFilteredBooks(filtered)
        : `<div class="empty-state" style="padding: var(--space-2xl) 0;">
                <p style="color: var(--color-text-tertiary); text-align: center;">No books in this category.</p>
              </div>`
      }
        </div>
      </div>
    `;

    // Filter tab clicks
    this.container.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentFilter = tab.dataset.filter;
        this.renderLibrary(storage.getBooks());
      });
    });

    // Add book button
    document.getElementById('add-book-btn').addEventListener('click', () => {
      bookSearchView.render(this.container);
    });

    // Book card navigation
    this.container.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', () => {
        app.navigateToDetail(card.dataset.id);
      });
    });

    // Quick-start session buttons
    this.container.querySelectorAll('.quick-start-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        app.startSession(btn.dataset.id);
      });
    });

    // Delete book buttons
    this.container.querySelectorAll('.delete-book-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const book = storage.getBookById(id);
        if (confirm(`Are you sure you want to remove "${book.title}" from your library?`)) {
          storage.deleteBook(id);
          showToast(`Removed "${book.title}"`, 'success');
          this.render(this.container);
        }
      });
    });
  }

  renderFilteredBooks(filtered) {
    if (this.currentFilter !== 'all') {
      return filtered.map(bookData => this.renderBookCard(Book.fromJSON(bookData))).join('');
    }

    // If "All", group by status
    const groups = {
      reading: { label: 'Currently Reading', items: [] },
      backlog: { label: 'Backlog', items: [] },
      completed: { label: 'Completed', items: [] },
      dropped: { label: 'Dropped', items: [] }
    };

    filtered.forEach(bookData => {
      if (groups[bookData.status]) {
        groups[bookData.status].items.push(bookData);
      }
    });

    const statusOrder = ['reading', 'backlog', 'completed', 'dropped'];
    return statusOrder.map(status => {
      const group = groups[status];
      if (group.items.length === 0) return '';

      return `
                <div class="book-group" style="margin-top: var(--space-md);">
                    <h2 style="font-size: var(--font-size-sm); color: var(--color-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-sm); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-xs);">${group.label}</h2>
                    <div style="display: grid; gap: var(--space-md);">
                        ${group.items.map(bookData => this.renderBookCard(Book.fromJSON(bookData))).join('')}
                    </div>
                </div>
            `;
    }).join('');
  }

  renderBookCard(book) {
    const isCompleted = book.status === 'completed';
    const isReading = book.status === 'reading';
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
            ${isReading ?
        `<button
                  class="quick-start-btn"
                  data-id="${book.id}"
                  style="
                    position: absolute; bottom: 4px; right: 4px;
                    width: 28px; height: 28px;
                    border-radius: var(--radius-full);
                    background: var(--color-accent-primary);
                    border: none;
                    color: white;
                    font-size: 0.75rem;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-md);
                    line-height: 1;
                  "
                  title="Start reading session"
                >▶</button>` :
        ''
      }
          </div>

          <!-- Info -->
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: center; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1; min-width: 0;">
                <h3 style="font-size: var(--font-size-base); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</h3>
                <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-md); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">by ${sanitizeHTML(book.author)}</p>
              </div>
              <button 
                class="delete-book-btn" 
                data-id="${book.id}" 
                style="background: transparent; border: none; color: var(--color-text-tertiary); cursor: pointer; padding: 4px; line-height: 1; font-size: 1.1rem; opacity: 0.6;"
                onmouseover="this.style.opacity='1'; this.style.color='var(--color-error)'" 
                onmouseout="this.style.opacity='0.6'; this.style.color='var(--color-text-tertiary)'"
              >
                🗑️
              </button>
            </div>

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
