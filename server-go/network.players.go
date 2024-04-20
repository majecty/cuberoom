package main

import (
	"fmt"

	"github.com/zishang520/socket.io/socket"
)

func RegisterPlayersEvents(socket *socket.Socket) {

	socket.On("getPlayers", func(datas ...any) {
		fmt.Println("getPlayers:", datas)
	})
}
