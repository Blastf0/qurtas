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
    const books = bookRepository.getAll();
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
    const goals = goalRepository.getGoals();
    const theme = goals ? goals.weeklyTheme : null;

    return `
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: var(--space-xl);">
        <div>
          <h1 style="margin-bottom: 0; font-weight: var(--font-weight-black); letter-spacing: -1px;">Library</h1>
          <p style="margin-bottom: 0; font-size: var(--font-size-sm); color: var(--color-text-tertiary);">Track your intellectual progress</p>
        </div>
        <button class="btn btn-primary btn-icon" style="border-radius: var(--radius-full); width: 48px; height: 48px;" onclick="app.navigateTo('search')">
          <span style="font-size: 1.5rem; line-height: 1;">+</span>
        </button>
      </div>

      <!-- Current Focus / Insight Card -->
      <div class="card mb-xl" style="background: var(--color-accent-subtle); border: 1px solid rgba(124, 58, 237, 0.2); overflow: hidden;">
        <!-- Subtle noise/gradient overlay could be added here via CSS -->
        <div style="position: relative; z-index: 1;">
          <div style="font-size: var(--font-size-xs); color: var(--color-accent-tertiary); text-transform: uppercase; font-weight: var(--font-weight-bold); letter-spacing: 1px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 8px; height: 8px; background: var(--color-accent-primary); border-radius: 50%;"></span>
            Current Focus
          </div>
          <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); line-height: var(--line-height-snug); color: var(--color-text-primary);">
            ${theme ? sanitizeHTML(theme) : `<span style="color: var(--color-text-tertiary); font-weight: var(--font-weight-normal); font-style: italic;">What are you focusing on this week? Set it in Goals.</span>`}
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

        <div class="book-list" style="display: grid; gap: var(--space-md);">
          ${sortedBooks.map(book => this.renderBookCard(book)).join('')}
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
    const isReading = book.status === 'reading';
    const progressColor = isCompleted ? 'var(--color-success)' : 'var(--color-accent-primary)';

    return `
      <div class="card book-card slide-up" data-id="${book.id}" style="padding: var(--space-md);">
        <div style="display: flex; gap: var(--space-md);">
          <!-- Cover Thumbnail -->
          <div class="card-clickable" onclick="app.navigateToDetail('${book.id}')" style="width: 80px; height: 120px; background: var(--color-bg-tertiary); border-radius: var(--radius-md); overflow: hidden; flex-shrink: 0; box-shadow: var(--shadow-md);">
            ${book.coverUrl ?
        `<img src="${book.coverUrl}" alt="${sanitizeHTML(book.title)}" style="width: 100%; height: 100%; object-fit: cover;">` :
        `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2rem;">📕</div>`
      }
            ${isCompleted ?
        `<div style="position: absolute; bottom: 0; right: 0; background: var(--color-success); color: white; width: 24px; height: 24px; border-radius: var(--radius-full) 0 0 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">✓</div>` :
        ''
      }
          </div>

          <!-- Info -->
          <div style="flex: 1; min-width: 0; display: flex; flex-direction: column;">
            <div class="card-clickable" onclick="app.navigateToDetail('${book.id}')" style="flex: 1;">
              <h3 style="font-size: var(--font-size-base); font-weight: var(--font-weight-bold); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</h3>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-md); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">by ${sanitizeHTML(book.author)}</p>
              
              <!-- Progress -->
              <div class="progress-bar" style="height: 6px; margin-bottom: 6px; background: var(--color-bg-tertiary);">
                <div class="progress-fill" style="width: ${book.progress}%; background: ${progressColor};"></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--color-text-tertiary); font-weight: var(--font-weight-medium); text-transform: uppercase; letter-spacing: 0.5px;">
                <span>${book.currentPage} / ${book.totalPages} pp</span>
                <span>${book.progress}%</span>
              </div>
            </div>

            ${isReading ? `
              <button class="btn btn-primary btn-full" style="padding: var(--space-sm); font-size: var(--font-size-xs); margin-top: var(--space-md); border-radius: var(--radius-md);" 
                      onclick="event.stopPropagation(); app.startSession('${book.id}')">
                ⚡ Start Session
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
const bookListView = new BookListView();
