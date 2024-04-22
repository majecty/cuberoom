package main

import (
	"fmt"
	"net/http"

	"cuberoom-go/db"
	network "cuberoom-go/network"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
	"github.com/zishang520/socket.io/socket"
)

func main() {
	db.PrepareDB()
	defer db.CleanupDB()

	io := socket.NewServer(nil, nil)
	http.Handle("/socket.io/", io.ServeHandler(nil))

	io.On("connection", func(clients ...any) {
		client := clients[0].(*socket.Socket)
		fmt.Println("connected:", client.Id())

		network.RegisterPlayersEvents(client)
		network.RegisterChatEvents(client)
		network.RegisterPlayerEvents(client)

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
