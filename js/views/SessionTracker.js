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
    const book = bookRepository.getById(bookId);

    if (!book) {
      showToast('Book not found', 'error');
      app.navigateTo('library');
      return;
    }

    this.book = book;
    this.book = bookRepository.get(bookId);

    // Create a new session or get existing? For MVP, we'll create a new one each time we enter.
    this.session = readingService.startSession(bookId);
    this.startTime = new Date();

    this.renderTracker();
    this.startTimer();
  }

  renderTracker() {
    this.container.innerHTML = `
      <div class="fade-in">
        <div style="text-align: center; margin-bottom: var(--space-2xl); margin-top: var(--space-xl);">
          <p style="color: var(--color-accent-tertiary); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 2px; margin-bottom: var(--space-sm);">Reading Journey</p>
          <h1 style="margin-bottom: 4px; font-weight: var(--font-weight-black);">${sanitizeHTML(this.book.title)}</h1>
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">by ${sanitizeHTML(this.book.author)}</p>
        </div>

        <!-- Timer Area -->
        <div style="display: flex; justify-content: center; margin-bottom: var(--space-3xl);">
          <div style="width: 240px; height: 240px; border-radius: 50%; background: var(--color-bg-secondary); border: 2px solid var(--color-bg-tertiary); display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; box-shadow: var(--shadow-xl);">
            <div id="session-timer" style="font-size: 3.5rem; font-weight: var(--font-weight-black); font-variant-numeric: tabular-nums; color: var(--color-text-primary); letter-spacing: -2px;">00:00</div>
            <div style="font-size: 10px; color: var(--color-text-tertiary); font-weight: var(--font-weight-bold); letter-spacing: 2px; margin-top: -8px;">ELAPSED TIME</div>
            
            <!-- Pulsing Accent Outer Ring -->
            <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 2px solid var(--color-accent-primary); border-radius: 50%; opacity: 0.2; animation: pulse 2s ease-in-out infinite;"></div>
            <!-- Spinning Accent Segment -->
            <div style="position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; border: 2px solid transparent; border-top-color: var(--color-accent-primary); border-radius: 50%; animation: spin 3s linear infinite;"></div>
          </div>
        </div>

        <!-- Session Progress Card -->
        <div class="card mb-2xl" style="background: var(--color-bg-secondary); border-color: var(--color-bg-tertiary); padding: var(--space-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
            <div style="text-align: left;">
              <div style="font-size: 10px; color: var(--color-text-tertiary); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Starting Point</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text-primary);">Page ${this.session.startPage}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; color: var(--color-text-tertiary); font-weight: var(--font-weight-bold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Book Length</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text-secondary);">${this.book.totalPages} pp</div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="end-page-input" style="font-size: 10px; color: var(--color-accent-tertiary); text-transform: uppercase; font-weight: var(--font-weight-bold); letter-spacing: 1px;">Where are you now?</label>
            <div style="display: flex; gap: var(--space-md); align-items: center;">
              <input type="number" id="end-page-input" class="form-input" value="${this.book.currentPage}" min="${this.book.currentPage}" max="${this.book.totalPages}" 
                     style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-black); text-align: center; background: var(--color-bg-primary); border-radius: var(--radius-md); padding: var(--space-md); border-color: var(--color-bg-tertiary);">
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-3xl);">
          <button id="finish-session-btn" class="btn btn-primary btn-full" style="height: 64px; font-size: var(--font-size-lg); border-radius: var(--radius-lg);">
            Finish & Reflect
          </button>
          <button id="cancel-session-btn" class="btn btn-ghost" style="color: var(--color-error); font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">Discard Session</button>
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

      try {
        // Use readingService to complete session
        readingService.completeSession(this.session.id, endPage, {});

        // Navigate to review view
        app.reviewSession(this.session.id);
      } catch (error) {
        showToast(error.message, 'error');
        this.startTimer(); // Restart timer if it failed
      }
    });

    cancelBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to discard this reading session? Data will not be saved.')) {
        this.stopTimer();
        sessionRepository.delete(this.session.id);
        app.navigateTo('library');
      }
    });
  }
}

// Global instance
const sessionTrackerView = new SessionTrackerView();
