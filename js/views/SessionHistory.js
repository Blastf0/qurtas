// Session History View Component for Qurtas

class SessionHistoryView {
    constructor() {
        this.container = null;
    }

    /**
     * Render the full session history list
     * @param {HTMLElement} container 
     */
    render(container) {
        this.container = container;
        const sessionsData = storage.getSessions();
        const sessions = sessionsData.map(s => Session.fromJSON(s)).reverse();

        if (sessions.length === 0) {
            this.container.innerHTML = `
        <div class="fade-in">
          <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl);">
            <button class="btn btn-ghost" onclick="app.navigateTo('profile')" style="padding: var(--space-sm); min-width: auto;">
              ← Back
            </button>
            <h1 style="margin-bottom: 0; font-size: var(--font-size-xl);">Reading History</h1>
          </div>
          <div class="empty-state">
            <p class="empty-state-description">No reading sessions recorded yet.</p>
          </div>
        </div>
      `;
            return;
        }

        this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl);">
          <button class="btn btn-ghost" onclick="app.navigateTo('profile')" style="padding: var(--space-sm); min-width: auto;">
            ← Back
          </button>
          <h1 style="margin-bottom: 0; font-size: var(--font-size-xl);">Reading History</h1>
        </div>

        <div style="display: grid; gap: var(--space-md);">
          ${sessions.map(session => this.renderSessionCard(session)).join('')}
        </div>
      </div>
    `;
    }

    renderSessionCard(session) {
        const book = storage.getBookById(session.bookId);
        return `
      <div class="card" style="padding: var(--space-md);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-sm);">
          <div>
            <h4 style="margin-bottom: 2px;">${book ? sanitizeHTML(book.title) : 'Unknown Book'}</h4>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">${formatDate(session.startTime, true)}</p>
          </div>
          <span style="background: rgba(99, 102, 241, 0.1); color: var(--color-accent-primary); padding: 4px 10px; border-radius: var(--radius-sm); font-size: var(--font-size-xs); font-weight: var(--font-weight-bold);">
            +${session.pagesRead} pages
          </span>
        </div>
        
        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); display: flex; gap: var(--space-lg); margin-bottom: var(--space-sm);">
          <span>⏱️ ${formatDuration(session.duration)}</span>
          <span>📖 Pages ${session.startPage} - ${session.endPage}</span>
        </div>

        ${session.notes.whatStoodOut || session.notes.keyIdeas ? `
          <div style="border-top: 1px solid var(--color-bg-tertiary); margin-top: var(--space-sm); padding-top: var(--space-sm);">
            ${session.notes.whatStoodOut ? `<p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); font-style: italic; margin-bottom: 4px;">" ${sanitizeHTML(session.notes.whatStoodOut)} "</p>` : ''}
          </div>
        ` : ''}
      </div>
    `;
    }
}

// Global instance
const sessionHistoryView = new SessionHistoryView();
