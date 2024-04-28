package chat

import (
	"cuberoom-go/players"
	"fmt"

	"github.com/mkafonso/go-verify/z"
	"github.com/zishang520/socket.io/socket"
)

func RegisterChatEvents(server *socket.Server, socket *socket.Socket) {
	socket.On("addChat", func(datas ...any) {
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

		server.Sockets().Emit("addChat", AddChatOutput{
			Id:    input.Id,
			Chat:  input.Chat,
			Floor: player.Floor,
		})
	})

	socket.On("removeChat", func(datas ...any) {
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

		server.Sockets().Emit("removeChat", RemoveChatOutput{
			Id:    input.Id,
			Chat:  "",
			Floor: player.Floor,
		})
	})
}

type AddChatInput struct {
	Id   string `json:"id"`
	Chat string `json:"chat"`
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
	Id string `json:"id"`
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
