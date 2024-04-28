package chat

import (
	"cuberoom-go/players"
	"cuberoom-go/players/playerstypes"
	"fmt"

	"github.com/mkafonso/go-verify/z"
	"github.com/zishang520/socket.io/socket"
)

func RegisterChatEvents(server *socket.Server, socket_ *socket.Socket) {
	socket_.On("addChat", func(datas ...any) {
		fmt.Println("addChat:", datas)

		input, err := checkAddChatInput(datas)
		if err != nil {
			fmt.Println("checkAddChatInput error:", err)
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

		server.Sockets().In(socket.Room(player.Floor)).Emit("addChat", AddChatOutput{
			Id:    string(input.Id),
			Chat:  input.Chat,
			Floor: player.Floor,
		})
	})

	socket_.On("removeChat", func(datas ...any) {
		fmt.Println("removeChat:", datas)

		input, err := checkRemoveChatInput(datas)
		if err != nil {
			fmt.Println("checkRemoveChatInput error:", err)
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

		server.Sockets().In(socket.Room(player.Floor)).Emit("removeChat", RemoveChatOutput{
			Id:    string(input.Id),
			Chat:  "",
			Floor: player.Floor,
		})
	})
}

type AddChatInput struct {
	Id   playerstypes.PlayerId `json:"id"`
	Chat string                `json:"chat"`
}

func checkAddChatInput(datas []any) (AddChatInput, error) {
	input := AddChatInput{}

	data, ok := datas[0].(map[string]interface{})
	if !ok {
		return input, fmt.Errorf("datas[0] is not a map[string]interface{} in addChat")
	}

	err := z.ParseStruct(data, &input)
	if err != nil {
		return input, fmt.Errorf("ParseStruct error: %w", err)
	}

	return input, nil
}

type AddChatOutput struct {
	Id    string `json:"id"`
	Chat  string `json:"chat"`
	Floor string `json:"floor"`
}

type RemoveChatInput struct {
	Id playerstypes.PlayerId `json:"id"`
}

func checkRemoveChatInput(datas []any) (RemoveChatInput, error) {
	input := RemoveChatInput{}

	data, ok := datas[0].(map[string]interface{})
	if !ok {
		return input, fmt.Errorf("datas[0] is not a map[string]interface{} in removeChat")
	}

	err := z.ParseStruct(data, &input)
	if err != nil {
		return input, fmt.Errorf("ParseStruct error: %w", err)
	}

	return input, nil
}

type RemoveChatOutput struct {
	Id    string `json:"id"`
	Chat  string `json:"chat"`
	Floor string `json:"floor"`
}
