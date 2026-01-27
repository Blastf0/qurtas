// Session Detail View for Qurtas

class SessionDetailView {
    constructor() {
        this.container = null;
        this.session = null;
        this.book = null;
    }

    /**
     * Render the details of a specific session
     * @param {HTMLElement} container 
     * @param {string} sessionId 
     */
    render(container, sessionId) {
        this.container = container;
        const sessionData = storage.getSessionById(sessionId);

        if (!sessionData) {
            showToast('Session not found', 'error');
            app.navigateTo('library');
            return;
        }

        this.session = Session.fromJSON(sessionData);
        this.book = Book.fromJSON(storage.getBookById(this.session.bookId));

        this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl);">
          <button class="btn btn-ghost" onclick="window.history.back()" style="padding: var(--space-sm); min-width: auto;">
            ← Back
          </button>
          <h1 style="margin-bottom: 0; font-size: var(--font-size-xl);">Session Reflection</h1>
        </div>

        <!-- Session Header Card -->
        <div class="card mb-xl">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md);">
            <div>
              <h2 style="font-size: var(--font-size-lg); margin-bottom: 2px;">${sanitizeHTML(this.book.title)}</h2>
              <p style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">${formatDate(this.session.startTime, true)}</p>
            </div>
            <div style="text-align: right;">
              <span style="display: block; font-size: var(--font-size-xl); font-weight: bold; color: var(--color-accent-primary);">+${this.session.pagesRead}</span>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">PAGES</span>
            </div>
          </div>
          
          <div style="display: flex; gap: var(--space-xl); border-top: 1px solid var(--color-bg-tertiary); padding-top: var(--space-md);">
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">DURATION</div>
              <div style="font-weight: 500;">${formatDuration(this.session.duration)}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">RANGE</div>
              <div style="font-weight: 500;">p. ${this.session.startPage} - ${this.session.endPage}</div>
            </div>
          </div>
        </div>

        <!-- Active Recall Notes -->
        <h3 style="margin-bottom: var(--space-lg); padding-left: var(--space-xs);">Active Recall</h3>
        
        <div class="note-section mb-lg">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs); text-transform: uppercase;">1. What stood out</div>
          <div class="card" style="font-style: italic;">
            ${this.session.notes.whatStoodOut || '<span style="color: var(--color-text-tertiary);">No notes recorded.</span>'}
          </div>
        </div>

        <div class="note-section mb-lg">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs); text-transform: uppercase;">2. Key Ideas</div>
          <div class="card">
            ${this.session.notes.keyIdeas || '<span style="color: var(--color-text-tertiary);">No notes recorded.</span>'}
          </div>
        </div>

        <div class="note-section mb-2xl">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs); text-transform: uppercase;">3. Questions Raised</div>
          <div class="card" style="border-left: 4px solid var(--color-accent-secondary);">
            ${this.session.notes.questionsRaised || '<span style="color: var(--color-text-tertiary);">No questions recorded.</span>'}
          </div>
        </div>
      </div>
    `;
    }
}

// Global instance
const sessionDetailView = new SessionDetailView();
