// Weekly Goal Model

class WeeklyGoal {
    constructor({
        weekStart = getStartOfWeek().toISOString(),
        pagesTarget = 0,
        sessionsTarget = 0
    }) {
        this.weekStart = weekStart;
        this.pagesTarget = pagesTarget;
        this.sessionsTarget = sessionsTarget;
    }

    // Check if this goal is for the current week
    get isCurrentWeek() {
        const goalWeekStart = new Date(this.weekStart);
        const currentWeekStart = getStartOfWeek();
        return goalWeekStart.getTime() === currentWeekStart.getTime();
    }

    // Get progress against goals for given sessions
    getProgress(sessions) {
        // Filter sessions for this week
        const weekStart = new Date(this.weekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const weekSessions = sessions.filter(s => {
            const sessionDate = new Date(s.startTime);
            return sessionDate >= weekStart && sessionDate < weekEnd;
        });

        // Calculate current progress
        const currentPages = weekSessions.reduce((sum, s) => {
            const session = s instanceof Session ? s : Session.fromJSON(s);
            return sum + session.pagesRead;
        }, 0);

        const currentSessions = weekSessions.length;

        // Calculate percentages
        const pagesPercentage = this.pagesTarget > 0
            ? Math.min(100, Math.round((currentPages / this.pagesTarget) * 100))
            : 0;

        const sessionsPercentage = this.sessionsTarget > 0
            ? Math.min(100, Math.round((currentSessions / this.sessionsTarget) * 100))
            : 0;

        return {
            pages: {
                current: currentPages,
                target: this.pagesTarget,
                percentage: pagesPercentage,
                remaining: Math.max(0, this.pagesTarget - currentPages),
                achieved: currentPages >= this.pagesTarget
            },
            sessions: {
                current: currentSessions,
                target: this.sessionsTarget,
                percentage: sessionsPercentage,
                remaining: Math.max(0, this.sessionsTarget - currentSessions),
                achieved: currentSessions >= this.sessionsTarget
            },
            overall: {
                percentage: Math.round((pagesPercentage + sessionsPercentage) / 2),
                allAchieved: currentPages >= this.pagesTarget && currentSessions >= this.sessionsTarget
            }
        };
    }

    // Get days remaining in the week
    getDaysRemaining() {
        const weekStart = new Date(this.weekStart);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const now = new Date();
        const diffTime = weekEnd - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return Math.max(0, diffDays);
    }

    // Calculate suggested daily pace to reach goals
    getSuggestedPace(currentProgress) {
        const daysRemaining = this.getDaysRemaining();
        if (daysRemaining === 0) return null;

        const pagesRemaining = Math.max(0, this.pagesTarget - currentProgress.pages.current);
        const sessionsRemaining = Math.max(0, this.sessionsTarget - currentProgress.sessions.current);

        return {
            pagesPerDay: Math.ceil(pagesRemaining / daysRemaining),
            sessionsPerDay: Math.ceil(sessionsRemaining / daysRemaining)
        };
    }

    // Update goals
    updateGoals(pagesTarget = null, sessionsTarget = null) {
        if (pagesTarget !== null) this.pagesTarget = pagesTarget;
        if (sessionsTarget !== null) this.sessionsTarget = sessionsTarget;
    }

    // Convert to plain object for storage
    toJSON() {
        return {
            weekStart: this.weekStart,
            pagesTarget: this.pagesTarget,
            sessionsTarget: this.sessionsTarget
        };
    }

    // Create from plain object
    static fromJSON(obj) {
        return new WeeklyGoal(obj);
    }

    // Create goal for current week
    static forCurrentWeek(pagesTarget = 0, sessionsTarget = 0) {
        return new WeeklyGoal({
            weekStart: getStartOfWeek().toISOString(),
            pagesTarget,
            sessionsTarget
        });
    }
}
