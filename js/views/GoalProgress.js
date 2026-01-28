// Goal Progress View Component for Qurtas

class GoalProgressView {
  constructor() {
    this.container = null;
  }

  /**
   * Render the goal progress dashboard
   * @param {HTMLElement} container 
   */
  render(container) {
    this.container = container;
    const goals = goalRepository.getGoals();
    const sessions = sessionRepository.getAll();
    const stats = readingService.getGlobalStats();

    // Convert goals to model for logic
    const weeklyGoal = WeeklyGoal.fromJSON(goals);

    const progress = weeklyGoal.getProgress(sessions);
    const suggestedPace = weeklyGoal.getSuggestedPace(progress);

    this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
          <h1>Goal Tracking</h1>
          <button class="btn btn-ghost" onclick="app.navigateToGoalSettings()" style="padding: var(--space-sm);">
            ⚙️ Settings
          </button>
        </div>

        <!-- Weekly Theme -->
        ${weeklyGoal.weeklyTheme ? `
          <div class="card mb-xl" style="border-left: 4px solid var(--color-accent-primary); background: rgba(99, 102, 241, 0.05);">
            <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-xs); text-transform: uppercase; letter-spacing: 1px;">Weekly Theme</div>
            <h2 style="font-size: var(--font-size-xl); margin-bottom: 0;">${sanitizeHTML(weeklyGoal.weeklyTheme)}</h2>
          </div>
        ` : ''}

        <!-- Focus Books (Elective) -->
        ${weeklyGoal.electiveBooks && weeklyGoal.electiveBooks.length > 0 ? `
          <div class="card mb-xl">
            <h3 style="margin-bottom: var(--space-md); font-size: var(--font-size-base);">Weekly Focus</h3>
            <div style="display: grid; gap: var(--space-sm);">
              ${weeklyGoal.electiveBooks.map(id => {
      const book = bookRepository.getById(id);
      if (!book) return '';
      return `
                  <div style="display: flex; align-items: center; gap: var(--space-md); background: var(--color-bg-tertiary); padding: var(--space-sm); border-radius: var(--radius-sm);">
                    <div style="width: 30px; height: 45px; background: var(--color-bg-secondary); border-radius: 2px; overflow: hidden; flex-shrink: 0;">
                      ${book.coverUrl ? `<img src="${book.coverUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : '📕'}
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <div style="font-size: var(--font-size-sm); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${sanitizeHTML(book.title)}</div>
                      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${book.progress}% complete</div>
                    </div>
                  </div>
                `;
    }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Weekly Summary -->
        <div class="card mb-xl text-center" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));">
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-xs);">OVERALL PROGRESS</p>
          <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm);">
            ${Math.floor((progress.pages.percentage + progress.sessions.percentage) / 2)}%
          </div>
          <p style="font-size: var(--font-size-base); color: var(--color-text-tertiary);">Mechanical Target Completion</p>
        </div>

        <!-- Pages Goal -->
        <div class="card mb-lg">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <h3>Pages Read</h3>
            <span style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-accent-primary);">
              ${progress.pages.current} / ${progress.pages.target}
            </span>
          </div>
          <div class="progress-bar" style="height: 12px; margin-bottom: var(--space-sm);">
            <div class="progress-fill" style="width: ${progress.pages.percentage}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
            <span>${progress.pages.percentage}% of goal</span>
            <span>${weeklyGoal.pagesTarget - progress.pages.current} pages left</span>
          </div>
        </div>

        <!-- Sessions Goal -->
        <div class="card mb-xl">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
            <h3>Reading Sessions</h3>
            <span style="font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-accent-secondary);">
              ${progress.sessions.current} / ${progress.sessions.target}
            </span>
          </div>
          <div class="progress-bar" style="height: 12px; margin-bottom: var(--space-sm);">
            <div class="progress-fill" style="width: ${progress.sessions.percentage}%; background: var(--color-accent-secondary);"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: var(--font-size-xs); color: var(--color-text-tertiary);">
            <span>${progress.sessions.percentage}% of goal</span>
            <span>${weeklyGoal.sessionsTarget - progress.sessions.current} sessions left</span>
          </div>
        </div>

        <!-- Pacing Suggestion -->
        <div class="card" style="border-left: 4px solid var(--color-accent-primary);">
          <h4 style="margin-bottom: var(--space-xs);">Recommended Pace</h4>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            To hit your goal by the end of the week, you should aim for:
          </p>
          <div style="display: flex; gap: var(--space-xl); margin-top: var(--space-md);">
            <div>
              <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${suggestedPace ? suggestedPace.pagesPerDay : 0}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">PAGES / DAY</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${stats.weeklyPagesRead > 0 && suggestedPace ? formatDuration(stats.totalReadingTime / stats.totalPagesRead * suggestedPace.pagesPerDay) : '30m'}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">EST. TIME / DAY</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Global instance
const goalProgressView = new GoalProgressView();
