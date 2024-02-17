class ApplicationCable::GameChannel < ActionCable::Channel::Base
  def subscribed
    stream_from "game_#{params[:game_id]}"
  end
end