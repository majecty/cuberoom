package players

import (
	"fmt"

	"github.com/mkafonso/go-verify/z"
	"github.com/zishang520/socket.io/socket"
)

type PlayerAddInput struct {
	Id       string `json:"id"`
	Floor    string `json:"floor"`
	ImgUrl   string `json:"imgUrl"`
	Name     string `json:"name"`
	Password string `json:"password"`
	X        int    `json:"x"`
	Y        int    `json:"y"`
}

func RegisterPlayersEvents(socket *socket.Socket) {

	socket.On("getPlayers", func(datas ...any) {
		fmt.Println("getPlayers:", datas)

	})

	socket.On("addPlayer", func(datas ...any) {
		fmt.Println("addPlayer:", datas)

		player := PlayerAddInput{}
		data, ok := datas[0].(map[string]interface{})
		if !ok {
			fmt.Println("Invalid data format")
			return
		}
		err := z.ParseStruct(data, &player)
		if err != nil {
			fmt.Println("Error parsing struct:", err)
			return
		}
		fmt.Println("Player:", player)
	})
}

func AddPlayer(player *PlayerAddInput) {
	fmt.Println("AddPlayer:", player)
}
