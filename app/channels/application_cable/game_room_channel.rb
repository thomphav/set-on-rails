class ApplicationCable::GameRoomChannel < ActionCable::Channel::Base
  def subscribed
    stream_from "game_#{params[:game_id]}_room"
  end
end