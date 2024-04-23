package db

import "testing"

func TestDBf(t *testing.T) {
	t.Log("TestDB")
	err := PrepareDB()
	if err != nil {
		t.Error("PrepareDB error", err)
	}
	database := GetDatabase()
	err = database.Ping()
	if err != nil {
		t.Error("database.Ping error", err)
	}
	CleanupDB()
}
