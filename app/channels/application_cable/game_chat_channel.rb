class ApplicationCable::GameChatChannel < ActionCable::Channel::Base
  def subscribed
    stream_from "game_#{params[:game_id]}_chat"
  end
end