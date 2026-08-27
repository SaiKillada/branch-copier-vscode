# Branch Copier

Adds a copy-icon button to the status bar (bottom-left), next to VS Code's
built-in Git branch indicator. Click it to copy the current branch name to
the clipboard.

![Copy branch name button](copy.png)

No more retyping or fat-fingering long branch names into commit messages,
PR titles, or Slack — one click on the status bar copies the exact branch
you're on. It's lightweight, stays out of your way, and works with any Git
repository VS Code already recognizes.

## Development

```bash
npm install
npm run compile
```

Then press `F5` in VS Code to launch an Extension Development Host.
