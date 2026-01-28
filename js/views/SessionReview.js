// Session Review View Component (Structured Prompts) for Qurtas

class SessionReviewView {
  constructor() {
    this.container = null;
    this.session = null;
    this.book = null;
  }

  /**
   * Render the post-session structured reflection
   * @param {HTMLElement} container 
   * @param {string} sessionId 
   */
  render(container, sessionId) {
    this.container = container;
    const session = sessionRepository.getById(sessionId);

    if (!session) {
      showToast('Session not found', 'error');
      app.navigateTo('library');
      return;
    }

    this.session = session;
    this.book = bookRepository.getById(this.session.bookId);

    this.container.innerHTML = `
      <div class="fade-in">
        <div style="text-align: center; margin-bottom: var(--space-xl);">
          <h1 style="margin-bottom: var(--space-xs);">Great Reading!</h1>
          <p style="color: var(--color-text-secondary);">You read ${this.session.pagesRead} pages of "${sanitizeHTML(this.book.title)}"</p>
        </div>

        <div class="card mb-xl" style="background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2);">
          <h3 style="color: var(--color-success); font-size: var(--font-size-base); margin-bottom: var(--space-xs); text-align: center;">Active Recall Prompts</h3>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-tertiary); text-align: center;">Reflecting on these will help you internalize what you just read.</p>
        </div>

        <!-- Prompt 1 -->
        <div class="form-group slide-up" style="animation-delay: 100ms;">
          <label class="form-label" style="font-size: var(--font-size-lg);">1. What stood out to you most?</label>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">A character, a fact, an argument, or a specific scene...</p>
          <textarea id="prompt-stood-out" class="form-textarea" placeholder="Write your thoughts here..." rows="3"></textarea>
        </div>

        <!-- Prompt 2 -->
        <div class="form-group slide-up" style="animation-delay: 200ms;">
          <label class="form-label" style="font-size: var(--font-size-lg);">2. What were the key ideas or takeaways?</label>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">If you had to summarize this for a friend...</p>
          <textarea id="prompt-key-ideas" class="form-textarea" placeholder="Write your thoughts here..." rows="3"></textarea>
        </div>

        <!-- Prompt 3 -->
        <div class="form-group slide-up" style="animation-delay: 300ms;">
          <label class="form-label" style="font-size: var(--font-size-lg);">3. What questions did this raise for you?</label>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">Areas to explore later or things you want to clarify...</p>
          <textarea id="prompt-questions" class="form-textarea" placeholder="Write your thoughts here..." rows="3"></textarea>
        </div>

        <div style="margin-top: var(--space-2xl); margin-bottom: var(--space-2xl);">
          <button id="save-review-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
            💾 Save Reflection & Finish
          </button>
          <button id="skip-review-btn" class="btn btn-ghost btn-full mt-sm" style="font-size: var(--font-size-sm);">Skip for now</button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const saveBtn = document.getElementById('save-review-btn');
    const skipBtn = document.getElementById('skip-review-btn');

    saveBtn.addEventListener('click', () => {
      const notes = {
        whatStoodOut: document.getElementById('prompt-stood-out').value.trim(),
        keyIdeas: document.getElementById('prompt-key-ideas').value.trim(),
        questionsRaised: document.getElementById('prompt-questions').value.trim()
      };

      try {
        readingService.saveSessionNotes(this.session.id, notes);
        showToast('Reading reflection saved!', 'success');
        app.navigateTo('library');
      } catch (error) {
        showToast(error.message, 'error');
      }
    });

    skipBtn.addEventListener('click', () => {
      app.navigateTo('library');
    });
  }
}

// Global instance
const sessionReviewView = new SessionReviewView();
