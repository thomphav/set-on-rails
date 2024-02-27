class InternalApi::GamesController < ApplicationController
  def start
    game = Game.find(params[:game_id])
    accounts = game.get_room_accounts
    accounts.each { _1.game_players.create!(game: game) }

    game.clear_room
    ActionCable.server.broadcast("lobby", { game: game, action: ApplicationCable::LobbyChannel::RECEIVER_ACTIONS.remove }.to_json)
    ActionCable.server.broadcast("game_#{params[:game_id]}_room", { action: ApplicationCable::GameRoomChannel::RECEIVER_ACTIONS.start }.to_json)
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
    result = game.set_from_cards?(game_cards: game_cards)

    new_cards, three_cards, game_over, num_of_cards_in_deck = game.handle_result(result: result, game_cards: game_cards, current_account: current_account)

    game.mark_as_finished! if game_over && game.active?

    data = {
      result: result,
      new_cards: new_cards,
      three_cards: three_cards,
      game_over: game_over,
      num_of_cards_in_deck: num_of_cards_in_deck,
      leaderboard: game.leaderboard,
      scorer_id: result ? current_account.id : nil,
      end_time: game.end_time ? game.end_time&.to_i * 1000 : nil
    }

    ActionCable.server.broadcast("game_#{game.id}", data.to_json)

    render json: result, status: :ok
  rescue StandardError => e
    Rails.logger.error("Error checking for set: #{e}")
    render json: { error: e }, status: :unprocessable_entity
  end

  private

  def games_params
    params.permit(:id, :start_time, :end_time)
  end
end
