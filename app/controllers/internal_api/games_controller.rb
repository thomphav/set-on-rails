class InternalApi::GamesController < ApplicationController
  def start
    ActionCable.server.broadcast("game_#{params[:game_id]}_room", { action: :start }.to_json)
  end

  def show
    game = Game.find(params[:id])

    render json: game, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end

  def update
    game = Game.find(games_params[:id])

    params.slice(:start_time, :end_time).each do |key, time_in_ms|
      time_seconds = time_in_ms / 1000.to_f
      params[key] = Time.at(time_seconds)
    end

    game.update!(games_params)

    render json: { start_time: game.start_time.to_i * 1000 }, status: :ok
  rescue StandardError => e
    render json: { error: e }, status: :unprocessable_entity
  end

  def check_for_set
    game = Game.find(params[:game_id])
    game_cards = GameCard.where(id: params[:ids])

    result = game.check_three_for_set(game_cards)

    new_cards, three_cards, last_legs, num_of_cards_in_deck =
      if result
        game_cards.each { |gc| gc.update!(state: :used) }
        game.draw_cards(old_cards: game_cards.to_a)
      else
        [[], []]
      end

    data = {
      result: result,
      new_cards: new_cards,
      three_cards: three_cards,
      game_over: last_legs,
      num_of_cards_in_deck: num_of_cards_in_deck
    }

    ActionCable.server.broadcast("game_#{game.id}", data.to_json)

    render json: data, status: :ok
  rescue StandardError => e
    Rails.logger.error("Error checking for set: #{e}")
    render json: { error: e }, status: :unprocessable_entity
  end

  private

  def games_params
    params.permit(:id, :start_time, :end_time)
  end
end
