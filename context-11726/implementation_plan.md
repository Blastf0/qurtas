# Qurtas MVP - Implementation Plan

## Goal

Build a mobile-optimized Progressive Web App that enables users to track their reading journeys through session logging, structured reflections, and weekly goal tracking. The platform will act as a reading counselor that helps users read better, not just more.

---

## User Review Required

> [!IMPORTANT]
> **Book API Selection Required**
> We need to choose between Google Books API and OpenLibrary API for book search. Both have pros and cons:
> 
> **Google Books API:**
> - ✅ Richer metadata (ratings, reviews, better covers)
> - ✅ More reliable and faster
> - ✅ Better search results
> - ⚠️ Requires API key (free, but needs Google Cloud account)
> - ⚠️ Potential for service discontinuation
> 
> **OpenLibrary API:**
> - ✅ Completely free, no API key needed
> - ✅ Open-source, community-driven
> - ✅ No risk of discontinuation
> - ⚠️ Slightly less reliable metadata
> - ⚠️ Smaller catalog for some books
> 
> **My Recommendation:** Start with **Google Books API** for better UX, with fallback to OpenLibrary if we encounter API limits. We can easily swap later if needed.

> [!WARNING]
> **Scope Expansion Impact**
> The addition of API integration, structured prompts, and weekly goals has increased MVP complexity from 14 to **~18 days** of development. This is still manageable but requires careful execution.

---

## Proposed Changes

### Core Technologies

#### App Foundation
- **HTML5** - Semantic structure
- **CSS3** - Mobile-first responsive design with CSS Grid/Flexbox
- **Vanilla JavaScript (ES6+)** - Core app logic
- **LocalStorage** - Initial data persistence
- **Service Worker** - PWA offline capabilities

#### External APIs
- **[NEW] Google Books API** - Book search and metadata (with OpenLibrary fallback)
- **[NEW] Cover Images** - From API responses

#### Design System
- **Google Fonts** - Inter or Outfit for typography
- **Dark-first design** - Default dark mode optimized for evening reading
- **CSS Variables** - Centralized design tokens

---

### Application Architecture

#### [NEW] src/index.html
Main application shell with:
- Mobile viewport configuration
- PWA manifest link
- App container structure
- Bottom navigation bar

#### [NEW] src/manifest.json
PWA configuration:
- App name, icons, theme colors
- Display mode: standalone
- Start URL and scope
- iOS-specific meta tags

#### [NEW] src/sw.js
Service worker for:
- Offline-first caching strategy
- Cache API responses
- Fallback pages

---

### CSS Architecture

#### [NEW] src/css/reset.css
Modern CSS reset for consistent rendering

#### [NEW] src/css/variables.css
Design tokens:
```css
:root {
  /* Colors - Dark mode primary */
  --color-bg-primary: #0f0f0f;
  --color-bg-secondary: #1a1a1a;
  --color-accent: #6366f1; /* Indigo */
  --color-text-primary: #f5f5f5;
  --color-text-secondary: #a3a3a3;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  
  /* Touch targets */
  --touch-target-min: 44px;
}
```

#### [NEW] src/css/styles.css
Main styles:
- Mobile-first responsive layouts
- Component styles
- Animation utilities
- Touch-friendly interactions

---

### JavaScript Architecture

#### [NEW] src/js/app.js
Main application controller:
- Router for view switching
- Navigation handling
- State management
- View initialization

#### [NEW] src/js/storage.js
LocalStorage wrapper with:
```javascript
// Storage interface
class Storage {
  getBooks() // Get all books
  addBook(book) // Add new book
  updateBook(id, updates) // Update book
  deleteBook(id) // Delete book
  
  getSessions(bookId) // Get sessions for a book
  addSession(session) // Add new session
  
  getGoals() // Get weekly goals
  setGoals(goals) // Update goals
}
```

#### [NEW] src/js/api/bookSearch.js
Book API integration:
```javascript
class BookSearch {
  async search(query) {
    // Try Google Books API first
    // Fallback to OpenLibrary if needed
    // Return normalized book data
  }
  
  async getBookByISBN(isbn) {
    // Lookup by ISBN
  }
  
  normalizebook(apiResponse) {
    // Convert API response to our Book model
  }
}
```

#### [NEW] src/js/models/Book.js
Book model and methods:
```javascript
class Book {
  constructor({
    id = generateUUID(),
    title,
    author,
    totalPages,
    coverUrl = null,
    isbn = null,
    currentPage = 0,
    status = 'reading', // reading, completed, dropped
    dateAdded = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.totalPages = totalPages;
    this.coverUrl = coverUrl;
    this.isbn = isbn;
    this.currentPage = currentPage;
    this.status = status;
    this.dateAdded = dateAdded;
  }
  
  get progress() {
    return (this.currentPage / this.totalPages) * 100;
  }
  
  updateProgress(endPage) {
    this.currentPage = endPage;
  }
}
```

#### [NEW] src/js/models/Session.js
Reading session model:
```javascript
class Session {
  constructor({
    id = generateUUID(),
    bookId,
    startTime = new Date().toISOString(),
    endTime = null,
    startPage,
    endPage,
    notes = {
      whatStoodOut: '',
      keyIdeas: '',
      questionsRaised: ''
    }
  }) {
    this.id = id;
    this.bookId = bookId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.startPage = startPage;
    this.endPage = endPage;
    this.notes = notes;
  }
  
  get pagesRead() {
    return this.endPage - this.startPage;
  }
  
  get duration() {
    // Calculate reading duration in minutes
    if (!this.endTime) return 0;
    return Math.round((new Date(this.endTime) - new Date(this.startTime)) / 60000);
  }
}
```

#### [NEW] src/js/models/WeeklyGoal.js
Weekly reading goals:
```javascript
class WeeklyGoal {
  constructor({
    weekStart = getStartOfWeek(),
    pagesTarget = 0,
    sessionsTarget = 0
  }) {
    this.weekStart = weekStart;
    this.pagesTarget = pagesTarget;
    this.sessionsTarget = sessionsTarget;
  }
  
  getProgress(sessions) {
    // Calculate progress against goals
    const weekSessions = sessions.filter(s => isInCurrentWeek(s.startTime));
    const pagesRead = weekSessions.reduce((sum, s) => sum + s.pagesRead, 0);
    
    return {
      pages: { current: pagesRead, target: this.pagesTarget, percentage: (pagesRead / this.pagesTarget) * 100 },
      sessions: { current: weekSessions.length, target: this.sessionsTarget, percentage: (weekSessions.length / this.sessionsTarget) * 100 }
    };
  }
}
```

---

### Views

#### [NEW] src/js/views/BookSearch.js
Book search interface:
- Search bar with API integration
- Search results list with covers
- "Add manually" fallback button
- Manual entry form

#### [MODIFY] src/js/views/BookList.js
Enhanced book library view:
- Book cards with cover images
- Progress bars
- Status badges (reading/completed/dropped)
- Sort/filter options

#### [NEW] src/js/views/SessionTracker.js
Active reading session interface:
- Session timer
- Page range inputs (start → end page)
- "End session" button
- Auto-save state

#### [NEW] src/js/views/SessionReview.js
Structured post-session notes:
- Three prompt sections:
  1. "What stood out to you?"
  2. "What were the key ideas?"
  3. "What questions did this raise?"
- Auto-save notes
- "Complete" button to finish session

#### [NEW] src/js/views/SessionHistory.js
Timeline of reading sessions:
- Chronological session list
- Date/time, pages read, duration
- Expandable notes sections
- Visual progress timeline

#### [NEW] src/js/views/GoalSettings.js
Weekly goal configuration:
- Pages per week slider/input
- Sessions per week input
- Save goals

#### [NEW] src/js/views/GoalProgress.js
Current week progress dashboard:
- Circular progress indicators
- Days remaining in week
- Current vs target
- Session streak counter

---

### Updated Project Structure

```
qurtas/
├── index.html
├── manifest.json
├── sw.js
├── .gitignore
├── README.md
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── styles.css
├── js/
│   ├── app.js                    # Main controller
│   ├── storage.js                # Data persistence
│   ├── utils.js                  # Helper functions
│   ├── api/
│   │   └── bookSearch.js         # Book API integration
│   ├── models/
│   │   ├── Book.js
│   │   ├── Session.js
│   │   └── WeeklyGoal.js
│   └── views/
│       ├── BookSearch.js
│       ├── BookList.js
│       ├── BookDetail.js
│       ├── SessionTracker.js
│       ├── SessionReview.js
│       ├── SessionHistory.js
│       ├── GoalSettings.js
│       └── GoalProgress.js
└── assets/
    ├── icons/                    # PWA icons (various sizes)
    └── images/
        └── placeholder-cover.png # Fallback book cover
```

---

## Verification Plan

### Automated Tests

We won't build a full test suite for the MVP, but will manually verify:

1. **Book Search**
   ```javascript
   // Test in browser console
   const search = new BookSearch();
   search.search('The Pragmatic Programmer').then(console.log);
   ```

2. **Session Tracking**
   - Start session → verify timer starts
   - Log page range → verify calculation
   - Complete session → verify notes saved
   - Check LocalStorage → verify data persisted

3. **Weekly Goals**
   - Set goals → verify saved
   - Complete sessions → verify progress updates
   - New week → verify goals reset

4. **Offline Functionality**
   - Open app online
   - Go offline (airplane mode)
   - Navigate app → verify still works
   - Test cached views and data

### Manual Verification

#### iOS Safari Testing (Critical for PWA)
- [ ] Open in Safari on iPhone
- [ ] Share → Add to Home Screen
- [ ] Launch from home screen (verify opens in standalone mode)
- [ ] Test all features work in standalone mode
- [ ] Verify offline works
- [ ] Test touch interactions (44px targets)
- [ ] Verify dark mode renders correctly

#### User Flow Testing
1. **New user onboarding:**
   - Search for a book
   - Add book to library
   - Start first reading session
   - Complete session with notes
   - Set weekly goal

2. **Returning user flow:**
   - View book library
   - Continue reading existing book
   - View session history
   - Check goal progress

#### Performance Testing
- [ ] Page load time < 2 seconds on 3G
- [ ] Smooth animations (60fps)
- [ ] Search results appear < 1 second
- [ ] No jank while scrolling

---

## Revised Timeline: 18 Days

### Phase 1: Setup (Days 1-2)
- Day 1: Project structure, manifest, service worker skeleton
- Day 2: Design system (CSS variables, reset, base styles)

### Phase 2: Book Discovery (Days 3-5)
- Day 3: Book API integration (Google Books)
- Day 4: Search UI and results display
- Day 5: Manual entry fallback, book list view

### Phase 3: Session Tracking (Days 6-9)
- Day 6: Session start/stop, page range input
- Day 7: Structured post-session prompts UI
- Day 8: Session history view
- Day 9: Progress visualization

### Phase 4: Weekly Goals (Days 10-12)
- Day 10: Goal setting interface
- Day 11: Goal progress tracking logic
- Day 12: Progress dashboard UI

### Phase 5: PWA Features (Days 13-15)
- Day 13: Service worker implementation
- Day 14: Offline functionality
- Day 15: iOS installation flow, icons

### Phase 6: Polish & Testing (Days 16-18)
- Day 16: Mobile UX refinement, animations
- Day 17: iOS Safari testing and fixes
- Day 18: Performance optimization, final testing

---

## Key Technical Decisions

### 1. Book API Strategy
- **Primary:** Google Books API v1
- **Endpoint:** `https://www.googleapis.com/books/v1/volumes?q={query}`
- **Free tier:** 1,000 requests/day (sufficient for MVP)
- **Fallback:** OpenLibrary API if rate limited

### 2. Data Persistence
- **MVP:** LocalStorage (5-10MB limit, sufficient for hundreds of books)
- **Future:** IndexedDB for larger datasets and better performance
- **No cloud sync in MVP** - fully local

### 3. Offline Strategy
- **Service Worker:** Cache-first for static assets
- **Data:** Already local via LocalStorage
- **API calls:** Network-first with fallback message

### 4. Mobile Optimization
- **Bottom navigation:** Thumb-friendly zone
- **Large touch targets:** Minimum 44px
- **Minimal typing:** Use pickers and sliders where possible
- **Auto-save:** Never require explicit "Save" button

### 5. Session Notes Structure
Three focused prompts to encourage active recall:
1. **"What stood out?"** - Memorable moments
2. **"Key ideas?"** - Main takeaways
3. **"Questions raised?"** - Areas for further exploration

This structure is based on active recall best practices and helps users meaningfully engage with content.

---

## Success Metrics

- ✅ User can find and add a book in < 60 seconds
- ✅ User can log a session in < 90 seconds
- ✅ Structured prompts feel helpful, not burdensome
- ✅ App works perfectly offline
- ✅ Installable on iOS home screen
- ✅ Weekly goals motivate continued use

---

## Next Steps

1. **API Key Setup** - Create Google Cloud project and enable Books API
2. **Repository Setup** - Initialize git repository, add .gitignore
3. **Begin Phase 1** - Create project structure and design system
4. **Wireframe Core Flows** - Sketch key screens (optional but recommended)
