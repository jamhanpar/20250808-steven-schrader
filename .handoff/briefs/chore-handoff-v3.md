---
branch: "chore/handoff-v3"
card: "https://trello.com/c/Kbpt43DX"
issue: none
agent: "claude-code:f256"
updated: "2026-11-14T05:59:29Z"
lease_hours: 4
template_version: 3
---
# Branch brief: chore/handoff-v3

> Context for the next agent on this branch that git, gh and the tracker can't give it. Rewrite after
> each completed unit of work and before stopping. This file ships with the PR, so write it to be
> true after merge.

## Current State

- Set up Agent Continuity Protocol v3 with `~/.handoff/bin/project-init`: the repo had no handoff files on `main` or `dev`. It created `HANDOFF.md` (repo brief from the template), `.handoff/briefs/`, the v3 stanza at the end of `CLAUDE.md`, and `.github/workflows/handoff-check.yml` (fails direct `CHANGELOG.md` edits and, once a `CHANGELOG.md` exists, PRs without a `changelog.d/` fragment; warns on a missing branch brief or a `HANDOFF.md` edit).
- No `CHANGELOG.md` here, so there's no `changelog.d/` and the fragment rule is off.

## Branch Decisions

- Branched from `dev`, not `main`: open PRs target `dev`, and `main` hasn't moved in 7 months.
- `HANDOFF.md`'s only Critical Context so far is the public-repo warning; the rest fills in as agents learn the repo.

## Next Steps

- None on this branch.
