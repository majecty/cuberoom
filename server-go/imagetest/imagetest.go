package main

import (
	"image"
	"log"
	"os"

	"image/color"
	"image/png"
	_ "image/png" // Register PNG  format
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
	println("Hello, World!")
	upImageFilePAth := "./imagetest/up.png"
	decodedUp := openPngImage(upImageFilePAth)
	println("Decoded up.png: ", decodedUp.Bounds().Dx(), "x", decodedUp.Bounds().Dy())

	downImageFilePAth := "./imagetest/down.png"
	decodedDown := openPngImage(downImageFilePAth)
	println("Decoded down.png: ", decodedDown.Bounds().Dx(), "x", decodedDown.Bounds().Dy())

	outFile, err := os.Create("./imagetest/merged.png")
	if err != nil {
		log.Fatalln("Error: ", err)
	}
	defer outFile.Close()

	png.Encode(outFile, &Merged{decodedUp, decodedDown})
	println("Merged up.png and down.png into merged.png")
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
