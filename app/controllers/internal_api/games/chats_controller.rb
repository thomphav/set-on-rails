class InternalApi::Games::ChatsController < ApplicationController
  def create
    game = Game.find(params[:id])
    account_key = game.add_to_chat(account: current_account, message: params[:message])
    message = game.get_message(account_key: account_key)

    ActionCable.server.broadcast("game_#{game.id}_chat", message.to_json)

    render json: {}, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end
end