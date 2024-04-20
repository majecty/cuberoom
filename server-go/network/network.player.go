package network

import (
	"fmt"

	"github.com/zishang520/socket.io/socket"
)

func RegisterPlayerEvents(socket *socket.Socket) {

	socket.On("moveFloor", func(datas ...any) {
		fmt.Println("moveFloor:", datas)
	})

	socket.On("movePlayer", func(datas ...any) {
		fmt.Println("movePlayer:", datas)
	})
		
}
