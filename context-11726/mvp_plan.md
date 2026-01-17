# Qurtas MVP - Technical Plan

## MVP Scope: Reading Journey Tracking

### Core User Journey
1. **Add a Book** - User manually enters book details (title, author, total pages)
2. **Start a Reading Session** - User indicates they're starting to read
3. **Log Progress** - User records pages read during the session
4. **Write Post-Session Notes** - Brief reflection after each session
5. **View Reading History** - Timeline of all sessions and progress

### Out of Scope for MVP
- Book API integration (Google Books, OpenLibrary)
- Social features/discussions
- Syllabus creator
- Completion debriefs (can add post-MVP)
- User accounts/cloud sync (local-only for now)

---

## Tech Stack Recommendation

### Option A: Vanilla JavaScript (Recommended for You)
**Pros:**
- No build tools needed initially
- Easier to understand and debug
- Lighter weight, faster load times
- You likely have HTML/CSS/JS foundation already

**Cons:**
- More manual work for state management
- No component reusability out of the box

### Option B: React with Vite
**Pros:**
- Component-based architecture
- Better scalability
- Rich ecosystem

**Cons:**
- Build tooling complexity
- Steeper learning curve

**My recommendation: Start with Vanilla JS**, then migrate to React if the app grows significantly.

### Core Technologies
- **HTML/CSS/JavaScript** - Core app logic
- **LocalStorage** - Data persistence (upgrade to IndexedDB if needed)
- **Service Worker** - PWA offline capabilities
- **CSS Grid/Flexbox** - Responsive mobile layouts
- **Google Fonts** - Typography (Inter or Outfit)

---

## Data Model

### Book
```javascript
{
  id: "uuid",
  title: "The Pragmatic Programmer",
  author: "Andy Hunt, Dave Thomas",
  totalPages: 352,
  currentPage: 127,
  status: "reading", // reading, completed, dropped
  dateAdded: "2026-01-15T19:05:00Z",
  sessions: [sessionId1, sessionId2]
}
```

### Reading Session
```javascript
{
  id: "uuid",
  bookId: "book-uuid",
  startTime: "2026-01-15T19:00:00Z",
  endTime: "2026-01-15T19:45:00Z",
  pagesRead: 15,
  startPage: 112,
  endPage: 127,
  notes: "Great chapter on DRY principle. Need to review examples again.",
  mood: "productive" // optional: productive, challenging, enjoyable
}
```

---

## Project Structure

```
qurtas/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   ├── reset.css          # CSS reset
│   ├── variables.css      # Design tokens (colors, spacing)
│   └── styles.css         # Main styles
├── js/
│   ├── app.js             # Main app logic
│   ├── storage.js         # LocalStorage wrapper
│   ├── models/
│   │   ├── Book.js
│   │   └── Session.js
│   └── views/
│       ├── BookList.js
│       ├── SessionTracker.js
│       └── SessionHistory.js
└── assets/
    └── icons/             # PWA icons
```

---

## Development Phases

### Phase 1: Setup (Day 1)
- Create project structure
- Set up basic HTML shell
- Configure PWA manifest
- Create design system (colors, typography, spacing)

### Phase 2: Book Management (Days 2-3)
- Add book form
- Book list view
- LocalStorage integration
- Basic book details page

### Phase 3: Session Tracking (Days 4-6)
- Session start/stop interface
- Progress input (pages read)
- Post-session notes form
- Session history view

### Phase 4: Progress Visualization (Days 7-8)
- Reading progress bar per book
- Session timeline
- Basic statistics (pages per session, total reading time)

### Phase 5: PWA Features (Days 9-10)
- Service worker implementation
- Offline functionality
- iOS install instructions
- App icons and splash screens

### Phase 6: Polish (Days 11-14)
- Mobile UX refinement
- Animations and transitions
- iOS testing and fixes
- Performance optimization

---

## Design Principles

### Mobile-First
- Touch-friendly buttons (min 44px tap targets)
- Bottom navigation for thumbs
- Minimal text input
- Clear visual hierarchy

### Minimal Friction
- Quick session logging (< 30 seconds)
- Auto-save everything
- No login required
- Forgiving UX (undo actions)

### Beautiful & Premium
- Dark mode by default (better for evening reading)
- Smooth animations
- Modern typography
- Curated color palette (avoid generic blues/reds)

---

## Key Questions to Resolve

1. **Session Tracking Method**: Should users enter page ranges (112-127) or just "pages read" (15)?
2. **Notes Format**: Free-form text or structured prompts ("What stood out?", "Key takeaways?")?
3. **Reading Goals**: Should MVP include daily/weekly reading goals, or focus purely on tracking?
4. **Book Discovery**: For MVP, manual entry only, or integrate with OpenLibrary API for metadata?

---

## Success Metrics for MVP

- **Usability**: Can a new user add a book and log a session in < 2 minutes?
- **Retention**: Do users return to log subsequent sessions?
- **Value**: Do users find post-session notes helpful for continuity?
- **Technical**: Does it work offline? Is it installable on iOS?

---

## Next Steps

1. **Review this plan** - Discuss any concerns or adjustments
2. **Answer key questions** - Clarify session tracking approach, notes format, etc.
3. **Create wireframes** - Sketch core screens (book list, session tracker, history)
4. **Begin Phase 1** - Set up project structure and design system
