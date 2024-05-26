package main

import (
	"fmt"

	"github.com/bitfield/script"
)

func main() {
	ensureCuberoomRoot()
	fmt.Println("Hello, World!")
}

func ensureCuberoomRoot() {
	err := script.IfExists("cuberoom-root").Error()
	if err != nil {
		panic(fmt.Errorf("cuberoom-root not found %w", err))
	}
}
