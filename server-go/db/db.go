package db

import (
	"database/sql"
	"fmt"
	"log"

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

	CreatePlayerTable()

	return nil
}

func CleanupDB() {
	if database == nil {
		panic("Database not initialized")
	}
	database.Close()
}
