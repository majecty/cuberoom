package players

import (
	"cuberoom-go/db"
	"errors"
	"fmt"
	"testing"

	"github.com/mattn/go-sqlite3"
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
		Position: Position{
			X: 0,
			Y: 0,
		},
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

func TestInsertUniqueConstraintFail(t *testing.T) {
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
		Position: Position{
			X: 0,
			Y: 0,
		},
	})

	if err != nil {
		t.Error("InsertPlayer error", err)
	}

	err = InsertPlayer(&PlayerRow{
		Id:       "1",
		Floor:    "first floor x",
		ImgUrl:   "https://example.com",
		Name:     "test",
		Password: "test",
		Position: Position{
			X: 1,
			Y: 0,
		},
	})

	sqliteError := sqlite3.Error{}
	if errors.As(err, &sqliteError) {
		fmt.Println("Unique constraint error")
		fmt.Println("sqliteError.Code", sqliteError.Code)
		fmt.Println("sqliteError.ExtendedCode", sqliteError.ExtendedCode)
		fmt.Println("sqliteError.ExtendedCode", err.Error())
		if sqliteError.Code != sqlite3.ErrConstraint {
			t.Errorf("sqliteError.Code is not ErrConstraint")
		}
		if sqliteError.ExtendedCode != sqlite3.ErrConstraintPrimaryKey {
			t.Errorf("sqliteError.ExtendedCode is not ErrConstraintPrimaryKEy %v", int(sqliteError.ExtendedCode))
		}
	} else {
		t.Error("InsertPlayer error", err)
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
		Position: Position{
			X: 0,
			Y: 0,
		},
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
