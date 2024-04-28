package player

import (
	"fmt"

	globalevents "cuberoom-go/global_events"
	"cuberoom-go/players"
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

func RegisterPlayerEvents(server *socket.Server, socket_ *socket.Socket) {

	socket_.On("moveFloor", func(datas ...any) {
		fmt.Println("moveFloor:", datas)
		input, err := checkMoveFloorInput(datas)
		if err != nil {
			fmt.Println("checkMoveFloorInput error:", err)
			return
		}
		player, err := players.SelectPlayer(input.Id)
		if err != nil {
			fmt.Println("SelectPlayer error:", err)
			return
		}
		if player == nil {
			socket_.Emit("needLogin")
			return
		}
		err = MoveFloor(input.Id, input.Password, input.Floor, socket_.Id())
		if err != nil {
			fmt.Println("MoveFloor error:", err)
			return
		}

		socket_.Leave(socket.Room(player.Floor))
		socket_.Join(socket.Room(input.Floor))

		server.Sockets().Emit("removePlayer", input.Id)
	})

	socket_.On("movePlayer", func(datas ...any) {
		fmt.Println("movePlayer:", datas)
		input, err := checkMovePlayerInput(datas)
		if err != nil {
			fmt.Println("checkMovePlayerInput error:", err)
			return
		}
		player, err := players.SelectPlayer(input.Id)
		if err != nil {
			fmt.Println("SelectPlayer error:", err)
			return
		}
		if player == nil {
			socket_.Emit("needLogin")
			return
		}
		err = MovePlayer(input.Id, input.X, input.Y, input.Direction, input.Floor, socket_.Id())
		if err != nil {
			fmt.Println("MovePlayer error:", err)
			return
		}
		if player.Floor != input.Floor {
			socket_.Leave(socket.Room(player.Floor))
			socket_.Join(socket.Room(input.Floor))
		}

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
		return input, fmt.Errorf("ParseStruct error: %w", err)
	}

	return input, nil
}

type MoveFloorInput struct {
	Id       playerstypes.PlayerId `json:"id"`
	Password string                `json:"password"`
	Floor    string                `json:"floor"`
}

func checkMoveFloorInput(datas []any) (MoveFloorInput, error) {
	input := MoveFloorInput{}

	data, ok := datas[0].(map[string]interface{})
	if !ok {
		return input, fmt.Errorf("datas[0] is not a map[string]interface{} in moveFloor")
	}

	err := z.ParseStruct(data, &input)
	if err != nil {
		return input, fmt.Errorf("ParseStruct error: %w", err)
	}

	return input, nil
}
