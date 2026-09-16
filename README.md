# jmd

Beautiful JSON and Markdown viewer — as a CLI tool and a web app.

Syntax-highlighted JSON with collapsible tree view, rendered Markdown with frontmatter support, dot-path queries, stdin piping, dark mode, and drag-and-drop file loading.

## Install

### CLI

```bash
npm install -g jmd
```

Or run locally:

```bash
npm install
npm run build:cli
npm link
```

### Web App

```bash
npm install
npm run dev:web
```

Opens at `http://localhost:5173`. Drop a JSON or Markdown file to view it.

## CLI Usage

```bash
jmd <file> [query] [options]
```

### JSON

```bash
jmd data.json                        # syntax-highlighted pretty-print
jmd data.json .users[0].name         # dot-path query
jmd data.json .config.port --compact  # minified output
jmd config.jsonc                     # strips comments (JSONC)
jmd data.json --raw                  # no colors, plain JSON
```

### Markdown

```bash
jmd readme.md                # rendered markdown with frontmatter
jmd readme.md --frontmatter  # extract frontmatter as JSON
jmd readme.md --raw          # raw markdown source
```

### Stdin

```bash
cat data.json | jmd
curl -s https://api.example.com/data | jmd
echo '{"a": 1}' | jmd --json    # force JSON mode
echo '# Hello' | jmd --md       # force Markdown mode
```

### Options

| Flag | Description |
|------|-------------|
| `-r, --raw` | Show raw content without formatting |
| `-c, --compact` | Minified JSON output |
| `-f, --frontmatter` | Extract YAML frontmatter as JSON |
| `--json` | Force treat input as JSON |
| `--md` | Force treat input as Markdown |
| `-V, --version` | Show version |
| `-h, --help` | Show help |

### Query syntax

Dot-notation paths for JSON values:

```bash
jmd data.json .name              # top-level key
jmd data.json .users[0].name     # array index (bracket)
jmd data.json .users.0.name      # array index (dot)
jmd data.json .config.debug      # nested key
```

## Web App Features

- **Drag-and-drop** or file picker for loading files
- **JSON viewer** — collapsible tree with dot-path query bar
- **Markdown viewer** — rendered output with syntax-highlighted code blocks
- **Frontmatter** displayed as a card above the markdown body
- **Dark/light mode** — toggle or follows system preference

## Supported file types

| Extension | Type |
|-----------|------|
| `.json`, `.jsonc`, `.json5` | JSON (comments stripped for JSONC) |
| `.md`, `.markdown`, `.mdx` | Markdown |
| Other | Auto-detected by content, or specify `--json`/`--md` (CLI) |

## Project Structure

```
src/
  lib/          # shared pure logic (used by both CLI and web)
    json.ts     # parseJson, queryJson
    markdown.ts # parseMarkdown (frontmatter extraction)
    detect.ts   # file type detection
  cli/          # CLI tool
    index.ts    # commander entry point
    format.ts   # terminal formatting (chalk, marked-terminal)
    stdin.ts    # stdin reader
  web/          # React app
    App.tsx     # layout and routing
    components/ # FileDropZone, JsonViewer, MarkdownViewer, etc.
    hooks/      # useFileReader, useTheme
```

## Development

```bash
npm run dev:cli -- data.json     # run CLI without building
npm run dev:web                  # Vite dev server for web app
npm test                         # run all tests
npm run test:watch               # watch mode
npm run lint                     # check with biome
npm run lint:fix                 # auto-fix
npm run build                    # build both CLI and web
npm run build:cli                # build CLI only → dist/
npm run build:web                # build web only → dist-web/
```

## License

MIT © 2026 nightowldamon — see [LICENSE](LICENSE).
