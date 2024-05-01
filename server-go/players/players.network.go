package players

import (
	"cuberoom-go/players/playerstypes"
	"errors"
	"fmt"

	"github.com/mkafonso/go-verify/z"
	"github.com/zishang520/socket.io/socket"
)

type PlayerAddInput struct {
	Id       playerstypes.PlayerId `json:"id"`
	Floor    string                `json:"floor"`
	ImgUrl   string                `json:"imgUrl"`
	Name     string                `json:"name"`
	Password string                `json:"password"`
	X        int                   `json:"x"`
	Y        int                   `json:"y"`
}

type PlayerOutput struct {
	Id       playerstypes.PlayerId `json:"id"`
	Floor    string                `json:"floor"`
	ImgUrl   string                `json:"imgUrl"`
	Name     string                `json:"name"`
	Password string                `json:"password"`
	X        int                   `json:"x"`
	Y        int                   `json:"y"`
}

func (player *PlayerOutput) fromPlayerRow(row *PlayerRow) {
	player.Id = row.Id
	player.Floor = row.Floor
	player.ImgUrl = row.ImgUrl
	player.Name = row.Name
	player.Password = row.Password
	player.X = row.X
	player.Y = row.Y
}

func RegisterPlayersEvents(io *socket.Server, socket_ *socket.Socket) {
	socket_.On("getPlayers", func(datas ...any) {
		players, err := GetAllPlayer()
		if err != nil {
			fmt.Println("Error getting players:", err)
			return
		}
		playerOutputs := make([]*PlayerOutput, len(players))
		for i, player := range players {
			playerOutputs[i] = &PlayerOutput{}
			playerOutputs[i].fromPlayerRow(player)
		}

		socket_.Emit("playerList", playerOutputs)

		// socket_.Emit("debugPlayerList", playerOutputs)
		// socket_.Emit("debugMessage", playerOutputs)
	})

	socket_.On("addPlayer", func(datas ...any) {
		fmt.Println("addPlayer:", datas)

		player, err := CheckPlayerInput(datas)
		if err != nil {
			fmt.Println("Error checking player input:", err)
			return
		}

		row, err := AddPlayer(&player, socket_.Id())
		if err != nil {
			fmt.Println("Error adding player:", err)
			return
		}

		socket_.Join(socket.Room(player.Floor))

		playerOutputs := make([]*PlayerOutput, 1)
		playerOutputs[0] = &PlayerOutput{}
		playerOutputs[0].fromPlayerRow(row)
		io.Sockets().Emit("playerList", playerOutputs)
	})

	socket_.On("disconnect", func(datas ...any) {
		fmt.Println("disconnect:", datas)

		player, err := SelectPlayerBySocketId(socket_.Id())
		if err != nil {
			fmt.Println("Error selecting player by socket id:", err)
			return
		}
		if player == nil {
			fmt.Println("Player not found by socket id")
			return
		}

		err = RemovePlayerBySocketId(socket_.Id())
		if err != nil {
			fmt.Println("Error removing player by socket id:", err)
			return
		}

		io.Sockets().Emit("removePlayer", player.Id)
	})
}

func CheckPlayerInput(datas []any) (PlayerAddInput, error) {
	player := PlayerAddInput{}

	fmt.Println("datas[0]:", datas[0])
	fmt.Println("type of datas[0]:", fmt.Sprintf("%T", datas[0]))
	data, ok := datas[0].(map[string]interface{})
	if !ok {
		return player, fmt.Errorf("invalid data format")
	}

	err := z.ParseStruct(data, &player)
	if err != nil {
		return player, fmt.Errorf("error parsing struct: %w", err)
	}

	return player, nil
}

func AddPlayer(player *PlayerAddInput, socketId socket.SocketId) (*PlayerRow, error) {
	playerRow := &PlayerRow{
		Id:       player.Id,
		Floor:    player.Floor,
		ImgUrl:   player.ImgUrl,
		Name:     player.Name,
		Password: player.Password,
		Position: Position{
			X: player.X,
			Y: player.Y,
		},
		SocketId: string(socketId),
	}
	err := InsertPlayer(playerRow)
	if errors.Is(err, ErrPlayerIdDuplicated) {
		err = UpdatePlayer(playerRow)
		if err != nil {
			return nil, fmt.Errorf("update player error: %w", err)
		}
	}

	return playerRow, err
}

func GetAllPlayer() ([]*PlayerRow, error) {
	return SelectAllPlayer()
}
