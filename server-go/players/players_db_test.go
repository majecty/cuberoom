package players

import (
	"cuberoom-go/db"
	"testing"
)

func TestInsertSelect(t *testing.T) {
	db.PrepareDB()
	CreatePlayerTable()
	defer db.CleanupDB()
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

func TestInsertSelectAll(t *testing.T) {
	db.PrepareDB()
	CreatePlayerTable()
	defer db.CleanupDB()
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

	player, err := SelectAllPlayer()
	if err != nil {
		t.Error("SelectPlayer error", err)
	}
	if player[0].Id != "1" {
		t.Error("player.Id != 1", player[0].Id)
	}
	if player[0].Name != "test" {
		t.Error("player.Name != test", player[0].Name)
	}
}
