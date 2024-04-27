package main

import (
	"context"
	"fmt"
	"net/http"

	"cuberoom-go/chat"
	"cuberoom-go/db"
	"cuberoom-go/db/initializer"
	globalevents "cuberoom-go/global_events"
	"cuberoom-go/player"
	"cuberoom-go/players"

	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/cors"
	"github.com/zishang520/socket.io/socket"
)

func main() {
	db.PrepareDB()
	initializer.Initialize()
	defer db.CleanupDB()

	io := socket.NewServer(nil, nil)
	http.Handle("/socket.io/", io.ServeHandler(nil))

	io.On("connection", func(clients ...any) {
		client := clients[0].(*socket.Socket)
		fmt.Println("connected:", client.Id())
		io.Emit("debugMessage", "connected using io.Emit")
		client.Emit("debugMessage", "connected using client.Emit")
		io.Send("hello")

		players.RegisterPlayersEvents(io, client)
		chat.RegisterChatEvents(client)
		player.RegisterPlayerEvents(io, client)

		client.On("disconnect", func(...any) {
			fmt.Println("disconnect")
		})
	})
	fmt.Println("Hello, worlsd.")
	handler := cors.AllowAll().Handler(http.DefaultServeMux)

	go globalevents.GlobalEventHandlerLoop(context.Background(), io)
	http.ListenAndServe(":3000", handler)
	fmt.Println("Server started on port 3000.")
}
