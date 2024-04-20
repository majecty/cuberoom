package main

import (
	"fmt"

	"github.com/zishang520/socket.io/socket"
)


func RegisterChatEvents(socket *socket.Socket) {
	socket.On("addChat", func(datas ...any) {
		fmt.Println("addChat:", datas)
	})

	socket.On("removeChat", func(datas ...any) {
		fmt.Println("removeChat:", datas)
	})
}
