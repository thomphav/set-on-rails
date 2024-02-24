class ApplicationCable::GameRoomChannel < ActionCable::Channel::Base
  RECEIVER_ACTIONS = OpenStruct.new(
    start: "start",
  )

  def subscribed
    stream_from "game_#{params[:game_id]}_room"

    # change to a token
    game = Game.find(params[:game_id])
    game.add_to_room(account: Account.find(params[:current_account_id]))
    room = game.get_room

    ActionCable.server.broadcast("game_#{game.id}_room", room.to_json)
  end

  def unsubscribed
    game = Game.find(params[:game_id])
    game.remove_from_room(account_id: params[:current_account_id])

    ActionCable.server.broadcast("game_#{params[:game_id]}_room", game.room.get_room.to_json)
  end
end