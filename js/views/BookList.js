// Library (Book List) View Component for Qurtas

class BookListView {
  constructor() {
    this.container = null;
    this.currentTab = 'reading'; // default tab
  }

  /**
   * Render the library view
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;
    const books = storage.getBooks();
    this.renderLibrary(books);
  }

  renderEmptyState() {
    const statusMessage = this.getEmptyStateMessage(this.currentTab);
    this.container.innerHTML = `
      <div class="fade-in">
        ${this.renderHeader()}
        ${this.renderTabs()}
        <div class="empty-state" style="margin-top: var(--space-xl);">
          <div class="empty-state-icon">${statusMessage.icon}</div>
          <h2 class="empty-state-title">${statusMessage.title}</h2>
          <p class="empty-state-description">${statusMessage.description}</p>
          <button class="btn btn-primary" onclick="app.navigateTo('search')">
            Add a New Book
          </button>
        </div>
      </div>
    `;
  }

  getEmptyStateMessage(tab) {
    switch (tab) {
      case 'reading':
        return { icon: '📖', title: 'Nothing on your desk', description: 'What are you planning to read next?' };
      case 'backlog':
        return { icon: '📚', title: 'Backlog is empty', description: 'Find a book that sparks curiosity.' };
      case 'done':
        return { icon: '🏆', title: 'No books finished yet', description: 'The journey of a thousand pages begins with one session.' };
      case 'dropped':
        return { icon: '🤝', title: 'No dropped books', description: 'It\'s okay to let go of books that don\'t serve you anymore.' };
      default:
        return { icon: '📚', title: 'Empty Library', description: 'Start your journey by adding a book.' };
    }
  }

  renderHeader() {
    const goals = storage.getGoals();
    const theme = goals ? goals.weeklyTheme : null;

    return `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
        <h1>Library</h1>
        <button class="btn btn-secondary btn-icon" onclick="app.navigateTo('search')">
          <span>+</span>
        </button>
      </div>

      <!-- Current Focus / Insight Card -->
      <div class="card mb-xl" style="background: linear-gradient(135deg, var(--color-bg-secondary), var(--color-bg-tertiary)); border-left: 4px solid var(--color-accent-primary);">
        <div style="padding: var(--space-md);">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Current Focus</div>
          <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold);">
            ${theme ? `Exploring: ${sanitizeHTML(theme)}` : `<span style="color: var(--color-text-tertiary); font-weight: normal; font-style: italic;">Set a weekly intention in Goals...</span>`}
          </div>
        </div>
      </div>
    `;
  }

  renderTabs() {
    const tabs = [
      { id: 'reading', label: 'Reading' },
      { id: 'backlog', label: 'Backlog' },
      { id: 'done', label: 'Done' },
      { id: 'dropped', label: 'Dropped' }
    ];

    return `
      <div class="tabs-container mb-lg" style="display: flex; border-bottom: 1px solid var(--color-bg-tertiary); margin-bottom: var(--space-lg);">
        ${tabs.map(tab => `
          <button class="tab-item ${this.currentTab === tab.id ? 'active' : ''}" 
                  style="flex: 1; padding: var(--space-sm) 0; background: none; border: none; color: ${this.currentTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'}; font-size: var(--font-size-sm); font-weight: ${this.currentTab === tab.id ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)'}; position: relative; cursor: pointer;"
                  onclick="bookListView.setTab('${tab.id}')">
            ${tab.label}
            ${this.currentTab === tab.id ? '<div style="position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--color-accent-primary);"></div>' : ''}
          </button>
        `).join('')}
      </div>
    `;
  }

  setTab(tabId) {
    this.currentTab = tabId;
    this.render(this.container);
  }

  renderLibrary(books) {
    // Filter books based on active tab
    const filteredBooks = books.filter(book => {
      switch (this.currentTab) {
        case 'reading': return book.status === 'reading';
        case 'backlog': return book.status === 'to-read' || book.status === 'shelved';
        case 'done': return book.status === 'completed';
        case 'dropped': return book.status === 'dropped';
        default: return true;
      }
    });

    // Sort: most recent activity/addition first
    const sortedBooks = [...filteredBooks].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    if (sortedBooks.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.container.innerHTML = `
      <div class="fade-in">
        ${this.renderHeader()}
        ${this.renderTabs()}

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
