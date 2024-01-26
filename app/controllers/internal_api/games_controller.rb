class InternalApi::GamesController < ApplicationController
  def update
    game = Game.find(games_params[:id])

    start_time_seconds = games_params[:start_time] / 1000.to_f
    game.update!(start_time: Time.at(start_time_seconds))

    render json: { start_time: game.start_time.to_i * 1000 }, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end

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

  private

  def games_params
    params.permit(:id, :start_time, :end_time)
  end
end
