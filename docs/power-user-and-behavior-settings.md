# Nestlog – Power User & Behavior Settings

This document defines configurable settings in Nestlog, grouped by **ownership and intent**:

- **User Preferences** – persisted per user
- **Workflow Preferences** – persisted per user, but scoped to productivity
- **System Behavior Rules** – application-level or contextual behavior
- **Safety & Feedback Controls** – user-tunable guardrails

---

## 1. User Preferences

Settings that represent **personal preference** and should always be persisted per user.

### 1.1 Keyboard & Interaction

- ☐ Enable keyboard shortcuts (default: ON)
- ☐ Require explicit submit (`Ctrl / Cmd + Enter` only)

**Notes**

- Disabling shortcuts must still allow `Esc` for modal dismissal
- Explicit submit applies only to forms with multiline inputs

---

### 1.2 Navigation & Density

- ☐ Compact UI density
- ☐ Default landing page
- ☐ Restore last visited page on startup

**Notes**

- Density changes spacing, not typography
- Landing preference should override deep links only on first load

---

### 1.3 Motion & Feedback

- ☐ Reduce animations
- ☐ Show save indicators (“Saved · 5s ago”)

**Notes**

- Respect system-level reduced-motion preferences when available

---

## 2. Workflow Preferences

Settings that optimize **how users work**, especially for repetitive tasks.

### 2.1 Productivity & Creation Flow

- ☐ Auto-focus first input when opening forms
- ☐ Restore last focused field when returning to a form
- ☐ Keep form open after “Create”
- ☐ Close form after “Create”

**Notes**

- “Keep open” and “Close after create” are mutually exclusive
- Default should favor “Close after create” for new users

---

### 2.2 Draft & Persistence

- ☐ Auto-save drafts
- ☐ Restore unsaved drafts on reload

**Notes**

- Drafts must never auto-submit
- Drafts should expire after a reasonable period

---

## 3. Search & Command Behavior

Settings related to **information access and navigation speed**.

### 3.1 Search Behavior

- ☐ Search as you type
- ☐ Require Enter to search

**Notes**

- Mutually exclusive
- Search-as-you-type should debounce and respect dataset size

---

### 3.2 Command Access

- ☐ Enable command palette (`Ctrl / Cmd + K`)
- ☐ Include recent items in command palette

**Notes**

- Command palette must remain optional
- Avoid surfacing destructive actions without confirmation

---

## 4. Safety & Validation Controls

Settings that balance **speed vs protection**.

### 4.1 Confirmation & Undo

- ☐ Require confirmation for destructive actions
- ☐ Allow skipping confirmation for this session
- ☐ Enable undo window (N seconds)

**Notes**

- Undo window should be visible and time-bound
- Skipping confirmation must never persist permanently

---

### 4.2 Validation Timing

- ☐ Validate on blur
- ☐ Validate on submit only

**Notes**

- Inline validation should never block typing
- Errors must always be shown on submit

---

## 5. System Behavior Rules (Not User Settings)

These are **policy-level rules**, not configurable preferences.
They should be documented but not user-togglable.

### 5.1 Keyboard Policy

- `Ctrl / Cmd + Enter` is the explicit submit shortcut
- `Enter` submits only from single-line inputs
- `Esc` always closes modals

---

### 5.2 Accessibility Guarantees

- Keyboard shortcuts are never required
- All actions are reachable via mouse
- Focus order must remain logical

---

## 6. Persistence Guidelines

| Setting Type           | Storage               |
| ---------------------- | --------------------- |
| User Preferences       | User profile          |
| Workflow Preferences   | User profile          |
| Session-only Overrides | Local/session storage |
| System Rules           | Code/config           |

---

## 7. Summary

This structure ensures:

- Clear ownership of settings
- Predictable persistence behavior
- Safe defaults for new users
- Advanced control for power users

Power-user features remain **opt-in, discoverable, and reversible**.
