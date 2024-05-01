package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"net/http"
	"os"
	"strings"
)

type Merged struct {
	Body   image.Image
	Eye    image.Image
	Outfit image.Image
	Hair   image.Image
}

func (m *Merged) Bounds() image.Rectangle {
	return m.Body.Bounds().Union(m.Eye.Bounds()).Union(m.Outfit.Bounds()).Union(m.Hair.Bounds())
}

func (m *Merged) ColorModel() color.Model {
	return m.Body.ColorModel()
}

func (m *Merged) At(x, y int) color.Color {
	hair := m.Hair.At(x, y)
	hairR, hairG, hairB, hairA := hair.RGBA()

	if hairR != 0 || hairG != 0 || hairB != 0 || hairA != 0 {
		return hair
	}

	outfit := m.Outfit.At(x, y)
	outfitR, outfitG, outfitB, outfitA := outfit.RGBA()

	if outfitR != 0 || outfitG != 0 || outfitB != 0 || outfitA != 0 {
		return outfit
	}

	eye := m.Eye.At(x, y)
	eyeR, eyeG, eyeB, eyeA := eye.RGBA()

	if eyeR != 0 || eyeG != 0 || eyeB != 0 || eyeA != 0 {
		return eye
	}

	body := m.Body.At(x, y)
	return body
}

func main() {
	// localhost:8080/body1-1/eye1-1/outfit1-1/hair1-1
	// example "/body1-1/eye-1/outfit1-1/hair1-1"
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				// output to html
				w.Write([]byte(fmt.Sprintf("무언가 잘못되었습니다. %v", r)))
				fmt.Println("Recovered in f", r)
			}
		}()

		// split the path into the parts
		parts := strings.Split(r.URL.Path, "/")
		println("Parts: ", parts)
		body := parts[1]
		eye := parts[2]
		outfit := parts[3]
		hair := parts[4]
		fmt.Printf("Body: %s, Eye: %s, Outfit: %s, Hair: %s\n", body, eye, outfit, hair)

		bodyImage := openPngImage(fmt.Sprintf("./imagetest/00%s.png", body))
		eyeImage := openPngImage(fmt.Sprintf("./imagetest/01%s.png", eye))
		outfitImage := openPngImage(fmt.Sprintf("./imagetest/02%s.png", outfit))
		hairImage := openPngImage(fmt.Sprintf("./imagetest/03%s.png", hair))

		fmt.Printf("Decoded %s.png: %dx%d Decoded %s.png: %dx%d Decoded %s.png: %dx%d Decoded %s.png: %dx%d\n", body, bodyImage.Bounds().Dx(), bodyImage.Bounds().Dy(), eye, eyeImage.Bounds().Dx(), eyeImage.Bounds().Dy(), outfit, outfitImage.Bounds().Dx(), outfitImage.Bounds().Dy(), hair, hairImage.Bounds().Dx(), hairImage.Bounds().Dy())

		w.Header().Set("Content-Type", "image/png")
		png.Encode(w, &Merged{bodyImage, eyeImage, outfitImage, hairImage})
		println("Merged up.png and down.png into merged.png")
	}))

	println("Starting server on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func openPngImage(imageFilePath string) image.Image {
	upfile, err := os.Open(imageFilePath)
	if err != nil {
		log.Panicln("Error: ", err)
	}
	defer upfile.Close()

	decodedUp, _, err := image.Decode(upfile)
	if err != nil {
		log.Panicln("Error: ", err)
	}
	return decodedUp
}
