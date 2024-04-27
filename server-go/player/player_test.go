package player

import (
	"cuberoom-go/db"
	"cuberoom-go/players"
	"testing"
)

func TestMove(t *testing.T) {
	db.PrepareDB()
	players.CreatePlayerTable()
	defer db.CleanupDB()

	_, err := players.AddPlayer(&players.PlayerAddInput{
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

	MovePlayer("1", 1, 2, "up", "first floor")
	player, err := players.SelectPlayer("1")
	if err != nil {
		t.Error("SelectPlayer error", err)
	}

	if player.Id != "1" {
		t.Error("player.Id != 1", player.Id)
	}
	if player.X != 1 {
		t.Error("player.X != 1", player.X)
	}
	if player.Y != 2 {
		t.Error("player.Y != 2", player.Y)
	}
}
