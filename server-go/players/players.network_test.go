package players

import (
	"cuberoom-go/db"
	"testing"
)

func TestCheckPlayerInput(t *testing.T) {
	testInput := map[string]interface{}{
		"id":       "1",
		"floor":    "first floor",
		"imgUrl":   "https://example.com",
		"name":     "test",
		"password": "test",
		"x":        0,
		"y":        0,
	}
	player, err := CheckPlayerInput(testInput)
	if err != nil {
		t.Error("CheckPlayerInput error", err)
	}

	if player.Id != "1" {
		t.Error("player.Id != 1", player.Id)
	}
}

func TestAddAndGetAllPlayer(t *testing.T) {
	db.PrepareDB()
	CreatePlayerTable()
	defer db.CleanupDB()
	t.Log("TestDB")

	_, err := AddPlayer(&PlayerAddInput{
		Id:       "1",
		Floor:    "first floor",
		ImgUrl:   "https://example.com",
		Name:     "test",
		Password: "test",
		X:        0,
		Y:        0,
	})

	if err != nil {
		t.Error("AddPlayer error", err)
	}

	players, err := GetAllPlayer()
	if err != nil {
		t.Error("GetAllPlayer error", err)
	}

	if len(players) != 1 {
		t.Error("len(players) != 1", len(players))
	}
	if players[0].Id != "1" {
		t.Error("players[0].Id != 1", players[0].Id)
	}
	if players[0].Name != "test" {
		t.Error("players[0].Name != test", players[0].Name)
	}
}

func TestFromPlayerRow(t *testing.T) {
	playerRow := &PlayerRow{
		Id:       "1",
		Floor:    "first floor",
		ImgUrl:   "https://example.com",
		Name:     "test",
		Password: "test",
		X:        0,
		Y:        0,
	}

	playerOutput := &PlayerOutput{}
	playerOutput.fromPlayerRow(playerRow)

	if playerOutput.Id != "1" {
		t.Error("playerOutput.Id != 1", playerOutput.Id)
	}
	if playerOutput.Name != "test" {
		t.Error("playerOutput.Name != test", playerOutput.Name)
	}
}
