package main

import (
	"flag"
	"go/build"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"text/template"
)

var (
	addr        = flag.String("addr", ":"+os.Getenv("PORT"), "http service address")
	assets      = flag.String("assets", defaultAssetPath(), "path to assets")
	homeTempl   *template.Template
	circleTempl *template.Template
	indexTempl  *template.Template
)

func defaultAssetPath() string {
	p, err := build.Default.Import("github.com/gary.burd.info/go-websocket-chat", "", build.FindOnly)
	if err != nil {
		return "."
	}
	return p.Dir
}

func homeHandler(c http.ResponseWriter, req *http.Request) {
	logRequestPath(req.URL)
	homeTempl.Execute(c, req.Host)
}

func jsCircleHandler(c http.ResponseWriter, req *http.Request) {
	logRequestPath(req.URL)
	circleTempl.Execute(c, req.Host)
}

func jsIndexHandler(c http.ResponseWriter, req *http.Request) {
	logRequestPath(req.URL)
	circleTempl.Execute(c, req.Host)
	indexTempl.Execute(c, req.Host)
}

func logRequestPath(url *url.URL) {
	log.Printf("Serving %v", url)
}

func main() {
	flag.Parse()
	homeTempl = template.Must(template.ParseFiles(filepath.Join(*assets, "/public/home.html")))
	circleTempl = template.Must(template.ParseFiles(filepath.Join(*assets, "/public/circle.js")))
	indexTempl = template.Must(template.ParseFiles(filepath.Join(*assets, "/public/index.js")))
	h := newHub()
	go h.run()
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/public/circle.js", jsCircleHandler)
	http.HandleFunc("/public/index.js", jsIndexHandler)
	http.Handle("/ws", wsHandler{h: h})
	log.Printf("Server running on port %v", *addr)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
