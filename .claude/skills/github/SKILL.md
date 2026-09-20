---
name: github
description: Git and GitHub workflow for this repo — staging and writing commits in its message convention, branching, pushing, opening and updating pull requests, and checking their state. Use when asked to commit, amend, branch, push, open or review a PR, or when work is finished and needs to reach GitHub.
---

# Git and GitHub in `iso`

Remote is `git@github.com:ogarich89/iso.git`, default branch `master`. The `gh` CLI is **not installed here**,
so PRs are opened through a compare URL unless the user installs it (`brew install gh`).

## Rules

- **Never commit, push, amend or open a PR unless the user asked for it.** Finishing a task is not a request
  to commit it.
- **Never force-push `master`**, never rewrite a commit that is already pushed, and never `git checkout --`
  or `git reset --hard` over uncommitted work the user has not seen.
- **Check for secrets before every commit.** `.env.local` holds `SESSION_SECRET` and `API_KEY` and is
  gitignored — confirm it is not staged, and that no key was pasted into a committed file.
- `pre-commit` runs `test`, `typecheck`, `lint`, `stylelint` and `deadcode` on every commit. Run them yourself
  first; a failing hook leaves the work half-staged and is slower to untangle.
- Interactive git flags (`-i`) do not work in this environment.

## Commit messages

The house style is a short imperative subject, capitalised, no full stop, no `feat:`/`fix:` prefix, no scope.
Aim for 50 characters, hard limit 72.

Real subjects from this repo:

```
Modernize stack: Vite SSR, React 19, Zustand, Biome, bun
Migrate webpack to rspack
Remove gulp
Preload link
Fix eslint config
Upgrade deps
```

Say what the commit does, not what you did: `Remove gulp`, not `Removed gulp` or `Removing gulp`.

Add a body only when the *why* is not obvious from the diff. Separate it with a blank line, wrap at 72,
and use `-` bullets for several points:

```
Fix SSR falling back to client rendering

React.lazy suspends even when the module is already loaded, so the first
render of every route aborted and the page was rendered on the client.
```

End every commit message you write with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

One commit = one concern. If the working tree mixes a refactor, a fix and docs, stage them separately with
`git add <paths>` and make several commits rather than one large one.

## Committing

```bash
git status --short
git diff              # unstaged
git diff --staged     # what will actually be committed
git log --oneline -10 # match the tone of recent subjects
```

Then run the gate, stage by path (never `git add -A` without reading `status` first), and commit with a
heredoc so the message keeps its line breaks:

```bash
git commit -F - <<'EOF'
Subject line

Optional body.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
```

Report the result with `git log --oneline -1` and `git status --short`.

## Branches

Feature work goes on `feature/<topic>`, lowercase, hyphenated: `feature/rspack`, `feature/i18next`,
`feature/tdd-skill`. Dependabot owns `dependabot/*` — leave those alone unless asked.

The user often commits small changes straight to `master` on this repo. Follow what they ask for; when they
ask for a PR, or when the change is large enough to want review, branch first:

```bash
git checkout -b feature/<topic>
```

## Pull requests

1. Push and set upstream:

   ```bash
   git push -u origin feature/<topic>
   ```

2. Open the PR. With `gh` installed:

   ```bash
   gh pr create --base master --title "<subject>" --body-file -
   ```

   Without it, give the user this link and the body to paste:

   ```
   https://github.com/ogarich89/iso/compare/master...feature/<topic>?expand=1
   ```

3. PR body — short, and written for someone who has not seen the work:

   ```markdown
   ## Summary
   One or two sentences on what changes and why.

   ## Changes
   - Grouped by area, one line each

   ## Testing
   - `bun run test` — 82 passed
   - `bun run typecheck`, `bun run lint`, `bun run stylelint`, `bun run deadcode`

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

Merged PRs on this repo appear as `Merge pull request #NN from ogarich89/feature/<topic>`, so keep the branch
name meaningful — it stays in the history.

## Checking state

Without `gh`, use git and the web UI:

```bash
git fetch origin
git log --oneline origin/master..HEAD     # what this branch adds
git log --oneline HEAD..origin/master     # what it is missing
git branch -a                             # includes dependabot branches
```

With `gh`: `gh pr status`, `gh pr view <n> --comments`, `gh pr checks <n>`, `gh run list --limit 5`.

## Before you say it is done

- [ ] `git status --short` is clean, or the leftovers are named and explained
- [ ] No secret, key or `.env.local` in the diff
- [ ] The five checks pass
- [ ] Subject is imperative, capitalised, under 72 characters
- [ ] Attribution line present
- [ ] The user actually asked for the commit, push or PR
