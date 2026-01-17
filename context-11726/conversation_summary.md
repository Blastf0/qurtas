# Qurtas Development - Conversation Summary
**Date:** January 15-17, 2026  
**Session:** Initial MVP Planning

---

## Context
Building **Qurtas** (formerly Litra) - a platform that enables users to read better, not just more. The platform acts as a reading counselor that guides users through their reading journey.

### Core Vision
- Help users discover relevant literature
- Accompany them through their reading journey
- Improve comprehension and internalization
- Highlight achievements and outcomes

---

## Key Decisions Made

### 1. Core Features for MVP
**Primary Focus:** Reading Journey Tracking (RJT)  
**Secondary:** Discovery Engine (deferred for post-MVP)

The two were identified as the "concrete" of Qurtas, but RJT is the beating heart.

### 2. Platform Choice
**Decision:** Mobile-optimized Progressive Web App (PWA)

**Original Request:** Native iOS app  
**Recommendation Accepted:** PWA for faster iteration and validation

**Rationale:**
- Faster MVP timeline (2-4 weeks vs 3-6 months)
- Better match for current technical skill level
- Installable on iOS home screen
- Offline capabilities
- Can migrate to native iOS after validation

### 3. Technical Experience Level
- 2nd-3rd year CS undergrad equivalent
- Some coding comfort, but not entry-level SWE
- No prior technical research on book APIs or infrastructure

---

## MVP Scope: Reading Journey Tracking

### User Journey
1. **Add a Book** - Manual entry (title, author, total pages)
2. **Start Reading Session** - Begin tracking
3. **Log Progress** - Record pages read
4. **Post-Session Notes** - Brief reflections
5. **View History** - Timeline of sessions and progress

### Explicitly Out of Scope
- Book API integration (Google Books, OpenLibrary)
- Social features/discussions  
- Syllabus creator
- User accounts/cloud sync (local-only initially)
- Completion debriefs (post-MVP)

---

## Tech Stack

### Recommended Approach
**Vanilla JavaScript** - No build tools initially, easier to understand

### Core Technologies
- HTML/CSS/JavaScript
- LocalStorage for data persistence
- Service Worker for PWA offline capabilities
- CSS Grid/Flexbox for responsive layouts
- Google Fonts (Inter or Outfit)

### Alternative Considered
React with Vite - Deferred due to build complexity for skill level

---

## Data Models Proposed

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
  notes: "Great chapter on DRY principle...",
  mood: "productive" // optional
}
```

---

## Project Structure Proposed

```
qurtas/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── styles.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── models/
│   │   ├── Book.js
│   │   └── Session.js
│   └── views/
│       ├── BookList.js
│       ├── SessionTracker.js
│       └── SessionHistory.js
└── assets/
    └── icons/
```

---

## Development Timeline
**Estimated:** 14 days to functional MVP

1. **Phase 1:** Setup (Day 1)
2. **Phase 2:** Book Management (Days 2-3)
3. **Phase 3:** Session Tracking (Days 4-6)
4. **Phase 4:** Progress Visualization (Days 7-8)
5. **Phase 5:** PWA Features (Days 9-10)
6. **Phase 6:** Polish (Days 11-14)

---

## Design Principles Established

### Mobile-First
- Touch-friendly buttons (min 44px)
- Bottom navigation
- Minimal text input
- Clear visual hierarchy

### Minimal Friction
- Quick session logging (< 30 seconds)
- Auto-save everything
- No login required
- Forgiving UX

### Beautiful & Premium
- Dark mode by default
- Smooth animations
- Modern typography
- Curated color palette

---

## Outstanding Questions (Need Answers)

Before implementation begins, need decisions on:

1. **Session Tracking Method**  
   Option A: Enter page ranges (e.g., "112-127")  
   Option B: Enter pages read (e.g., "15 pages")

2. **Notes Format**  
   Option A: Free-form text box  
   Option B: Structured prompts ("What stood out?", "Key takeaways?")

3. **Reading Goals**  
   Should MVP include daily/weekly reading goals, or purely focus on tracking?

4. **Book Metadata**  
   Option A: Manual entry only  
   Option B: Integrate OpenLibrary API for auto-fill

---

## Documents Created

### In Artifacts Directory
Location: `/Users/majid/.gemini/antigravity/brain/889cac7a-7662-444f-b5ae-4f45103b2bee/`

1. **task.md** - Task checklist breakdown (6 phases)
2. **mvp_plan.md** - Comprehensive technical plan with architecture, data models, timeline

### In Project Directory
Location: `/Users/majid/Desktop/Personal Projects/qurtas/`

1. **qurtas_context.md** - Original vision document (pre-existing)
2. **README.md** - (pre-existing)
3. **conversation_summary.md** - This document

---

## Next Steps

1. ✅ **Review plan** - User accepted PWA approach
2. ⏸️ **Answer design questions** - Paused, awaiting responses
3. ⏸️ **Create wireframes** - Not started
4. ⏸️ **Begin Phase 1: Setup** - Not started

---

## Success Metrics Defined

- **Usability:** Can a new user add a book and log a session in < 2 minutes?
- **Retention:** Do users return to log subsequent sessions?
- **Value:** Do users find post-session notes helpful?
- **Technical:** Offline functionality + iOS installable?

---

## Conversation Tone & Approach

Per user rules:
- Top-down approach
- Engagement with pushback when needed
- Assumed audience: Engineering graduate, basic programming, no architecture knowledge
- Successfully pushed back on native iOS → accepted PWA recommendation

---

## To Resume This Conversation

When continuing on another device:
1. Review this summary
2. Answer the 4 outstanding design questions
3. Review mvp_plan.md and task.md in artifacts directory
4. Ready to begin Phase 1: Project Setup
