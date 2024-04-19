package main

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
	"github.com/zishang520/socket.io/socket"
)

func main() {
	io := socket.NewServer(nil, nil)
    http.Handle("/socket.io/", io.ServeHandler(nil))

	io.On("connection", func(clients ...any) {
        client := clients[0].(*socket.Socket)
		fmt.Println("connected:", client.Id())

        client.On("event", func(datas ...any) {
			fmt.Println("event:", datas)
        })

		client.On("getPlayers", func(datas ...any) {
			fmt.Println("getPlayers:", datas)
		})

		client.On("moveFloor", func(datas ...any) {
			fmt.Println("moveFloor:", datas)
		})

		client.On("addChat", func(datas ...any) {
			fmt.Println("addChat:", datas)
		})

		client.On("removeChat", func(datas ...any) {
			fmt.Println("removeChat:", datas)
		})

		client.On("movePlayer", func(datas ...any) {
			fmt.Println("movePlayer:", datas)
		})
		
        client.On("disconnect", func(...any) {
			fmt.Println("disconnect")
        })
    })
	fmt.Println("Hello, worlsd.")
	handler := cors.AllowAll().Handler(http.DefaultServeMux)
    // handler := cors.Default().Handler(mux)
    // http.ListenAndServe(":8080", handler)
    http.ListenAndServe(":3000", handler)
}
