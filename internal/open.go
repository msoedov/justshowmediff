package internal

import (
	"os/exec"
	"runtime"
)

func Open(path string) error {
	var cmd string
	switch runtime.GOOS {
	case "darwin":
		cmd = "open"
	case "linux":
		cmd = "xdg-open"
	default:
		cmd = "start"
	}
	return exec.Command(cmd, path).Start()
}
