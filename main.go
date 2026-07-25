package main

import (
	"embed"
	"flag"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
)

var (
	port = flag.String("port", "8001", "The port for the webserver to run on")
)

//go:embed all:static
var webFS embed.FS

func main() {
	flag.Parse()

	webRoot, err := fs.Sub(webFS, "static")
	if err != nil {
		slog.Error("failed to get web subfs", "error", err)
		os.Exit(1)
	}
	http.Handle("/", http.FileServer(http.FS(webRoot)))

	slog.Info("Starting server")
	var exitCode int
	err = http.ListenAndServe(":"+*port, nil)
	if err != nil {
		slog.Error("failed to serve", "error", err)
		exitCode = 1
	}

	os.Exit(exitCode)
}
