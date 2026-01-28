// Goal Settings View Component for Qurtas

class GoalSettingsView {
  constructor() {
    this.container = null;
    this.currentGoal = null;
  }

  /**
   * Render the goal settings view
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;
    this.currentGoal = goalRepository.getGoals();

    // Ensure we have a goal for the current week
    const now = new Date();
    const startOfWeek = getStartOfWeek(now);

    if (!this.currentGoal || this.currentGoal.weekStart !== startOfWeek.toISOString()) {
      this.currentGoal = {
        weekStart: startOfWeek.toISOString(),
        pagesTarget: 200,
        sessionsTarget: 5,
        electiveBooks: [],
        weeklyTheme: ""
      };
    }

    const allBooks = bookRepository.getAll();

    this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-xl);">
          <button class="btn btn-ghost" onclick="app.navigateTo('goals')" style="padding: var(--space-sm); min-width: auto;">
            ← Back
          </button>
          <h1 style="margin-bottom: 0; font-size: var(--font-size-xl);">Reading Goals</h1>
        </div>

        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-xl);">
          Set realistic weekly goals to stay consistent and build a reading habit.
        </p>

        <div class="card mb-xl">
          <div class="form-group">
            <label class="form-label" for="goal-theme">Weekly Theme / Topic</label>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">
                What's the big outcome or area of focus this week?
            </p>
            <input type="text" id="goal-theme" class="form-input" value="${this.currentGoal.weeklyTheme || ''}" placeholder="e.g. Distributed Systems, Arabic Poetry, Focus...">
          </div>
        </div>

        <div class="card mb-xl">
          <h3 style="margin-bottom: var(--space-md);">Elective Books</h3>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-md);">
              Choose 1-3 books you specifically intend to read this week.
          </p>
          <div style="display: grid; gap: var(--space-sm); max-height: 200px; overflow-y: auto; padding: 2px;">
            ${allBooks.length === 0 ? '<p style="font-size: var(--font-size-sm); color: var(--color-text-tertiary);">Add books to your library first.</p>' :
        allBooks.map(book => `
                <label style="display: flex; align-items: center; gap: var(--space-sm); font-size: var(--font-size-sm); background: var(--color-bg-tertiary); padding: var(--space-sm); border-radius: var(--radius-sm); cursor: pointer;">
                    <input type="checkbox" name="elective-book" value="${book.id}" ${this.currentGoal.electiveBooks.includes(book.id) ? 'checked' : ''}>
                    <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</span>
                </label>
              `).join('')
      }
          </div>
        </div>

        <div class="card mb-xl">
          <h3 style="margin-bottom: var(--space-md);">Mechanical Targets</h3>
          <div class="form-group">
            <label class="form-label" for="goal-pages">Weekly Pages Goal</label>
            <div style="display: flex; gap: var(--space-md); align-items: center;">
              <input type="number" id="goal-pages" class="form-input" value="${this.currentGoal.pagesTarget}" min="1" style="font-size: var(--font-size-xl);">
              <span style="color: var(--color-text-tertiary);">pages</span>
            </div>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--space-xs);">
              Break it down: ~${Math.ceil(this.currentGoal.pagesTarget / 7)} pages per day
            </p>
          </div>

          <div class="form-group mt-xl">
            <label class="form-label" for="goal-sessions">Weekly Sessions Goal</label>
            <div style="display: flex; gap: var(--space-md); align-items: center;">
              <input type="number" id="goal-sessions" class="form-input" value="${this.currentGoal.sessionsTarget}" min="1" style="font-size: var(--font-size-xl);">
              <span style="color: var(--color-text-tertiary);">sessions</span>
            </div>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--space-xs);">
              Target number of times you'll pick up a book this week.
            </p>
          </div>
        </div>

        <div style="margin-top: var(--space-2xl);">
          <button id="save-goals-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
            💾 Save Weekly Goals
          </button>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const saveBtn = document.getElementById('save-goals-btn');
    const pagesInput = document.getElementById('goal-pages');
    const sessionsInput = document.getElementById('goal-sessions');

    // Update daily breakdown text as user types
    pagesInput.addEventListener('input', () => {
      const val = parseInt(pagesInput.value) || 0;
      const breakdown = pagesInput.nextElementSibling.nextElementSibling;
      breakdown.textContent = `Break it down: ~${Math.ceil(val / 7)} pages per day`;
    });

    saveBtn.addEventListener('click', () => {
      const pagesTarget = parseInt(pagesInput.value);
      const sessionsTarget = parseInt(sessionsInput.value);
      const weeklyTheme = document.getElementById('goal-theme').value.trim();

      const electiveCheckboxes = document.querySelectorAll('input[name="elective-book"]:checked');
      const electiveBooks = Array.from(electiveCheckboxes).map(cb => cb.value);

      if (isNaN(pagesTarget) || pagesTarget <= 0 || isNaN(sessionsTarget) || sessionsTarget <= 0) {
        showToast('Please enter valid positive numbers', 'warning');
        return;
      }

      goalRepository.setGoals({
        weekStart: this.currentGoal.weekStart,
        pagesTarget,
        sessionsTarget,
        electiveBooks,
        weeklyTheme
      });

      showToast('Weekly intentions updated! 🎯', 'success');
      app.navigateTo('goals');
    });
  }
}

// Global instance
const goalSettingsView = new GoalSettingsView();
