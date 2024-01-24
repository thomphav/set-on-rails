class InternalApi::GamesController < ApplicationController
  def check_for_set
    game = Game.find(params[:game_id])
    game_cards = GameCard.where(id: params[:ids])

    result = game.check_three_for_set(game_cards)

    new_cards, three_cards =
      if result
        game_cards.each { |gc| gc.update!(state: :used) }
        game.draw_cards
      else
        [[], []]
      end

    render json: { result: result, new_cards: new_cards, three_cards: three_cards }, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end

  private

  # def check_for_set_params
  #   params.permit(:game_id, :game, ids: [])
  # end
end
