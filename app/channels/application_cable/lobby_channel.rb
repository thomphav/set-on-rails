class ApplicationCable::LobbyChannel < ActionCable::Channel::Base
  RECEIVER_ACTIONS = OpenStruct.new(
    add: "add",
    update: "update",
    remove: "remove"
  )

  def subscribed
    stream_from "lobby"
  end
end