# Changelog

## 1.0.0 (2026-04-05)

### CLI

- JSON pretty-printing with syntax highlighting
- Dot-path queries for JSON values (e.g. `.users[0].name`)
- JSONC support (strips single-line and multi-line comments)
- Markdown rendering in terminal via `marked` + `marked-terminal`
- YAML frontmatter extraction (`--frontmatter`)
- Stdin support with auto-detection (`cat data.json | jmd`)
- Force file type with `--json` / `--md` flags
- `--raw` and `--compact` output modes

### Web App

- Drag-and-drop and file picker for loading files
- Collapsible JSON tree view with dot-path query bar
- Rendered Markdown with syntax-highlighted code blocks
- Frontmatter displayed as a card above Markdown body
- Dark/light mode toggle with system preference detection

### Project

- Shared `lib/` for pure logic used by both CLI and web
- Built with tsup (CLI) and Vite + React (web)
- 33 tests covering JSON parsing, querying, Markdown parsing, and file detection
- Linting with Biome
