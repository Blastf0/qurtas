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
    const books = bookRepository.getAll();
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

  navigateToConclusion(bookId, type) {
    this.currentView = 'conclusion';
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    bookConclusionView.render(this.viewContainer, bookId, type);
  }

  navigateToSessionDetail(sessionId) {
    this.currentView = 'session-detail';
    const navItems = this.bottomNav.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    sessionDetailView.render(this.viewContainer, sessionId);
  }

  renderView(viewName) {
    this.currentView = viewName;

    // Add slide-up animation to container
    this.viewContainer.classList.remove('slide-up');
    void this.viewContainer.offsetWidth; // Force reflow
    this.viewContainer.classList.add('slide-up');

    // For now, show placeholder content until we build the views
    switch (viewName) {
      case 'library':
        this.renderLibrary();
        break;
      case 'search':
        this.renderSearch();
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
        <button class="btn btn-primary" onclick="app.navigateTo('search')">
          Add Your First Book
        </button>
      </div>
    `;
  }

  renderLibrary() {
    bookListView.render(this.viewContainer);
  }

  renderSearch() {
    bookSearchView.render(this.viewContainer);
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
    const stats = readingService.getGlobalStats();

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
      </div>
    `;
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
    bookRepository.save(book);

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
    sessionRepository.save(session);

    // Set sample goals
    goalRepository.setGoals({
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
