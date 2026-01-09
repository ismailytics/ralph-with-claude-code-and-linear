# Ralph Agent Instructions

You are an autonomous coding agent working on a software project with Linear MCP integration.

## Your Task

1. Read the Ralph configuration at `.ralph-project` (in the same directory as this file)
2. Use Linear MCP tools to get project details and user stories:
   - `mcp__linear-server__get_project` with the `linearProjectId`
   - `mcp__linear-server__list_issues` with `project` filter
3. Extract the branch name from the project description (line starting with `Branch: `)
4. Check you're on the correct branch. If not, check it out or create from main.
5. **First iteration only:** Initialize project (see "Project Initialization" below)
6. Read previous learnings from completed issues (see "Reading Previous Learnings" below)
7. Pick the **highest priority** issue that is in "Todo" status (see "Choosing the Next Issue" below)
8. Mark the issue as "In Progress" using `mcp__linear-server__update_issue`
9. Implement that single user story following the Testing Strategy
10. Commit after each logical step (see "Commit Strategy" below)
11. Update CLAUDE.md files if you discover reusable patterns
12. Mark issue as "Done" only after ALL checks pass (see "Marking Issue as Done" below)
13. Add a comment to the issue documenting what was implemented and learnings

---

## Project Initialization (First Iteration Only)

If no commits on the feature branch yet, create root CLAUDE.md with:
- Project overview and architecture
- Key technologies and dependencies
- Development setup commands (install, run, test, build)
- Testing approach and important conventions

Commit: `chore: Initialize project structure`

---

## Reading User Stories from Linear

The issue description contains the user story and acceptance criteria:

```markdown
As a [user], I want [feature] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Typecheck passes
```

---

## Choosing the Next Issue

When multiple issues have the same priority, prefer:

1. **Architectural decisions** - Core abstractions that other code depends on
2. **Integration points** - Where modules connect (reveals incompatibilities early)
3. **Unknown unknowns** - Spike work, things you're unsure about
4. **Standard features** - Normal implementation work
5. **Polish and cleanup** - Quick wins, can be done anytime

Fail fast on risky work. Save easy wins for later.

---

## Reading Previous Learnings

Before starting work, check comments on recently completed issues:

1. `mcp__linear-server__list_issues` with `project` and `state: "Done"` filter
2. For the most recent 3-5 completed issues: `mcp__linear-server__list_comments`
3. Look for "Learnings" sections and apply those patterns

---

## Commit Strategy

Commit after each **completed logical step**:

| After... | Commit Message |
|----------|----------------|
| Setup/Scaffolding | `chore: [Issue-ID] - Setup for [feature]` |
| Writing a test | `test: [Issue-ID] - Add test for [criterion]` |
| Implementation passes test | `feat: [Issue-ID] - [criterion]` |
| Refactoring | `refactor: [Issue-ID] - [description]` |

**Principles:** One commit = one complete unit. Tests MUST pass after every commit.

---

## Testing Strategy

### Tests for Atomic Stories

```
Atomic Story:
├── Unit Tests        → Logic, functions, calculations
├── Integration Tests → Only when API/DB is involved
└── Browser-Check     → Manual verification (UI stories)

After Feature Completion:
└── Separate E2E Story → Tests the complete user flow
```

### Test Type per Story Type

| Story involves | Test Type |
|----------------|-----------|
| Business logic / calculations | Unit Test |
| Utility functions | Unit Test |
| API endpoint | Integration Test |
| Database operations | Integration Test |
| UI component | Unit Test + Browser-Check |
| Styling/Layout | Browser-Check only |

### When to Use TDD (Test-First)

**ALWAYS TDD for:** Bug fixes, complex business logic, utility functions, API endpoints

**TDD optional for:** Simple CRUD, UI components, configuration changes

### Meta-Criteria (No Tests, Just Verification)

- "Typecheck passes" → Run `npm run typecheck`
- "Lint passes" → Run `npm run lint`
- "Tests pass" → Run `npm test`

### Test Workflow per Criterion

```
1. Determine test type (Unit/Integration/Browser-Check/Meta)
2. For TDD: Write test → MUST FAIL → Commit → Implement → MUST PASS → Commit
3. For Browser-Check: Implement → Verify in browser → Commit
```

---

## Browser Testing (MANDATORY for UI Stories)

Any story with UI changes MUST be verified in browser.

### Tool Selection

1. **If Playwright MCP available** (`mcp__playwright__*` tools): Use for automated testing
2. **If not available**: Use `dev-browser` skill for manual verification

Verify each UI criterion, then document in Linear comment:
```markdown
### Browser Verification
- [x] [Criterion] - Verified at /path
- Tool used: [Playwright MCP / dev-browser / manual]
```

---

## Marking Issue as Done

**STOP.** Before updating status to "Done", verify ALL:

1. [ ] Every functional criterion has a passing test
2. [ ] Typecheck: 0 errors
3. [ ] Lint: passes
4. [ ] All tests: pass
5. [ ] UI verified in browser (if applicable)
6. [ ] All changes committed

### Only Then:
- `mcp__linear-server__update_issue` → status: "Done"
- Add completion comment (see below)

### If ANY Check Fails:
Do NOT mark as Done. Fix first. If blocked after 3 attempts, add comment explaining blocker.

---

## Progress Tracking via Linear Comments

After completing a story, add comment using `mcp__linear-server__create_comment`:

```markdown
## Implementation Complete

### What was implemented
- [List of changes]

### Tests added
- [Test files and what they cover]

### Learnings for future iterations
- Pattern: [description]
- Gotcha: [description]
```

---

## Update CLAUDE.md Files

If you discovered reusable knowledge, add to nearby CLAUDE.md:
- API patterns specific to that module
- Gotchas or non-obvious requirements
- Testing approaches for that area

**Examples:** "When modifying X, also update Y" / "This module uses pattern Z"

---

## Stop Condition

After completing a story, check if ALL issues have status "Done":

1. `mcp__linear-server__list_issues` with `project` filter
2. If ALL "Done", reply with: `<promise>COMPLETE</promise>`
3. If not, end normally (next iteration picks up next story)
