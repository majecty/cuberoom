package players

import (
	"database/sql"
	"errors"
	"fmt"
	"log"

	"cuberoom-go/db"
	"cuberoom-go/players/playerstypes"

	sqlbuilder "github.com/huandu/go-sqlbuilder"
	"github.com/mattn/go-sqlite3"
	"github.com/zishang520/socket.io/socket"
)

type Position struct {
	X int `db:"x" fieldtag:"pos"`
	Y int `db:"y" fieldtag:"pos"`
}

type PlayerRow struct {
	Position
	Id        playerstypes.PlayerId `db:"id"`
	Floor     string                `db:"floor" fieldtag:"pos"`
	Direction string                `db:"direction" fieldtag:"pos"`
	ImgUrl    string                `db:"img_url"`
	Name      string                `db:"name"`
	Password  string                `db:"password"`
	SocketId  string                `db:"socket_id" fieldtag:"pos"`
}

var ErrPlayerIdDuplicated = errors.New("player id duplicated")

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
	ctb.Define("socket_id", "TEXT", "NOT NULL")

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
		sqlError := sqlite3.Error{}
		if errors.As(insertErr, &sqlError) {
			if sqlError.ExtendedCode == sqlite3.ErrConstraintPrimaryKey {
				return ErrPlayerIdDuplicated
			}

		}
		return fmt.Errorf("insert player error: %w", insertErr)
	}
	return nil
}

func UpdatePlayer(player *PlayerRow) error {
	ub := PlayerStruct.Update("players", player)
	ub.Where(ub.Equal("id", player.Id))
	sql, args := ub.Build()

	_, updateErr := db.GetDatabase().Exec(sql, args...)

	if updateErr != nil {
		return fmt.Errorf("update player error: %w", updateErr)
	}
	return nil
}

func SelectPlayer(id playerstypes.PlayerId) (*PlayerRow, error) {
	sb := PlayerStruct.SelectFrom("players")
	sb.Where(sb.Equal("id", id))
	sql_, args := sb.Build()
	row := db.GetDatabase().QueryRow(sql_, args...)

	var player PlayerRow
	scanErr := row.Scan(PlayerStruct.Addr(&player)...)
	if errors.Is(scanErr, sql.ErrNoRows) {
		return nil, nil
	}
	if scanErr != nil {
		return nil, fmt.Errorf("select player error: %w", scanErr)
	}
	return &player, nil
}

func SelectPlayerBySocketId(socketId socket.SocketId) (*PlayerRow, error) {
	sb := PlayerStruct.SelectFrom("players")
	sb.Where(sb.Equal("socket_id", string(socketId)))
	sql_, args := sb.Build()
	row := db.GetDatabase().QueryRow(sql_, args...)

	var player PlayerRow
	scanErr := row.Scan(PlayerStruct.Addr(&player)...)
	if errors.Is(scanErr, sql.ErrNoRows) {
		return nil, nil
	}
	if scanErr != nil {
		return nil, fmt.Errorf("select player error: %w", scanErr)
	}
	return &player, nil
}

func SelectAllPlayer() ([]*PlayerRow, error) {
	sb := PlayerStruct.SelectFrom("players")
	sql, args := sb.Build()
	rows, err := db.GetDatabase().Query(sql, args...)
	if err != nil {
		panic(fmt.Errorf("select all player error: %w", err))
	}
	defer rows.Close()

	var players []*PlayerRow
	for rows.Next() {
		var player PlayerRow
		scanErr := rows.Scan(PlayerStruct.Addr(&player)...)
		if scanErr != nil {
			panic(fmt.Errorf("scan player error: %w", scanErr))
		}
		players = append(players, &player)
	}
	return players, nil
}

func SelectPlayers(playerIds []playerstypes.PlayerId) ([]*PlayerRow, error) {
	var idInterfaces []interface{}
	for _, id := range playerIds {
		idInterfaces = append(idInterfaces, id)
	}

	sb := PlayerStruct.SelectFrom("players")
	sb.Where(sb.In("id", idInterfaces...))
	sql, args := sb.Build()
	rows, err := db.GetDatabase().Query(sql, args...)
	if err != nil {
		panic(fmt.Errorf("select all player error: %w", err))
	}
	defer rows.Close()

	var players []*PlayerRow
	for rows.Next() {
		var player PlayerRow
		scanErr := rows.Scan(PlayerStruct.Addr(&player)...)
		if scanErr != nil {
			panic(fmt.Errorf("scan player error: %w", scanErr))
		}
		players = append(players, &player)
	}
	return players, nil
}

func RemovePlayer(id playerstypes.PlayerId) error {
	db_ := PlayerStruct.DeleteFrom("players")
	db_.Where(db_.Equal("id", id))
	sql, args := db_.Build()
	_, deleteErr := db.GetDatabase().Exec(sql, args...)
	if deleteErr != nil {
		return fmt.Errorf("delete player error: %w", deleteErr)
	}
	return nil
}

func RemovePlayerBySocketId(socketId socket.SocketId) error {
	db_ := PlayerStruct.DeleteFrom("players")
	db_.Where(db_.Equal("socket_id", string(socketId)))
	sql, args := db_.Build()
	_, deleteErr := db.GetDatabase().Exec(sql, args...)
	if deleteErr != nil {
		return fmt.Errorf("delete player error: %w", deleteErr)
	}
	return nil
}
