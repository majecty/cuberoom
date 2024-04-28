package player

import (
	"cuberoom-go/db"
	"cuberoom-go/players"
	"cuberoom-go/players/playerstypes"
	"fmt"
)

func MovePlayer(playerId playerstypes.PlayerId, x int, y int, direction string, floor string) error {
	ub := players.PlayerStruct.WithTag("pos").
		Update("players",
			&players.PlayerRow{
				Position:  players.Position{X: x, Y: y},
				Direction: direction,
				Floor:     floor,
			})
	ub.Where(ub.Equal("id", playerId))
	sql, args := ub.Build()

	_, updateErr := db.GetDatabase().Exec(sql, args...)

	if updateErr != nil {
		return fmt.Errorf("update player error: %w", updateErr)
	}
	return nil
}
