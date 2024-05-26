package main

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/bitfield/script"
	"github.com/manifoldco/promptui"
)

const (
	awsProfile = "juhyung"
)

func main() {
	ensureCuberoomRoot()
	ensureAWSCLI()
	runAWSS3Sync()

	fmt.Println("Done!")
}

func runAWSS3Sync() {
	command := fmt.Sprintf("aws s3 sync client/public s3://cuberoom --profile %s", awsProfile)
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
	cmd := "aws --version"
	fmt.Printf("Running command: %s\n", cmd)
	_, err := script.Exec("aws --version").Stdout()
	if err != nil {
		panic(fmt.Errorf("aws cli (%s) failed %w", cmd, err))
	}

	getProfile := fmt.Sprintf("aws configure get aws_access_key_id --profile %s", awsProfile)
	fmt.Printf("Running command: %s\n", getProfile)
	if _, err := script.Exec(getProfile).WithStderr(os.Stderr).Stdout(); err != nil {
		panic(fmt.Errorf("aws cli (%s) failed %w", getProfile, err))
	}

	callerIdentity := fmt.Sprintf("aws sts get-caller-identity --profile %s", awsProfile)
	fmt.Printf("Running command: %s\n", callerIdentity)
	if _, err := script.Exec(callerIdentity).Stdout(); err != nil {
		panic(fmt.Errorf("aws cli (%s) failed %w", callerIdentity, err))
	}

	prmpt := promptui.Prompt{
		Label:     "AWS CLI 확인 완료?",
		IsConfirm: true,
	}
	if _, err := prmpt.Run(); err != nil {
		if errors.Is(promptui.ErrAbort, err) || errors.Is(promptui.ErrInterrupt, err) {
			fmt.Println("취소되었습니다.")
			os.Exit(0)
		}
		panic(fmt.Errorf("prompt failed %w", err))
	}
}

func ensureCuberoomRoot() {
	err := script.IfExists("cuberoom-root").Error()
	if err != nil {
		panic(fmt.Errorf("cuberoom-root not found %w", err))
	}
}
