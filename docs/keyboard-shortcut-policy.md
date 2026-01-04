# Nestlog – Keyboard Shortcut Policy

This document defines the official keyboard shortcut policy for the Nestlog web application.
The goal is to improve efficiency for power users while maintaining a safe, accessible, and intuitive experience for all users.

---

## 1. Design Principles

### 1.1 Progressive Enhancement

Keyboard shortcuts are **optional enhancements**, not required to use the system.
All functionality must remain fully accessible via mouse/touch.

### 1.2 Predictability & Consistency

- Shortcuts must behave consistently across the entire application.
- Common conventions from modern web apps should be preferred over custom patterns.

### 1.3 Safety First

- Shortcuts must **never bypass validation**
- Destructive actions must **always require confirmation**
- Shortcuts must not trigger irreversible actions silently

### 1.4 Discoverability

- Display shortcuts in:
  - Tooltips
  - Help dialog (`?`)
- Do not rely on documentation alone

### 1.5 Platform Awareness

- `Ctrl` on Windows/Linux
- `Cmd` on macOS
- Documentation should refer to `Ctrl / Cmd`

---

## 2. Global Shortcuts

These shortcuts are available throughout the application unless a focused input explicitly overrides them.

| Shortcut         | Action                      | Notes                           |
| ---------------- | --------------------------- | ------------------------------- |
| `Ctrl / Cmd + S` | Save current form           | Only when form is dirty & valid |
| `Esc`            | Close modal / cancel edit   | Highest priority                |
| `/`              | Focus global search         | Ignored when typing in inputs   |
| `?`              | Open keyboard shortcut help | Non-modal preferred             |
| `Ctrl / Cmd + K` | Open command palette        | Optional / future               |

---

## 3. Form Shortcuts

### 3.1 Submission

| Focused Input Type            | Shortcut             | Behavior |
| ----------------------------- | -------------------- | -------- |
| Single-line input (`input`)   | `Enter`              | Submit   |
| Multi-line input (`textarea`) | `Enter`              | New line |
| Any form (explicit intent)    | `Ctrl / Cmd + Enter` | Submit   |

**Rules**

- `Ctrl / Cmd + Enter` submits the form regardless of input type
- `Enter` submits only when focus is in a single-line input
- Submission is blocked if the form is invalid
- Validation errors must be surfaced immediately

---

### 3.2 Cancellation

| Shortcut | Action                   |
| -------- | ------------------------ |
| `Esc`    | Cancel edit / close form |

**Rules**

- Warn about unsaved changes when applicable
- Never discard silently

---

## 4. Navigation Shortcuts

### 4.1 Lists & Tables

| Shortcut     | Action              |
| ------------ | ------------------- |
| `↑ / ↓`      | Navigate items      |
| `Enter`      | Open selected item  |
| `Home / End` | Jump to start / end |

**Rules**

- Only enabled when list selection is visually clear
- Must not interfere with native browser scrolling

---

### 4.2 Quick Actions (Optional)

| Shortcut         | Action               |
| ---------------- | -------------------- |
| `Ctrl / Cmd + K` | Open command palette |

**Use cases**

- Create Property
- Create Room
- Add Asset
- Jump to recent items

---

## 5. Editing Shortcuts

| Shortcut             | Action           |
| -------------------- | ---------------- |
| `Ctrl / Cmd + Z`     | Undo             |
| `Ctrl / Cmd + Y`     | Redo             |
| `Ctrl / Cmd + Enter` | Save inline edit |

---

## 6. Destructive Actions

### 6.1 Delete

| Shortcut | Action         |
| -------- | -------------- |
| `Delete` | Request delete |

**Rules**

- Always show confirmation dialog
- Display target clearly
- Never execute immediately

---

## 7. Accessibility Guidelines

- All shortcuts must be:
  - Screen reader compatible
  - Focus-aware
- Shortcuts must be disabled when:
  - A modal is blocking
  - An input explicitly consumes the key
- Avoid conflicts with:
  - Browser shortcuts
  - Assistive technologies

---

## 8. Implementation Guidelines

### 8.1 Centralized Handling

- Register shortcuts through a single abstraction
- Context-aware activation (Global / Form / Modal)

### 8.2 Graceful Degradation

- Shortcuts must fail silently if unavailable
- No console errors on unsupported platforms

### 8.3 Testing Requirements

- Unit tests for shortcut handlers
- E2E tests for critical flows (Create / Save / Cancel)

---

## 9. Future Considerations

- User-configurable shortcuts
- Shortcut onboarding hints
- Power-user mode toggle

---

## 10. Summary

This policy ensures:

- Familiar shortcuts for power users
- Safe defaults for all users
- Consistent, maintainable implementation

Keyboard shortcuts are a **product quality multiplier**, not a requirement.
