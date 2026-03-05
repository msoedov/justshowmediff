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

func WriteHTML(diff string) (string, error) {
	diffJSON, err := json.Marshal(diff)
	if err != nil {
		return "", fmt.Errorf("encoding diff: %w", err)
	}

	// Inject auto-load script right before </script>
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
    S.warnings = {};
    S.files.forEach((f, i) => { S.warnings[i] = detect(f); });
    document.getElementById('paste-overlay').classList.add('hidden');
    render();
  }
})();`, string(diffJSON))

	html := strings.Replace(templateHTML, "render();\n</script>", "render();\n"+autoLoad+"\n</script>", 1)

	name := HerokuName()
	path := filepath.Join(os.TempDir(), name+".html")
	if err := os.WriteFile(path, []byte(html), 0644); err != nil {
		return "", fmt.Errorf("writing file: %w", err)
	}
	return path, nil
}
