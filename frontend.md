# Frontend Documentation

## Overview
The frontend is built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, and shadcn/ui components. All data persistence is handled via LocalStorage (no backend database).

## Pages

### `/` - Dashboard (`app/page.tsx`)
**What it does:** Main landing page that displays the current big task, subtasks, and active timer sessions.

**What it contains:**
- Current task display
- Subtask list with status indicators
- Pomodoro timer (when session is active)
- Reflection modal integration
- Navigation to create new tasks and view history

**How it works:**
1. On mount, loads current task from LocalStorage
2. If no task exists, shows welcome screen with "Create First Task" button
3. Displays subtasks with status (pending/in_progress/done)
4. When user starts a session, shows timer component
5. On timer completion, opens reflection modal
6. After reflection submission, saves session to LocalStorage and updates subtask status

**What you can change safely:**
- UI layout and styling
- Button labels and text
- Card component arrangements
- Color schemes (via Tailwind classes)

**What to avoid:**
- Don't modify the LocalStorage key names (`focusflow-current-task`, `focusflow-sessions`)
- Don't change the data structure of `CurrentTask` or `Subtask` without updating `lib/storage.ts`
- Don't remove the `useEffect` that loads the current task on mount

**Impact of modifications:**
- Changing layout won't affect functionality
- Modifying data structures will break LocalStorage compatibility
- Removing state management will break the app flow

---

### `/new` - Create New Task (`app/new/page.tsx`)
**What it does:** Page for creating a new big task and generating subtasks via AI.

**What it contains:**
- Text input for big task
- Submit button that calls `/api/subtasks`
- Loading state during AI generation
- Error handling

**How it works:**
1. User enters a big task description
2. On submit, calls `/api/subtasks` with the task
3. AI returns 3-7 subtask titles
4. Converts titles to `Subtask` objects with unique IDs
5. Saves to LocalStorage as `CurrentTask`
6. Redirects to dashboard

**What you can change safely:**
- Input placeholder text
- Form validation messages
- Loading spinner/UI
- Error message display

**What to avoid:**
- Don't change the API endpoint path
- Don't modify the data structure returned from API
- Don't remove the redirect after successful creation

**Impact of modifications:**
- UI changes are safe
- Changing API contract will break subtask generation
- Removing redirect will leave user on the form page

---

### `/history` - Session History (`app/history/page.tsx`)
**What it does:** Displays all past focus sessions with AI feedback.

**What it contains:**
- List of session cards
- Clear history button
- Empty state message

**How it works:**
1. Loads all sessions from LocalStorage on mount
2. Sorts by timestamp (newest first)
3. Renders `SessionCard` for each session
4. Provides clear history functionality

**What you can change safely:**
- Sorting order (newest/oldest)
- Empty state message
- Card layout and styling
- Date formatting (uses `date-fns`)

**What to avoid:**
- Don't change the LocalStorage key
- Don't modify the `Session` type structure
- Don't remove the confirmation dialog for clearing history

**Impact of modifications:**
- UI changes are safe
- Changing data structure will break session display
- Removing confirmation could lead to accidental data loss

---

## Components

### `Timer.tsx`
**What it does:** Pomodoro timer component with 25-minute countdown.

**What it contains:**
- Countdown display (MM:SS format)
- Start/Pause/Reset buttons
- Progress bar
- Completion callback

**How it works:**
1. Initializes with 25 minutes (1500 seconds)
2. Uses `setInterval` to decrement every second
3. On completion, calls `onComplete` callback
4. Progress bar shows visual progress

**What you can change safely:**
- Timer duration (change `POMODORO_DURATION` constant)
- Button icons (from `lucide-react`)
- Display format (currently MM:SS)
- Progress bar styling

**What to avoid:**
- Don't remove the cleanup in `useEffect` (prevents memory leaks)
- Don't modify the interval logic without proper cleanup
- Don't change the `onComplete` callback signature

**Impact of modifications:**
- Changing duration is safe
- Removing cleanup will cause memory leaks
- Breaking the callback will prevent reflection modal from opening

---

### `ReflectionModal.tsx`
**What it does:** Modal for user reflection after a focus session, with AI feedback.

**What it contains:**
- Textarea for session notes
- Yes/No buttons for completion status
- AI feedback display (drift warning, next step, encouragement)
- Two-step flow: input → AI response

**How it works:**
1. User enters notes and selects finished status
2. On submit, calls `/api/reflection` with user input
3. Displays AI response in a card
4. Calls `onSubmit` callback with AI response
5. Parent component saves session to LocalStorage

**What you can change safely:**
- Modal styling and layout
- Input field labels
- AI feedback card design
- Button text

**What to avoid:**
- Don't change the API endpoint
- Don't modify the `onSubmit` callback signature
- Don't remove the AI response structure
- Don't change the two-step flow (input → feedback)

**Impact of modifications:**
- UI changes are safe
- Changing callback signature will break parent component
- Removing AI call will break the reflection feature

---

### `SubtaskList.tsx`
**What it does:** Displays list of subtasks with status indicators and action buttons.

**What it contains:**
- Status icons (pending/in_progress/done)
- Subtask titles
- Start/Continue buttons
- Color-coded cards based on status

**How it works:**
1. Maps over subtasks array
2. Renders card for each subtask
3. Shows appropriate icon and color based on status
4. Calls `onStartSession` when user clicks button

**What you can change safely:**
- Icon choices (from `lucide-react`)
- Color schemes for each status
- Button text ("Start" vs "Continue")
- Card layout

**What to avoid:**
- Don't change the status enum values ("pending" | "in_progress" | "done")
- Don't modify the `onStartSession` callback
- Don't remove the status-based styling logic

**Impact of modifications:**
- Visual changes are safe
- Changing status values will break type safety
- Removing callback will break session starting

---

### `SessionCard.tsx`
**What it does:** Displays a single session with all details and AI feedback.

**What it contains:**
- Timestamp (formatted with `date-fns`)
- Big task and subtask titles
- User notes
- AI feedback (drift warning, next step, encouragement)

**How it works:**
1. Receives `Session` object as prop
2. Formats timestamp using `date-fns`
3. Conditionally renders drift warning if present
4. Displays all session information

**What you can change safely:**
- Date format (change `format` call)
- Card layout and styling
- Text sizes and colors
- Section ordering

**What to avoid:**
- Don't change the `Session` type structure
- Don't remove required fields
- Don't modify date formatting without handling edge cases

**Impact of modifications:**
- UI changes are safe
- Changing data structure will break rendering
- Removing fields will hide important information

---

## UI Components (shadcn/ui)

All UI components are in `components/ui/`:
- `button.tsx` - Button with variants
- `card.tsx` - Card container with header/content/footer
- `dialog.tsx` - Modal dialog component
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input

**What you can change safely:**
- Styling and colors (via Tailwind classes)
- Variant names and styles
- Component structure (as long as props match)

**What to avoid:**
- Don't change component prop interfaces without updating all usages
- Don't remove required props
- Don't break accessibility features

---

## Styling

### Tailwind Configuration
- Uses Tailwind CSS v4
- Custom colors defined in `app/globals.css`
- Light mode only (no dark mode toggle)

**What you can change safely:**
- Color palette
- Font sizes
- Spacing values
- Component-specific styles

**What to avoid:**
- Don't remove Tailwind imports
- Don't break the CSS variable system
- Don't modify base Tailwind configuration without understanding impact

---

## State Management

All state is managed via:
1. React `useState` hooks in components
2. LocalStorage for persistence
3. No global state management library (Redux, Zustand, etc.)

**What you can change safely:**
- Add new state variables
- Change state update logic
- Add new LocalStorage keys (if needed)

**What to avoid:**
- Don't change existing LocalStorage key names
- Don't modify data structures without migration logic
- Don't remove state persistence

---

## Suggestions for Improvement

1. **Add error boundaries** - Wrap pages in error boundaries for better error handling
2. **Add loading skeletons** - Replace loading spinners with skeleton screens
3. **Add keyboard shortcuts** - Add shortcuts for common actions (e.g., space to pause timer)
4. **Improve accessibility** - Add ARIA labels and keyboard navigation
5. **Add animations** - Smooth transitions for modal open/close and state changes
6. **Add sound notifications** - Optional sound when timer completes
7. **Add task editing** - Allow users to edit subtasks after creation
8. **Add task deletion** - Allow users to delete subtasks
9. **Add export functionality** - Export sessions to JSON/CSV
10. **Add statistics** - Show completion rates, time spent, etc.

