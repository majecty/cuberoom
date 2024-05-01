package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"os"
	"path/filepath"
	"strings"
)

const downAnimationFrameName = "down-1.png"

var animationFrameNames []string

func init() {
	for i := 1; i <= 4; i++ {
		animationFrameNames = append(animationFrameNames, fmt.Sprintf("down-%d.png", i))
		animationFrameNames = append(animationFrameNames, fmt.Sprintf("up-%d.png", i))
		animationFrameNames = append(animationFrameNames, fmt.Sprintf("left-%d.png", i))
		animationFrameNames = append(animationFrameNames, fmt.Sprintf("right-%d.png", i))
	}
}

type merged struct {
	Images []image.Image
	except image.Image
}

func (m *merged) Bounds() image.Rectangle {
	return m.Images[0].Bounds()
}

func (m *merged) ColorModel() color.Model {
	return m.Images[0].ColorModel()
}

func (m *merged) At(x, y int) color.Color {
	probability := map[color.RGBA]int{}
	for _, img := range m.Images {
		r, g, b, a := img.At(x, y).RGBA()
		probability[color.RGBA{uint8(r), uint8(g), uint8(b), uint8(a)}]++
	}

	for k, v := range probability {
		if v > len(m.Images)/2 {
			if m.except != nil {
				if m.except.At(x, y) == k {
					return color.Transparent
				}
			}
			return k
		}
	}

	return color.Transparent

	// r, g, b, a := m.Images[0].At(x, y).RGBA()
	// for _, img := range m.Images {
	// 	newr, newg, newb, newa := img.At(x, y).RGBA()

	// 	if r != newr || g != newg || b != newb || a != newa {
	// 		return color.Transparent
	// 	}
	// }

	// return color.RGBA{uint8(r), uint8(g), uint8(b), uint8(a)}
}

type characterResourceDirectoryName struct {
	skin      string
	hairColor string
	cloth     string
	hairShape string
	face      string
}

func fromDirectoryName(directoryName string) characterResourceDirectoryName {
	// example skin3_hairC4_cloth12_hairS12_faceS3
	directoryNameParts := strings.Split(directoryName, "_")
	if len(directoryNameParts) != 5 {
		log.Fatalf("Invalid directory name: %v\n", directoryName)
	}

	return characterResourceDirectoryName{
		skin:      directoryNameParts[0],
		hairColor: directoryNameParts[1],
		cloth:     directoryNameParts[2],
		hairShape: directoryNameParts[3],
		face:      directoryNameParts[4],
	}
}

func (c characterResourceDirectoryName) String() string {
	return fmt.Sprintf("%v_%v_%v_%v_%v", c.skin, c.hairColor, c.cloth, c.hairShape, c.face)
}

func main() {
	characterResourceDirectory := "../client/public/static/character-resource-fix"

	allFolderNames := []string{}

	filepath.Walk(characterResourceDirectory, func(path string, info os.FileInfo, err error) error {
		if info.Name() == "character-resource-fix" {
			return nil
		}
		if err != nil {
			log.Fatalf("Error: %v\n", err)
		}

		if info.IsDir() {
			allFolderNames = append(allFolderNames, info.Name())
		}

		return nil
	})

	fmt.Printf("First directory name: %v\n", allFolderNames[0])
	// second
	fmt.Printf("Second directory name: %v\n", allFolderNames[1])
	fmt.Printf("Last directory name: %v\n", allFolderNames[len(allFolderNames)-1])
	fmt.Printf("Count of directory names: %v\n", len(allFolderNames))

	characterResourceDirectoryNames := []characterResourceDirectoryName{}
	for _, folderName := range allFolderNames {
		characterResourceDirectoryNames = append(characterResourceDirectoryNames, fromDirectoryName(folderName))
	}

	// unique 한 것들만 수집
	allSkinNames := map[string]struct{}{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		allSkinNames[characterResourceDirectoryName.skin] = struct{}{}
	}

	allHairColorNames := map[string]struct{}{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		allHairColorNames[characterResourceDirectoryName.hairColor] = struct{}{}
	}

	allClothNames := map[string]struct{}{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		allClothNames[characterResourceDirectoryName.cloth] = struct{}{}
	}

	allHairShapeNames := map[string]struct{}{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		allHairShapeNames[characterResourceDirectoryName.hairShape] = struct{}{}
	}

	// 수집한 이름들 출력
	fmt.Printf("All skin names: %v\n", allSkinNames)
	fmt.Printf("All hair color names: %v\n", allHairColorNames)
	fmt.Printf("All cloth names: %v\n", allClothNames)
	fmt.Printf("All hair shape names: %v\n", allHairShapeNames)
	fmt.Printf("All face names: %v\n", allHairShapeNames)

	for _, frameName := range animationFrameNames {
		// find all common image
		allImages := []image.Image{}
		for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
			directoryPath := filepath.Join(characterResourceDirectory, characterResourceDirectoryName.String())
			imageFilePath := filepath.Join(directoryPath, frameName)

			allImages = append(allImages, openPngImage(imageFilePath))
		}

		outFile, err := os.Create(fmt.Sprintf("./imagetestresult/%s", frameName))
		if err != nil {
			log.Fatalf("Error: %v\n", err)
		}
		defer outFile.Close()

		allCommon := &merged{allImages, nil}
		png.Encode(outFile, allCommon)
		fmt.Printf("Merged %s.png\n", frameName)

		// extractPart(
		// 	characterResourceDirectoryNames,
		// 	characterResourceDirectory,
		// 	func(dirName characterResourceDirectoryName) string {
		// 		return dirName.skin
		// 	},
		// 	allCommon,
		// 	frameName,
		// )

		// extractPart(
		// 	characterResourceDirectoryNames,
		// 	characterResourceDirectory,
		// 	func(dirName characterResourceDirectoryName) string {
		// 		return dirName.cloth
		// 	},
		// 	nil,
		// 	frameName,
		// )

		extractPart(
			characterResourceDirectoryNames,
			characterResourceDirectory,
			func(dirName characterResourceDirectoryName) string {
				return dirName.face
			},
			nil,
			frameName,
		)

		// extractHair(
		// 	characterResourceDirectoryNames,
		// 	characterResourceDirectory,
		// 	allCommon,
		// 	frameName,
		// )
	}

}

func extractPart(
	characterResourceDirectoryNames []characterResourceDirectoryName,
	characterResourceDirectory string,
	extractPartName func(characterResourceDirectoryName) string,
	except image.Image,
	frameName string,
) {
	partNameToDirName := map[string][]string{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		partName := extractPartName(characterResourceDirectoryName)
		partNameToDirName[partName] = append(partNameToDirName[partName], characterResourceDirectoryName.String())
	}

	partNameToImages := map[string][]image.Image{}
	for partName, directoryNames := range partNameToDirName {
		images := []image.Image{}
		for _, directoryName := range directoryNames {
			directoryPath := filepath.Join(characterResourceDirectory, directoryName)
			decodedImage := openPngImage(filepath.Join(directoryPath, frameName))
			images = append(images, decodedImage)
		}
		partNameToImages[partName] = images
	}

	for partName, images := range partNameToImages {
		outFile, err := os.Create(fmt.Sprintf("./imagetestresult/%s-%s", partName, frameName))
		if err != nil {
			log.Fatalf("Error: %v\n", err)
		}
		defer outFile.Close()

		png.Encode(outFile, &merged{images, except})
		fmt.Printf("Merged %s.png into %s.png\n", partName, partName)
	}
}

func extractHair(
	characterResourceDirectoryNames []characterResourceDirectoryName,
	characterResourceDirectory string,
	except image.Image,
	frameName string,
) {
	partNameToDirName := map[string][]string{}
	for _, characterResourceDirectoryName := range characterResourceDirectoryNames {
		partName := fmt.Sprintf("%s-%s",
			characterResourceDirectoryName.hairColor,
			characterResourceDirectoryName.hairShape)
		partNameToDirName[partName] = append(partNameToDirName[partName], characterResourceDirectoryName.String())
	}

	partNameToImages := map[string][]image.Image{}
	for partName, directoryNames := range partNameToDirName {
		images := []image.Image{}
		for _, directoryName := range directoryNames {
			directoryPath := filepath.Join(characterResourceDirectory, directoryName)
			decodedImage := openPngImage(filepath.Join(directoryPath, frameName))
			images = append(images, decodedImage)
		}
		partNameToImages[partName] = images
	}

	for partName, images := range partNameToImages {
		outFile, err := os.Create(fmt.Sprintf("./imagetestresult/%s-%s", partName, frameName))
		if err != nil {
			log.Fatalf("Error: %v\n", err)
		}
		defer outFile.Close()

		png.Encode(outFile, &merged{images, except})
		fmt.Printf("Merged %s.png into %s.png\n", partName, partName)
	}
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
