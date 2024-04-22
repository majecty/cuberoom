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

	pingErr := database.Ping()
	if pingErr != nil {
		log.Fatal(pingErr)
	}
	fmt.Println("Connected to the database")

	// sql := sqlbuilder.CreateTable("players").
	// String()
	ctb := sqlbuilder.NewCreateTableBuilder()
	ctb.CreateTable("players")
	ctb.Define("id", "TEXT", "NOT NULL", "PRIMARY KEY")
	ctb.Define("floor", "TEXT", "NOT NULL")
	ctb.Define("img_url", "TEXT", "NOT NULL")
	ctb.Define("name", "TEXT", "NOT NULL")
	ctb.Define("password", "TEXT", "NOT NULL")
	ctb.Define("x", "INTEGER", "NOT NULL")
	ctb.Define("y", "INTEGER", "NOT NULL")

	fmt.Printf("sql: %s\n", ctb.String())

	execResult, execErr := database.Exec(ctb.String())
	if execErr != nil {
		log.Fatal("players table creation error", execErr)
	} else {
		fmt.Println("players table created", execResult)
	}

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
