// Session Tracker View Component for Qurtas

class SessionTrackerView {
  constructor() {
    this.container = null;
    this.book = null;
    this.session = null;
    this.timerInterval = null;
    this.startTime = null;
  }

  /**
   * Render the active session tracker
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

    // Check if there's already an active session for this book
    const existingSession = storage.getActiveSession(bookId);
    if (existingSession) {
      this.session = Session.fromJSON(existingSession);
      this.startTime = new Date(this.session.startTime);
    } else {
      // Create new session
      this.session = new Session({
        bookId: this.book.id,
        startPage: this.book.currentPage
      });
      storage.addSession(this.session.toJSON());
      this.startTime = new Date();
    }

    this.renderTracker();
    this.startTimer();
  }

  renderTracker() {
    this.container.innerHTML = `
      <div class="fade-in">
        <div style="text-align: center; margin-bottom: var(--space-2xl); margin-top: var(--space-xl);">
          <p style="color: var(--color-text-tertiary); font-size: var(--font-size-sm); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--space-sm);">Current Session</p>
          <h1 style="margin-bottom: var(--space-xs);">${sanitizeHTML(this.book.title)}</h1>
          <p style="color: var(--color-text-secondary);">by ${sanitizeHTML(this.book.author)}</p>
        </div>

        <!-- Timer Circle -->
        <div style="display: flex; justify-content: center; margin-bottom: var(--space-2xl);">
          <div style="width: 200px; height: 200px; border-radius: 50%; border: 4px solid var(--color-bg-tertiary); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
            <div id="session-timer" style="font-size: 3rem; font-weight: var(--font-weight-bold); font-variant-numeric: tabular-nums;">00:00</div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: -5px;">DURATION</div>
            
            <!-- Slow spinning accent border -->
            <div style="position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border: 4px solid transparent; border-top-color: var(--color-accent-primary); border-radius: 50%; animation: spin 4s linear infinite;"></div>
          </div>
        </div>

        <!-- Session Status -->
        <div class="card mb-2xl text-center" style="background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.2);">
          <p style="color: var(--color-text-primary); margin-bottom: var(--space-xs);">Starting at page <strong>${this.session.startPage}</strong></p>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">Started at ${formatDate(this.startTime, true)}</p>
        </div>

        <!-- Action Area -->
        <div class="form-group">
          <label class="form-label" for="end-page-input">To what page did you read?</label>
          <div style="display: flex; gap: var(--space-md); align-items: center;">
            <input type="number" id="end-page-input" class="form-input" value="${this.book.currentPage}" min="${this.book.currentPage}" max="${this.book.totalPages}" style="font-size: var(--font-size-xl); text-align: center;">
            <span style="color: var(--color-text-tertiary); font-size: var(--font-size-lg);">/ ${this.book.totalPages}</span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-2xl);">
          <button id="finish-session-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
            ✅ Finish & Reflect
          </button>
          <button id="cancel-session-btn" class="btn btn-ghost" style="color: var(--color-error);">Discard Session</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  startTimer() {
    this.stopTimer(); // Clear any existing

    const timerElement = document.getElementById('session-timer');
    if (!timerElement) return;

    this.timerInterval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - this.startTime) / 1000);
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;

      timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  setupEventListeners() {
    const finishBtn = document.getElementById('finish-session-btn');
    const cancelBtn = document.getElementById('cancel-session-btn');
    const endPageInput = document.getElementById('end-page-input');

    finishBtn.addEventListener('click', () => {
      const endPage = parseInt(endPageInput.value);

      if (isNaN(endPage) || endPage < this.session.startPage) {
        showToast(`Please enter a valid page number (at least ${this.session.startPage})`, 'warning');
        return;
      }

      if (endPage > this.book.totalPages) {
        showToast(`Book only has ${this.book.totalPages} pages`, 'warning');
        return;
      }

      this.stopTimer();

      // Update session locally first
      this.session.endPage = endPage;
      this.session.endTime = new Date().toISOString();
      storage.updateSession(this.session.id, this.session.toJSON());

      // Navigate to review view
      app.reviewSession(this.session.id);
    });

    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to discard this reading session? Data will not be saved.')) {
        this.stopTimer();
        storage.deleteSession(this.session.id);
        app.navigateTo('library');
      }
    });

    // Auto-save end page as user types? Maybe just keep it in state.
  }
}

// Global instance
const sessionTrackerView = new SessionTrackerView();
