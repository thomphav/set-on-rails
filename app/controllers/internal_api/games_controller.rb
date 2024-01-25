class InternalApi::GamesController < ApplicationController
  def check_for_set
    game = Game.find(params[:game_id])
    game_cards = GameCard.where(id: params[:ids])

    result = game.check_three_for_set(game_cards)

    new_cards, three_cards, last_legs =
      if result
        game_cards.each { |gc| gc.update!(state: :used) }
        game.draw_cards(old_cards: game_cards.to_a)
      else
        [[], []]
      end

    render json: { result: result, new_cards: new_cards, three_cards: three_cards, game_over: last_legs }, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end
end
