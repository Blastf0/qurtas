// Book Search View Component for Qurtas

class BookSearchView {
  constructor() {
    this.container = null;
    this.onBookSelected = null;
  }

  /**
   * Render the search view into the given element
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;

    this.container.innerHTML = `
      <div class="fade-in">
        <h1>Add a New Book</h1>
        <div class="form-group">
          <label class="form-label">Search by Title, Author, or ISBN</label>
          <div style="display: flex; gap: var(--space-sm);">
            <input type="text" id="search-input" class="form-input" placeholder="e.g. The Pragmatic Programmer" autofocus>
            <button id="search-btn" class="btn btn-primary btn-icon">🔍</button>
          </div>
        </div>
        
        <!-- Results Container -->
        <div id="search-results" class="results-container mt-lg">
          <div class="empty-state">
            <p class="empty-state-description">Search for a book to add to your library</p>
          </div>
        </div>
        
        <!-- Manual Entry Option -->
        <div class="text-center mt-xl mb-xl">
          <p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm); margin-bottom: var(--space-sm);">Can't find your book?</p>
          <button id="manual-entry-btn" class="btn btn-secondary">Add Book Manually</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const manualEntryBtn = document.getElementById('manual-entry-btn');

    // Search on button click
    searchBtn.addEventListener('click', () => this.handleSearch());

    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    // Manual entry button
    manualEntryBtn.addEventListener('click', () => this.renderManualEntryForm());
  }

  async handleSearch() {
    const input = document.getElementById('search-input');
    const query = input.value.trim();
    const resultsContainer = document.getElementById('search-results');

    if (query.length === 0) {
      showToast('Please enter a search term', 'warning');
      return;
    }

    // Show loading state
    resultsContainer.innerHTML = `
      <div class="loading-container">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const results = await bookSearch.search(query);
      this.displayResults(results);
    } catch (error) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <p class="empty-state-description">Something went wrong. Please try again.</p>
        </div>
      `;
    }
  }

  displayResults(results) {
    const resultsContainer = document.getElementById('search-results');

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <p class="empty-state-description">No books found for that search query.</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: var(--space-md);">
        ${results.map((book, index) => `
          <div class="card card-clickable result-item" data-index="${index}" style="display: flex; gap: var(--space-md); text-align: left;">
            <div style="width: 50px; height: 75px; background: var(--color-bg-tertiary); border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0;">
              ${book.coverUrl ? `<img src="${book.coverUrl}" alt="cover" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1.5rem;">📕</div>'}
            </div>
            <div style="flex: 1; min-width: 0;">
              <h4 style="margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</h4>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.author)}</p>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
                ${book.totalPages ? `${book.totalPages} pages` : 'Page count unknown'}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Add click listeners to results
    const resultItems = resultsContainer.querySelectorAll('.result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const index = item.dataset.index;
        const selectedBook = results[index];
        this.confirmAddBook(selectedBook);
      });
    });
  }

  confirmAddBook(bookData) {
    // Show a quick confirmation or just add it
    const book = new Book(bookData);
    bookRepository.save(book);

    showToast(`Added "${bookData.title}" to your library!`, 'success');
    // Navigate to library after a slight delay
    setTimeout(() => {
      if (window.app) window.app.navigateTo('library');
    }, 1000);
  }

  renderManualEntryForm() {
    this.container.innerHTML = `
      <div class="fade-in">
        <h1>Add Book Manually</h1>
        <div class="form-group">
          <label class="form-label" for="manual-title">Book Title</label>
          <input type="text" id="manual-title" class="form-input" placeholder="e.g. The Pragmatic Programmer" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="manual-author">Author(s)</label>
          <input type="text" id="manual-author" class="form-input" placeholder="e.g. Andy Hunt, Dave Thomas" required>
        </div>
        <div class="form-group">
          <label class="form-label" for="manual-pages">Total Pages</label>
          <input type="number" id="manual-pages" class="form-input" placeholder="352" required>
        </div>
        
        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-xl);">
          <button id="cancel-manual-btn" class="btn btn-secondary flex-1" style="flex: 1;">Cancel</button>
          <button id="save-manual-btn" class="btn btn-primary flex-1" style="flex: 1;">Add Book</button>
        </div>
      </div>
    `;

    document.getElementById('cancel-manual-btn').addEventListener('click', () => this.render(this.container));
    document.getElementById('save-manual-btn').addEventListener('click', () => this.handleManualSave());
  }

  handleManualSave() {
    const title = document.getElementById('manual-title').value.trim();
    const author = document.getElementById('manual-author').value.trim();
    const pages = parseInt(document.getElementById('manual-pages').value);

    if (!title || !author || isNaN(pages) || pages <= 0) {
      showToast('Please fill in all fields correctly', 'warning');
      return;
    }

    const newBook = new Book({
      title,
      author,
      totalPages: pages
    });

    bookRepository.save(newBook);
    showToast('Book added manually!', 'success');

    setTimeout(() => {
      if (window.app) window.app.navigateTo('library');
    }, 1000);
  }
}

// Global instance
const bookSearchView = new BookSearchView();
