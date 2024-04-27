package globalevents

import (
	"context"
	"cuberoom-go/players"
	"cuberoom-go/players/playerstypes"
	"fmt"
	"time"

	"github.com/emirpasic/gods/v2/sets/hashset"
	"github.com/zishang520/socket.io/socket"
)

type GlobalEvent struct {
	updatedPlayers *hashset.Set[playerstypes.PlayerId]
	channel        chan playerstypes.PlayerId
}

var globalEvent GlobalEvent = GlobalEvent{
	updatedPlayers: hashset.New[playerstypes.PlayerId](),
	channel:        make(chan playerstypes.PlayerId, 100),
}

func RegisterPlayerMove(playerId playerstypes.PlayerId) {
	globalEvent.channel <- playerId
}

func GlobalEventHandlerLoop(ctx context.Context, io *socket.Server) {
	for {
		time.Sleep(300 * time.Millisecond)
		select {
		case <-ctx.Done():
			return
		default:
			handleEvents(io)
			// trigger player move
		}
	}
}

func handleEvents(io *socket.Server) {
loop:
	for {
		select {
		case playerId := <-globalEvent.channel:
			globalEvent.updatedPlayers.Add(playerId)
		default:
			break loop
		}
	}
	if globalEvent.updatedPlayers.Size() == 0 {
		return
	}
	fmt.Printf("Broadcasting %d players\n", globalEvent.updatedPlayers.Size())
	players.BroadcastPlayers(io, globalEvent.updatedPlayers.Values())
	globalEvent.updatedPlayers.Clear()
}
