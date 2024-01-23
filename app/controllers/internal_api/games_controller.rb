class InternalApi::GamesController < ApplicationController
  def check_for_set
    game = Game.find(check_for_set_params[:game_id])
    game_cards = GameCard.where(id: check_for_set_params[:ids])

    result = game.check_for_set(game_cards)

    new_cards = if result
      game_cards.each { |gc| gc.update!(state: :used) }
      game.draw_cards
    else
      []
    end

    render json: { result: result, new_cards: new_cards }, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end

  private

  def check_for_set_params
    params.permit(:game_id, :ids)
  end
end
