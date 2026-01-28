// Repository for Weekly Goals and Settings

class GoalRepository {
    constructor(storage) {
        this.storage = storage;
    }

    getGoals() {
        return this.storage.getGoals();
    }

    setGoals(goals) {
        return this.storage.setGoals(goals);
    }

    getSettings() {
        return this.storage.getSettings();
    }

    updateSettings(updates) {
        return this.storage.updateSettings(updates);
    }
}

const goalRepository = new GoalRepository(storage);
