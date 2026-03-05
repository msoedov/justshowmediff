package cmd

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"

	"github.com/msoedov/justshowmediff/internal"
	"github.com/spf13/cobra"
)

var (
	staged  bool
	outFile string
)

var rootCmd = &cobra.Command{
	Use:   "justshowmediff [git diff args...]",
	Short: "Show git diff in a beautiful HTML viewer",
	Long:  "Generates an HTML diff viewer from git changes and opens it in your browser.\nSupports unstaged, staged, arbitrary git diff args, and stdin.",
	RunE:  run,
}

func init() {
	rootCmd.Flags().BoolVar(&staged, "staged", false, "show staged changes")
	rootCmd.Flags().StringVarP(&outFile, "output", "o", "", "write HTML to file path instead of tmp")
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, args []string) error {
	diff, err := getDiff(cmd, args)
	if err != nil {
		return err
	}
	if strings.TrimSpace(diff) == "" {
		fmt.Println("No diff to show.")
		return nil
	}

	path, err := internal.WriteHTML(diff, outFile)
	if err != nil {
		return fmt.Errorf("writing html: %w", err)
	}

	fmt.Println(path)
	if outFile == "" {
		return internal.Open(path)
	}
	return nil
}

func getDiff(cmd *cobra.Command, args []string) (string, error) {
	if hasStdin() {
		b, err := io.ReadAll(os.Stdin)
		if err != nil {
			return "", fmt.Errorf("reading stdin: %w", err)
		}
		return string(b), nil
	}

	gitArgs := []string{"diff"}
	if staged {
		gitArgs = append(gitArgs, "--staged")
	}
	gitArgs = append(gitArgs, args...)

	out, err := exec.Command("git", gitArgs...).CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("git diff: %s", strings.TrimSpace(string(out)))
	}
	return string(out), nil
}

func hasStdin() bool {
	fi, err := os.Stdin.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) == 0
}
