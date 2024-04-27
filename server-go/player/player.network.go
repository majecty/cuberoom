package player

import (
	"fmt"

	globalevents "cuberoom-go/global_events"
	"cuberoom-go/players/playerstypes"

	"github.com/mkafonso/go-verify/z"
	"github.com/zishang520/socket.io/socket"
)

type MovePlayerInput struct {
	Id        playerstypes.PlayerId `json:"id"`
	Password  string                `json:"password"`
	Floor     string                `json:"floor"`
	Direction string                `json:"direction"`
	X         int                   `json:"x"`
	Y         int                   `json:"y"`
}

func RegisterPlayerEvents(server *socket.Server, socket *socket.Socket) {

	socket.On("moveFloor", func(datas ...any) {
		fmt.Println("moveFloor:", datas)
	})

	socket.On("movePlayer", func(datas ...any) {
		fmt.Println("movePlayer:", datas)
		input, err := checkMovePlayerInput(datas)
		if err != nil {
			fmt.Println("checkMovePlayerInput error:", err)
			return
		}
		// server.Sockets().Emit("debugMessage", fmt.Sprintf("movePlayer: server sockets send"))
		// server.Emit("debugMessage", fmt.Sprintf("movePlayer: server send"))
		// socket.Send("debugMessage", fmt.Sprintf("movePlayer: socket send"))
		// socket.Broadcast().Emit("debugMessage", fmt.Sprintf("movePlayer: broadcast"))
		MovePlayer(input.Id, input.X, input.Y, input.Direction, input.Floor)

		globalevents.RegisterPlayerMove(input.Id)
	})
}

func checkMovePlayerInput(datas []any) (MovePlayerInput, error) {
	input := MovePlayerInput{}

	data, ok := datas[0].(map[string]interface{})
	if !ok {
		return input, fmt.Errorf("datas[0] is not a map[string]interface{} in movePlayer")
	}

	err := z.ParseStruct(data, &input)
	if err != nil {
		return input, fmt.Errorf("ParseStruct error: %v", err)
	}

	return input, nil
}
