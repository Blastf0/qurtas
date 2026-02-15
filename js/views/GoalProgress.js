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
    const goalsData = storage.getGoals();
    const sessionsData = storage.getSessions();

    // Convert to models
    const weeklyGoal = WeeklyGoal.fromJSON(goalsData);
    const sessions = sessionsData.map(s => Session.fromJSON(s));

    const progress = weeklyGoal.getProgress(sessions);
    const stats = storage.getStats();

    this.container.innerHTML = `
      <div class="fade-in">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl);">
          <h1>Goal Tracking</h1>
          <button class="btn btn-ghost" onclick="app.navigateToGoalSettings()" style="padding: var(--space-sm);">
            ⚙️ Settings
          </button>
        </div>

        <!-- Weekly Summary -->
        <div class="card mb-xl text-center" style="background: linear-gradient(135deg, var(--color-accent-soft), var(--color-accent-soft-alt));">
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-xs);">WEEK OF ${formatDate(weeklyGoal.weekStart).toUpperCase()}</p>
          <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-sm);">
            ${Math.floor((progress.pages.percentage + progress.sessions.percentage) / 2)}%
          </div>
          <p style="font-size: var(--font-size-base);">Overall progress this week</p>
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
              <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${progress.pages.suggestedDaily}</div>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">PAGES / DAY</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${stats.weeklyPagesRead > 0 ? formatDuration(stats.totalReadingTime / stats.totalPagesRead * progress.pages.suggestedDaily) : '30m'}</div>
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
