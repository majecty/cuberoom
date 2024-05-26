package main

import (
	"fmt"
	"log"

	"github.com/bitfield/script"
)

func main() {
	ensureCuberoomRoot()
	ensureAWSCLI()
	runAWSS3Sync()

	fmt.Println("Hello, World!")
}

func runAWSS3Sync() {
	command := "aws s3 sync client/public s3://cuberoom"
	// TODO: confirm from user
	_, err := script.Exec(command).Stdout()
	if err != nil {
		panic(fmt.Errorf("error syncing to s3 %w", err))
	}
}

func ensureAWSCLI() {
	log.Printf("NOT IMPLEMENTED: Checking for AWS CLI")
}

func ensureCuberoomRoot() {
	err := script.IfExists("cuberoom-root").Error()
	if err != nil {
		panic(fmt.Errorf("cuberoom-root not found %w", err))
	}
}
