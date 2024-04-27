package players

import (
	"cuberoom-go/players/playerstypes"
	"encoding/json"
	"fmt"

	"github.com/zishang520/socket.io/socket"
)

func BroadcastPlayers(io *socket.Server, updatedPlayers []playerstypes.PlayerId) {
	players, err := SelectPlayers(updatedPlayers)
	if err != nil {
		fmt.Printf("Error selecting players: %v\n", err)
		return
	}

	serializedPlayers := make([]string, len(players))
	for i, player := range players {
		serializedPlayer, err := json.Marshal(player)
		if err != nil {
			fmt.Printf("Error marshalling player: %v\n", err)
			return
		}
		serializedPlayers[i] = string(serializedPlayer)
	}

	playerOutputs := make([]*PlayerOutput, len(players))
	for i, player := range players {
		playerOutputs[i] = &PlayerOutput{}
		playerOutputs[i].fromPlayerRow(player)
	}
	io.Sockets().Emit("playerList", playerOutputs)
	fmt.Printf("call io.emt playerList with %d players\n", len(serializedPlayers))
	// io.Sockets().Emit("playerList", players)
	// io.Emit("debugMessage", serializedPlayers)
}
