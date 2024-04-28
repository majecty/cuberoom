package player

import (
	"cuberoom-go/db"
	"cuberoom-go/players"
	"cuberoom-go/players/playerstypes"
	"fmt"

	"github.com/zishang520/socket.io/socket"
)

func MovePlayer(playerId playerstypes.PlayerId, x int, y int, direction string, floor string, socketId socket.SocketId) error {
	ub := players.PlayerStruct.WithTag("pos").
		Update("players",
			&players.PlayerRow{
				Position:  players.Position{X: x, Y: y},
				Direction: direction,
				Floor:     floor,
				SocketId:  string(socketId),
			})
	ub.Where(ub.Equal("id", playerId))
	sql, args := ub.Build()

	_, updateErr := db.GetDatabase().Exec(sql, args...)

	if updateErr != nil {
		return fmt.Errorf("update player error: %w", updateErr)
	}
	return nil
}

func MoveFloor(playerId playerstypes.PlayerId, password string, floor string, socketId socket.SocketId) error {
	ub := players.PlayerStruct.WithTag("pos").
		Update("players",
			&players.PlayerRow{
				Floor:    floor,
				SocketId: string(socketId),
			})
	ub.Where(ub.Equal("id", playerId))
	sql, args := ub.Build()

	_, updateErr := db.GetDatabase().Exec(sql, args...)

	if updateErr != nil {
		return fmt.Errorf("update player error: %w", updateErr)
	}
	return nil
}
