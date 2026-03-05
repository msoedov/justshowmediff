package internal

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

//go:embed template.html
var templateHTML string

//go:embed template.css
var templateCSS string

func WriteHTML(diff string, outPath string) (string, error) {
	diffJSON, err := json.Marshal(diff)
	if err != nil {
		return "", fmt.Errorf("encoding diff: %w", err)
	}

	autoLoad := fmt.Sprintf(`

// Auto-loaded by justshowmediff
(function() {
  const raw = %s;
  if (raw && raw.includes('diff --git')) {
    S.files = parseDiff(raw);
    S.active = 0;
    S.comments = {};
    S.editing = null;
    S.reviewed = {};
    S.reverted = {};
    S.expanded = {};
    document.getElementById('paste-overlay').classList.add('hidden');
    render();
  }
})();`, string(diffJSON))

	// Count files for OG description
	fileCount := strings.Count(diff, "diff --git")
	addCount := strings.Count(diff, "\n+") - strings.Count(diff, "\n+++")
	delCount := strings.Count(diff, "\n-") - strings.Count(diff, "\n---")
	ogDesc := fmt.Sprintf("%d files changed, +%d -%d", fileCount, addCount, delCount)
	ogMeta := fmt.Sprintf(`<meta property="og:title" content="justshowmediff">
<meta property="og:description" content="%s">
<meta property="og:type" content="website">`, ogDesc)

	html := strings.Replace(templateHTML, "/* CSS_PLACEHOLDER */", templateCSS, 1)
	html = strings.Replace(html, "<!-- OG_PLACEHOLDER -->", ogMeta, 1)
	html = strings.Replace(html, "render();\n</script>", "render();\n"+autoLoad+"\n</script>", 1)
	// Hide paste overlay so link previews don't show "Paste a git diff"
	html = strings.Replace(html, `<div class="paste-overlay" id="paste-overlay">`, `<div class="paste-overlay hidden" id="paste-overlay">`, 1)

	var path string
	if outPath != "" {
		path = outPath
	} else {
		path = filepath.Join(os.TempDir(), HerokuName()+".html")
	}
	if err := os.WriteFile(path, []byte(html), 0644); err != nil {
		return "", fmt.Errorf("writing file: %w", err)
	}
	return path, nil
}
