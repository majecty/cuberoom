package db

import (
	"database/sql"
	"fmt"
	"log"

	sqlbuilder "github.com/huandu/go-sqlbuilder"
	_ "github.com/mattn/go-sqlite3"
)

var database *sql.DB

func PrepareDB() (err error) {
	if database != nil {
		panic("Database already initialized")
	}
	database, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatal(err)
	}

	// sql := sqlbuilder.CreateTable("players").
	// String()
	ctb := sqlbuilder.NewCreateTableBuilder()
	ctb.CreateTable("players")
	ctb.Define("id", "TEXT", "NOT NULL", "PRIMARY KEY", `COMMENT "player id"`)
	ctb.Define("floor", "TEXT", "NOT NULL", `COMMENT "player floor"`)
	ctb.Define("img_url", "TEXT", "NOT NULL", `COMMENT "player image url"`)
	ctb.Define("name", "TEXT", "NOT NULL", `COMMENT "player name"`)
	ctb.Define("password", "TEXT", "NOT NULL", `COMMENT "player password"`)
	ctb.Define("x", "INTEGER", "NOT NULL", `COMMENT "player x"`)
	ctb.Define("y", "INTEGER", "NOT NULL", `COMMENT "player y"`)

	fmt.Printf("sql: %s\n", ctb.String())

	// database.

	return nil
}

func CleanupDB() {
	if database == nil {
		panic("Database not initialized")
	}
	database.Close()
}

func InsertPlayer() {

}
