# justshowmediff

Show git diff in a beautiful HTML viewer. Single binary, no server, opens in your browser.

## Install

```
go install github.com/msoedov/justshowmediff@latest
```

Or download from [releases](https://github.com/msoedov/justshowmediff/releases).

### From source

```bash
git clone https://github.com/msoedov/justshowmediff.git
cd justshowmediff
go build -o justshowmediff .
mv justshowmediff /usr/local/bin/
```

## Why

`git diff` output is hard to read in the terminal. Side-by-side viewers need a running server or heavy IDE. This tool generates a single HTML file and opens it -- no dependencies, no server, no config. Just the diff.

Built for workflows where you don't have a full editor open:

- **Claude Code** -- review AI-generated changes before committing. Add `justshowmediff` to your post-tool hooks or run it manually between iterations.
- **Codex / headless agents** -- when an agent writes code on your machine without an IDE, pipe the diff to get a visual review before accepting.
- **Telegram / SSH / remote** -- working from a phone or a bare terminal? The HTML file is self-contained, share it or open it anywhere with a browser.

If you can run `git diff`, you can see your diff properly.

## Usage

```bash
# unstaged changes
justshowmediff

# staged changes
justshowmediff --staged

# arbitrary git diff args
justshowmediff HEAD~3
justshowmediff main..feature-branch

# pipe from stdin
git diff | justshowmediff
```

Opens an HTML file in your default browser with side-by-side diff, syntax highlighting, anti-pattern warnings, and inline comments.

## How it works

Runs `git diff`, embeds the output into a self-contained HTML file in `/tmp`, and opens it. No server needed.

## License

MIT
