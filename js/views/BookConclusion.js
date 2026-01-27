// Book Conclusion / Debrief View for Qurtas

class BookConclusionView {
    constructor() {
        this.container = null;
        this.book = null;
        this.type = null; // 'complete' or 'drop'
    }

    /**
     * Render the conclusion/debrief form
     * @param {HTMLElement} container 
     * @param {string} bookId 
     * @param {string} type 'complete' or 'drop'
     */
    render(container, bookId, type) {
        this.container = container;
        this.type = type;
        const bookData = storage.getBookById(bookId);

        if (!bookData) {
            app.navigateTo('library');
            return;
        }

        this.book = Book.fromJSON(bookData);

        this.container.innerHTML = `
      <div class="fade-in">
        <div style="text-align: center; margin-bottom: var(--space-xl);">
          <h1 style="margin-bottom: var(--space-xs);">${type === 'drop' ? 'Dropping Book' : 'Book Completed'}</h1>
          <p style="color: var(--color-text-secondary);">"${sanitizeHTML(this.book.title)}"</p>
        </div>

        <div class="card mb-xl" style="background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.2);">
          <h3 style="font-size: var(--font-size-base); margin-bottom: var(--space-xs); text-align: center;">The Reading Counselor's Debrief</h3>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-tertiary); text-align: center;">
            ${type === 'drop' ? 'Understanding why you\'re stopping helps us guide your future journey.' : 'Reflect on your journey through this book.'}
          </p>
        </div>

        ${this.renderPrompts()}

        <div style="margin-top: var(--space-2xl); margin-bottom: var(--space-2xl);">
          <button id="save-conclusion-btn" class="btn btn-primary btn-full" style="height: 60px; font-size: var(--font-size-lg);">
            💾 Save & Finalize
          </button>
          <button id="cancel-conclusion-btn" class="btn btn-ghost btn-full mt-sm">Cancel</button>
        </div>
      </div>
    `;

        this.setupEventListeners();
    }

    renderPrompts() {
        if (this.type === 'drop') {
            return `
        <div class="form-group slide-up">
          <label class="form-label">1. Why are you dropping this book?</label>
          <select id="drop-reason" class="form-input">
            <option value="uninteresting">Not interesting / Boring</option>
            <option value="difficult">Too difficult / Dense</option>
            <option value="timing">Not the right time for this</option>
            <option value="quality">Poor writing / Low quality</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="form-group slide-up" style="animation-delay: 100ms;">
          <label class="form-label">2. What did you gain from it so far?</label>
          <textarea id="gain-context" class="form-textarea" placeholder="Even a few pages might have left an impression..." rows="3"></textarea>
        </div>

        <div class="form-group slide-up" style="animation-delay: 200ms;">
          <label class="form-label">3. Would you return to it later?</label>
          <div style="display: flex; gap: var(--space-md);">
            <label style="flex: 1;"><input type="radio" name="return-later" value="yes"> Yes</label>
            <label style="flex: 1;"><input type="radio" name="return-later" value="no" checked> No</label>
          </div>
        </div>
      `;
        } else {
            return `
        <div class="form-group slide-up">
          <label class="form-label">1. What is your overall takeaway?</label>
          <textarea id="final-takeaway" class="form-textarea" placeholder="The main thing you'll remember..." rows="3"></textarea>
        </div>

        <div class="form-group slide-up" style="animation-delay: 100ms;">
          <label class="form-label">2. Final recommendation to yourself?</label>
          <p style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--space-sm);">Who should you be when you re-read this? Or should you avoid similar books?</p>
          <textarea id="final-advice" class="form-textarea" placeholder="Advice for your future self..." rows="3"></textarea>
        </div>
      `;
        }
    }

    setupEventListeners() {
        const saveBtn = document.getElementById('save-conclusion-btn');
        const cancelBtn = document.getElementById('cancel-conclusion-btn');

        saveBtn.addEventListener('click', () => {
            const notes = {};
            if (this.type === 'drop') {
                notes.reason = document.getElementById('drop-reason').value;
                notes.gains = document.getElementById('gain-context').value.trim();
                notes.returnLater = document.querySelector('input[name="return-later"]:checked').value === 'yes';

                this.book.status = 'dropped';
            } else {
                notes.takeaway = document.getElementById('final-takeaway').value.trim();
                notes.advice = document.getElementById('final-advice').value.trim();

                this.book.markCompleted();
            }

            this.book.conclusionNotes = notes;
            storage.updateBook(this.book.id, this.book.toJSON());

            showToast(this.type === 'drop' ? 'Book dropped with debrief 📝' : 'Book marked as completed! 🎉', 'success');
            app.navigateTo('library');
        });

        cancelBtn.addEventListener('click', () => {
            app.navigateToDetail(this.book.id);
        });
    }
}

// Global instance
const bookConclusionView = new BookConclusionView();
