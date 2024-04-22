package db

import (
	"fmt"
	"log"

	sqlbuilder "github.com/huandu/go-sqlbuilder"
)

type PlayerRow struct {
	Id       string `db:"id"`
	Floor    string `db:"floor"`
	ImgUrl   string `db:"img_url"`
	Name     string `db:"name"`
	Password string `db:"password"`
	X        int    `db:"x"`
	Y        int    `db:"y"`
}

var playerStruct = sqlbuilder.NewStruct(new(PlayerRow))

func CreatePlayerTable() {
	ctb := sqlbuilder.NewCreateTableBuilder()
	ctb.CreateTable("players")
	ctb.Define("id", "TEXT", "NOT NULL", "PRIMARY KEY")
	ctb.Define("floor", "TEXT", "NOT NULL")
	ctb.Define("img_url", "TEXT", "NOT NULL")
	ctb.Define("name", "TEXT", "NOT NULL")
	ctb.Define("password", "TEXT", "NOT NULL")
	ctb.Define("x", "INTEGER", "NOT NULL")
	ctb.Define("y", "INTEGER", "NOT NULL")

	execResult, execErr := database.Exec(ctb.String())
	if execErr != nil {
		log.Fatal("players table creation error", execErr)
	} else {
		fmt.Println("players table created", execResult)
	}
}

func InsertPlayer(player *PlayerRow) error {
	ib := playerStruct.InsertInto("players", player)
	sql, args := ib.Build()
	_, insertErr := database.Exec(sql, args...)

	if insertErr != nil {
		return fmt.Errorf("insert player error: %v", insertErr)
	}
	return nil
}

func SelectPlayer(id string) (*PlayerRow, error) {
	sb := playerStruct.SelectFrom("players")
	sb.Where(sb.Equal("id", id))
	sql, args := sb.Build()
	fmt.Println("sql", sql, "args", args)
	row := database.QueryRow(sql, args...)

	var player PlayerRow
	scanErr := row.Scan(playerStruct.Addr(&player)...)
	if scanErr != nil {
		return nil, fmt.Errorf("select player error: %v", scanErr)
	}
	fmt.Println("player", player)
	return &player, nil
}
