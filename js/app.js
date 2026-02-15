// Main Application Controller for Qurtas

class QurtasApp {
  constructor() {
    this.currentView = 'library';
    this.viewContainer = document.getElementById('view-container');
    this.bottomNav = document.getElementById('bottom-nav');

    this.init();
  }

  init() {
    console.log('🚀 Qurtas App Initializing...');

    // Set up navigation
    this.setupNavigation();

    // Load initial view
    this.renderView('library');

    // Check if we have any books, show welcome if not
    const books = storage.getBooks();
    if (books.length === 0) {
      this.showWelcomeScreen();
    }

    console.log('✅ Qurtas App Ready!');
  }

  setupNavigation() {
    const navItems = this.bottomNav.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const view = item.dataset.view;
        this.navigateTo(view);
      });
    });
  }

  navigateTo(viewName) {
    // Update active nav item
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      }
    });

    // Render the view
    this.renderView(viewName);
  }

  navigateToDetail(bookId) {
    this.currentView = 'detail';
    // Clear active state of bottom nav
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    bookDetailView.render(this.viewContainer, bookId);
  }

  startSession(bookId) {
    this.currentView = 'tracker';
    // Clear active state of bottom nav
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    sessionTrackerView.render(this.viewContainer, bookId);
  }

  reviewSession(sessionId) {
    this.currentView = 'review';
    // Clear active state of bottom nav
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    sessionReviewView.render(this.viewContainer, sessionId);
  }

  renderView(viewName) {
    this.currentView = viewName;

    // For now, show placeholder content until we build the views
    switch (viewName) {
      case 'library':
        this.renderLibrary();
        break;
      case 'session':
        this.renderSession();
        break;
      case 'goals':
        this.renderGoals();
        break;
      case 'profile':
        this.renderProfile();
        break;
      default:
        this.viewContainer.innerHTML = '<div class="empty-state"><h2>View not found</h2></div>';
    }
  }

  showWelcomeScreen() {
    this.viewContainer.innerHTML = `
      <div class="empty-state fade-in">
        <div class="empty-state-icon">📚</div>
        <h2 class="empty-state-title">Welcome to Qurtas</h2>
        <p class="empty-state-description">
          Your journey to reading better starts here.<br>
          Add your first book to begin tracking your reading sessions.
        </p>
        <button class="btn btn-primary" onclick="app.navigateTo('session')">
          Add Your First Book
        </button>
      </div>
    `;
  }

  renderLibrary() {
    bookListView.render(this.viewContainer);
  }

  renderSession() {
    // If no books, go straight to search
    const books = storage.getBooks();
    if (books.length === 0) {
      bookSearchView.render(this.viewContainer);
      return;
    }

    // If books exist, we'll eventually show a book picker here
    // For now, let's just show the search view to allow adding more books
    this.viewContainer.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
          <h1>Active Session</h1>
          <button class="btn btn-secondary" id="open-search-btn">+ Add Book</button>
        </div>
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <h3 class="empty-state-title">Select a book to read</h3>
          <p class="empty-state-description">Your library books will appear here for you to start a session.</p>
        </div>
      </div>
    `;

    document.getElementById('open-search-btn').addEventListener('click', () => {
      bookSearchView.render(this.viewContainer);
    });
  }

  navigateToGoalSettings() {
    this.currentView = 'goal-settings';
    // Clear active state of bottom nav
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    goalSettingsView.render(this.viewContainer);
  }

  renderGoals() {
    goalProgressView.render(this.viewContainer);
  }

  navigateToHistory() {
    this.currentView = 'history';
    // Clear active state of bottom nav
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    sessionHistoryView.render(this.viewContainer);
  }

  renderProfile() {
    const stats = storage.getStats();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const themeIcon = currentTheme === 'light' ? '☀️' : '🌙';
    const themeLabel = currentTheme === 'light' ? 'Light Mode' : 'Dark Mode';

    this.viewContainer.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
          <h1>Reading Stats</h1>
          <button class="btn btn-ghost" onclick="app.navigateToHistory()" style="padding: var(--space-sm);">
            🕒 History
          </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md); margin-bottom: var(--space-xl);">
          <div class="card text-center">
            <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-sm);">📚</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">${stats.totalBooks}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Total Books</div>
          </div>
          
          <div class="card text-center">
            <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-sm);">✅</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">${stats.booksCompleted}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Completed</div>
          </div>
          
          <div class="card text-center">
            <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-sm);">📖</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">${formatNumber(stats.totalPagesRead)}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Pages Read</div>
          </div>
          
          <div class="card text-center">
            <div style="font-size: var(--font-size-3xl); margin-bottom: var(--space-sm);">⏱️</div>
            <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xs);">${formatDuration(stats.totalReadingTime)}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Reading Time</div>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom: var(--space-md);">This Week</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
            <span style="color: var(--color-text-secondary);">Sessions</span>
            <span style="font-weight: var(--font-weight-semibold);">${stats.weekSessions}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-text-secondary);">Pages</span>
            <span style="font-weight: var(--font-weight-semibold);">${stats.weeklyPagesRead}</span>
          </div>
        </div>

        <!-- Theme Settings -->
        <div class="card" style="margin-top: var(--space-lg);">
          <h3 style="margin-bottom: var(--space-md);">Appearance</h3>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: var(--font-weight-medium); margin-bottom: var(--space-xs);">Theme</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Choose your preferred color scheme</div>
            </div>
            <button id="theme-toggle" class="theme-toggle">
              <span class="theme-icon" id="theme-icon">${themeIcon}</span>
              <span id="theme-label">${themeLabel}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Set up theme toggle event listener
    const themeToggle = document.getElementById('theme-toggle');
    console.log('[Theme] Setting up theme toggle button:', themeToggle);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        console.log('[Theme] Button clicked!');
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        console.log('[Theme] Current theme:', currentTheme);

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log('[Theme] New theme will be:', newTheme);

        console.log('[Theme] window.setTheme exists?', typeof window.setTheme);

        if (typeof window.setTheme === 'function') {
          window.setTheme(newTheme);
          console.log('[Theme] setTheme called successfully');
          console.log('[Theme] Theme attribute after setTheme:', document.documentElement.getAttribute('data-theme'));
        } else {
          console.error('[Theme] ERROR: window.setTheme is not a function!', typeof window.setTheme);
        }

        // Update button text and icon
        const themeIcon = document.getElementById('theme-icon');
        const themeLabel = document.getElementById('theme-label');
        if (newTheme === 'light') {
          if (themeIcon) themeIcon.textContent = '☀️';
          if (themeLabel) themeLabel.textContent = 'Light Mode';
        } else {
          if (themeIcon) themeIcon.textContent = '🌙';
          if (themeLabel) themeLabel.textContent = 'Dark Mode';
        }
        console.log('[Theme] Button UI updated');
      });
      console.log('[Theme] Event listener attached successfully');
    } else {
      console.error('[Theme] ERROR: theme-toggle button not found!');
    }
  }

  // Helper method to add sample data for testing
  addSampleData() {
    // Add a sample book
    const book = new Book({
      title: 'The Pragmatic Programmer',
      author: 'Andy Hunt, Dave Thomas',
      totalPages: 352,
      currentPage: 127
    });
    storage.addBook(book.toJSON());

    // Add a sample session
    const session = new Session({
      bookId: book.id,
      startPage: 112,
      endPage: 127,
      startTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 min ago
      endTime: new Date().toISOString(),
      notes: {
        whatStoodOut: 'The DRY principle really resonated with me',
        keyIdeas: 'Don\'t Repeat Yourself - every piece of knowledge should have a single representation',
        questionsRaised: 'How do I balance DRY with code clarity?'
      }
    });
    storage.addSession(session.toJSON());

    // Set sample goals
    storage.setGoals({
      weekStart: getStartOfWeek().toISOString(),
      pagesTarget: 200,
      sessionsTarget: 5
    });

    showToast('Sample data added! Refresh to see it.', 'success');
    this.renderView(this.currentView);
  }
}

// Initialize app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new QurtasApp();

  // Make app globally accessible for debugging
  window.app = app;

  // Add keyboard shortcut to add sample data (for testing)
  // Press Ctrl/Cmd + Shift + S
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      app.addSampleData();
    }
  });
});
