class InternalApi::Games::ChatsController < ApplicationController
  def create
    game = Game.find(params[:id])
    game.add_to_chat(account: current_account, message: params[:message])

    render json: {}, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end
end