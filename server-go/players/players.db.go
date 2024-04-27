package players

import (
	"fmt"
	"log"

	"cuberoom-go/db"

	sqlbuilder "github.com/huandu/go-sqlbuilder"
)

type Position struct {
	X int `db:"x" fieldtag:"pos"`
	Y int `db:"y" fieldtag:"pos"`
}

type PlayerRow struct {
	Position
	Id        string `db:"id"`
	Floor     string `db:"floor" fieldtag:"pos"`
	Direction string `db:"direction" fieldtag:"pos"`
	ImgUrl    string `db:"img_url"`
	Name      string `db:"name"`
	Password  string `db:"password"`
}

var PlayerStruct = sqlbuilder.NewStruct(new(PlayerRow))

func CreatePlayerTable() {
	ctb := sqlbuilder.NewCreateTableBuilder()
	ctb.CreateTable("players")
	ctb.Define("id", "TEXT", "NOT NULL", "PRIMARY KEY")
	ctb.Define("floor", "TEXT", "NOT NULL")
	ctb.Define("direction", "TEXT", "NOT NULL")
	ctb.Define("img_url", "TEXT", "NOT NULL")
	ctb.Define("name", "TEXT", "NOT NULL")
	ctb.Define("password", "TEXT", "NOT NULL")
	ctb.Define("x", "INTEGER", "NOT NULL")
	ctb.Define("y", "INTEGER", "NOT NULL")

	execResult, execErr := db.GetDatabase().Exec(ctb.String())
	if execErr != nil {
		log.Fatal("players table creation error", execErr)
	} else {
		fmt.Println("players table created", execResult)
	}
}

func InsertPlayer(player *PlayerRow) error {
	ib := PlayerStruct.InsertInto("players", player)
	sql, args := ib.Build()
	_, insertErr := db.GetDatabase().Exec(sql, args...)

	if insertErr != nil {
		return fmt.Errorf("insert player error: %v", insertErr)
	}
	return nil
}

func SelectPlayer(id string) (*PlayerRow, error) {
	sb := PlayerStruct.SelectFrom("players")
	sb.Where(sb.Equal("id", id))
	sql, args := sb.Build()
	fmt.Println("sql", sql, "args", args)
	row := db.GetDatabase().QueryRow(sql, args...)

	var player PlayerRow
	scanErr := row.Scan(PlayerStruct.Addr(&player)...)
	if scanErr != nil {
		return nil, fmt.Errorf("select player error: %v", scanErr)
	}
	fmt.Println("player", player)
	return &player, nil
}

func SelectAllPlayer() ([]*PlayerRow, error) {
	sb := PlayerStruct.SelectFrom("players")
	sql, args := sb.Build()
	rows, err := db.GetDatabase().Query(sql, args...)
	defer rows.Close()
	if err != nil {
		panic(fmt.Errorf("select all player error: %v", err))
	}

	var players []*PlayerRow
	for rows.Next() {
		var player PlayerRow
		scanErr := rows.Scan(PlayerStruct.Addr(&player)...)
		if scanErr != nil {
			panic(fmt.Errorf("scan player error: %v", scanErr))
		}
		players = append(players, &player)
	}
	return players, nil
}
