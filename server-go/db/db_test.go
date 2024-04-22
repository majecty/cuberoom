package db

import (
	"testing"
)

func TestDB(t *testing.T) {
	PrepareDB()
	defer CleanupDB()
	t.Log("TestDB")

	err := InsertPlayer(&PlayerRow{
		Id:       "1",
		Floor:    "first floor",
		ImgUrl:   "https://example.com",
		Name:     "test",
		Password: "test",
		X:        0,
		Y:        0,
	})

	if err != nil {
		t.Error("InsertPlayer error", err)
	}

	player, err := SelectPlayer("1")
	if err != nil {
		t.Error("SelectPlayer error", err)
	}
	if player.Id != "1" {
		t.Error("player.Id != 1", player.Id)
	}
	if player.Name != "test" {
		t.Error("player.Name != test", player.Name)
	}
}
