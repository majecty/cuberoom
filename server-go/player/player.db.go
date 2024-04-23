package player

import (
	"cuberoom-go/db"
	"cuberoom-go/players"
	"fmt"
)

func MovePlayer(playerId string, x int, y int) error {
	ub := players.PlayerStruct.WithTag("pos").Update("players", &players.PlayerRow{Position: players.Position{X: x, Y: y}})
	ub.Where(ub.Equal("id", playerId))
	sql, args := ub.Build()
	fmt.Printf("sql: %s, args: %v\n", sql, args)

	_, updateErr := db.GetDatabase().Exec(sql, args...)

	if updateErr != nil {
		return fmt.Errorf("update player error: %v", updateErr)
	}
	return nil
}
