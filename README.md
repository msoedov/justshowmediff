# justshowmediff

Show git diff in a beautiful UI viewer. Single binary, no server, opens in your browser.

Zero dependencies -- no JS frameworks, no CSS libraries, everything is self-contained in one HTML file.

![justshowmediff screenshot](docs/screenshot.png)

## Install

```
go install github.com/msoedov/justshowmediff@latest
```

Or download from [releases](https://github.com/msoedov/justshowmediff/releases).

### From source

```bash
git clone https://github.com/msoedov/justshowmediff.git
cd justshowmediff
sh install.sh
```

## Usage

```bash
justshowmediff                      # unstaged changes
justshowmediff --staged             # staged changes
justshowmediff HEAD~3               # arbitrary git diff args
justshowmediff main..feature-branch # compare branches
git diff | justshowmediff           # pipe from stdin
justshowmediff -o review.html       # write to file instead of opening
```

## Why

`git diff` output is hard to read in the terminal. Side-by-side viewers need a running server or heavy IDE. This tool generates a single HTML file and opens it -- no dependencies, no server, no config. Just the diff.

Built for workflows where you don't have a full editor open:

- **Claude Code** -- review AI-generated changes before committing. Add `justshowmediff` to your post-tool hooks or run it manually between iterations.
- **Codex / headless agents** -- when an agent writes code on your machine without an IDE, pipe the diff to get a visual review before accepting.
- **Telegram / SSH / remote** -- working from a phone or a bare terminal? The HTML file is self-contained, share it or open it anywhere with a browser.

## How it works

Runs `git diff`, embeds the output into a self-contained HTML file in `/tmp`, and opens it. No server needed. Mobile optimized.

## License

MIT
