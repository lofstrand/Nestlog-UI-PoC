# Nestlog – Entity Workflow Best Practices (2025)

This document defines the **official best practices** for creating, editing, and deleting entities in Nestlog.
These guidelines are based on **modern (2024–2025) UX standards** for productivity-oriented, CRUD-heavy web applications.

The purpose is to ensure:

- Consistent user experience
- Predictable behavior
- High productivity for power users
- Low cognitive load for casual users

This document is **normative**: new features should follow these rules by default.

---

## 1. Core Principle

> **Context must be preserved unless the user explicitly chooses to leave it.**

Losing context (navigation, filters, scroll position, parent entity) is treated as a UX regression.

---

## 2. Entity Creation Workflows

### 2.1 Inline / Same-Screen Creation (Default)

**Use when**

- Creating a child entity
  - Room → Asset
  - Project → Task
  - Property → Room
- Creation is frequent or repeatable
- The parent context is important

**Patterns**

- Inline form
- Expandable section
- Slide-in panel / drawer

**Rules**

- Parent context remains visible
- No full-page navigation
- Supports:
  - Keyboard shortcuts
  - “Keep form open after create”
  - Drafts (when applicable)

**Rationale**

- Minimizes cognitive load
- Enables bulk creation
- Optimized for keyboard-driven workflows

✅ **This is the preferred creation pattern**

---

### 2.2 Modal-Based Creation (Limited Use)

**Use only when**

- The entity is small and self-contained
- The form is short
- No reference data or navigation is required

**Requirements**

- Focus trap
- `Esc` closes modal
- `Ctrl / Cmd + Enter` submits
- Clear primary action

**Avoid when**

- Forms are long
- Entities have many relationships
- The user may need to inspect surrounding data

⚠️ Modals are considered **interruptive** and should not be the default.

---

### 2.3 Dedicated Create Page (Top-Level Entities)

**Use when**

- Creating top-level entities (Property, Project)
- The entity defines a new primary context
- Creation is complex or infrequent

**Behavior**

- Full page with shareable URL
- Draft support
- Redirect to entity detail page after successful creation

**Rationale**

- Encourages deliberate input
- Reduces pressure
- Supports onboarding and deep configuration

---

### 2.4 New Window / Tab (Disallowed)

**Do not use**

- For creation
- For editing
- For deletion

**Exceptions**

- External integrations
- Printable or export-only views

---

## 3. Entity Editing Workflows

### 3.1 Inline Editing (Strongly Recommended)

**Use when**

- Editing individual fields
- Making quick corrections

**Patterns**

- Click-to-edit
- Save on blur or explicit save
- `Esc` cancels changes

**Rationale**

- Fastest interaction model
- Ideal for power users
- Reduces unnecessary navigation

---

### 3.2 Same-Screen Editing (Detail View)

**Use when**

- Editing multiple related fields
- The user is already viewing entity details

**Pattern**

- View → Edit toggle
- Same layout, editable fields
- No navigation or URL change

**Rules**

- Stay on the same page after save
- Preserve scroll and focus where possible

---

### 3.3 Modal Editing (Discouraged)

**Only acceptable when**

- Editing is secondary or optional
- Changes must be explicitly confirmed before returning

If editing is important or complex, it **must not** be done in a modal.

---

## 4. Entity Deletion Workflows

### 4.1 Recommended Deletion Flow

1. User initiates delete
2. Confirmation dialog appears
3. Deletion executes
4. Undo window is shown

**Requirements**

- Clear identification of what is being deleted
- Undo must be time-bound and visible

---

### 4.2 Where Delete Actions Belong

| Context         | Placement            |
| --------------- | -------------------- |
| Detail view     | Bottom “danger zone” |
| List / table    | Context menu         |
| Inline elements | Not allowed          |

**Rules**

- Never delete immediately
- Never delete without feedback
- Never delete silently

---

## 5. Navigation After Actions

### 5.1 After Create

- Child entity → remain on parent context
- Top-level entity → navigate to new entity detail
- Respect user preference for keeping forms open

---

### 5.2 After Edit

- Always remain on the same screen
- Never redirect automatically

---

### 5.3 After Delete

- Navigate to nearest stable parent context
- Never redirect to home/root unless unavoidable

---

## 6. Decision Matrix

| Action                  | Preferred Pattern  | Avoid              |
| ----------------------- | ------------------ | ------------------ |
| Create child entity     | Inline / panel     | Full page redirect |
| Create top-level entity | Dedicated page     | Modal              |
| Edit field              | Inline edit        | Modal              |
| Edit entity             | Same screen        | New page           |
| Delete                  | Confirm + Undo     | Immediate delete   |
| Navigation              | Context-preserving | New window         |

---

## 7. Explicit Anti-Patterns

The following are considered UX regressions:

- Using modals for long or complex forms
- Redirecting after simple edits
- Losing scroll position after save
- Deleting without undo
- Opening internal flows in new tabs
- Requiring keyboard shortcuts for core actions

---

## 8. Enforcement Rule

> **If an action causes navigation, the developer must justify why.**

If the justification is unclear, the workflow should remain inline or same-screen.

---

## 9. Summary

These best practices ensure that Nestlog:

- Feels fast and calm
- Scales with complexity
- Supports power users without excluding others
- Remains aligned with modern (2025) UX standards

Consistency is more important than perfection.
When in doubt: **preserve context**.

## Example Workflow: Creating an Asset Within a Room

This example demonstrates the recommended 2025 workflow for creating a **child entity** in Nestlog,
following the **context-preserving, inline-first** principle.

---

### Scenario

A user is viewing a **Room detail page** and wants to add a new **Asset** (e.g. a washing machine).

---

### Step-by-Step Workflow

#### 1. User Context

- The user is on:
  - Property → Room → _Kitchen_
- The room details and existing assets are visible

**Key rule applied**

> Context must be preserved

---

#### 2. Initiate Create

- User clicks **“Add Asset”**
- OR uses a keyboard shortcut (if enabled)

**Behavior**

- An inline panel opens within the same screen
- The room context remains visible in the background
- Focus moves to the first input field

**Why**

- The user does not lose orientation
- The parent-child relationship is clear

---

#### 3. Enter Data

- User fills in asset details:
  - Name
  - Category
  - Purchase date
  - Notes

**Keyboard behavior**

- `Enter` inserts a new line in text fields
- `Ctrl / Cmd + Enter` submits the form
- Drafts auto-save if enabled

---

#### 4. Submit

- User submits using:
  - **Create button**
  - OR `Ctrl / Cmd + Enter`

**Validation**

- Runs on submit
- Errors are shown inline
- Submission is blocked until valid

---

#### 5. After Successful Creation

**Default behavior**

- Asset is added to the room’s asset list
- The user remains on the Room page
- A success indicator is shown

**If “Keep form open after create” is enabled**

- The form remains open
- Focus resets to the first field
- User can immediately add another asset

---

#### 6. Optional Undo

- A temporary undo action is available
- Allows recovery from accidental creation

---

### Why This Workflow Is Best Practice

- Preserves context
- Enables fast, repeatable data entry
- Avoids unnecessary navigation
- Supports both mouse and keyboard users
- Scales as rooms and assets grow

---

### What Is Explicitly Avoided

- Redirecting to a separate “Create Asset” page
- Opening a modal that blocks the room context
- Opening a new tab or window
- Forcing navigation after creation

---

### Summary

For child entities in Nestlog:

- **Inline creation is the default**
- **Same-screen workflows are preferred**
- **Navigation is intentional, not automatic**

This pattern should be applied consistently for:

- Rooms within Properties
- Assets within Rooms
- Tasks within Projects
