package main

import (
	"image"
	"image/color"
	"image/png"
	"log"
	"net/http"
	"os"
)

type Merged struct {
	Up   image.Image
	Down image.Image
}

func (m *Merged) Bounds() image.Rectangle {
	return m.Up.Bounds().Union(m.Down.Bounds())
}

func (m *Merged) ColorModel() color.Model {
	return m.Up.ColorModel()
}

func (m *Merged) At(x, y int) color.Color {
	up := m.Up.At(x, y)
	upR, upG, upB, upA := up.RGBA()
	if upR == 0 && upG == 0 && upB == 0 && upA == 0 {
		return m.Down.At(x, y)
	}
	return up
}

func main() {
	// start http server, in the handler it will merge the two images
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		println("Hello, World!")
		upImageFilePAth := "./imagetest/up.png"
		decodedUp := openPngImage(upImageFilePAth)
		println("Decoded up.png: ", decodedUp.Bounds().Dx(), "x", decodedUp.Bounds().Dy())

		downImageFilePAth := "./imagetest/down.png"
		decodedDown := openPngImage(downImageFilePAth)
		println("Decoded down.png: ", decodedDown.Bounds().Dx(), "x", decodedDown.Bounds().Dy())

		w.Header().Set("Content-Type", "image/png")

		png.Encode(w, &Merged{decodedUp, decodedDown})
		println("Merged up.png and down.png into merged.png")
	}))

	println("Starting server on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func openPngImage(imageFilePath string) image.Image {
	upfile, err := os.Open(imageFilePath)
	if err != nil {
		log.Fatalln("Error: ", err)
	}
	defer upfile.Close()

	decodedUp, _, err := image.Decode(upfile)
	if err != nil {
		log.Fatalln("Error: ", err)
	}
	return decodedUp
}
