package main

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/bitfield/script"
	"github.com/manifoldco/promptui"
)

func main() {
	ensureCuberoomRoot()
	ensureAWSCLI()
	runAWSS3Sync()

	fmt.Println("Hello, World!")
}

func runAWSS3Sync() {
	command := "aws s3 sync client/public s3://cuberoom"
	prmpt := promptui.Prompt{
		Label:     "다음 명령어를 실행할까요? " + command,
		IsConfirm: true,
	}

	prompt, err := prmpt.Run()
	if errors.Is(promptui.ErrAbort, err) || errors.Is(promptui.ErrInterrupt, err) {
		fmt.Println("취소되었습니다.")
		os.Exit(0)
	}
	if err != nil {
		panic(fmt.Errorf("prompt failed %w", err))
	}
	if prompt != "y" && prompt != "Y" {
		panic("prompt should return Y or y")
	}

	fmt.Println("실행중...")
	_, err = script.Exec(command).Stdout()
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
