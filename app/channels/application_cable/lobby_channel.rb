class ApplicationCable::LobbyChannel < ActionCable::Channel::Base
  RECEIVER_ACTIONS = OpenStruct.new(
    add: "add",
    add_all: "add_all",
    update: "update",
    remove: "remove"
  )

  def subscribed
    stream_from "lobby"

    @games = Game.pending.order(start_time: :desc)
    ActionCable.server.broadcast("lobby", { games: @games, action: ApplicationCable::LobbyChannel::RECEIVER_ACTIONS.add_all }.to_json)
  end
end