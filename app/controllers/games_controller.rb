class GamesController < ApplicationController
  before_action :authenticate
  protect_from_forgery with: :exception

  def create
    game = current_account.games.build

    Game.transaction do
      game.save!

      shuffled_cards = Card.all.shuffle

      shuffled_cards.each_with_index do |card, index|
        c = game.game_cards.create!(
          card: card
        )

        c.update!(state: :drawn, position: index) if index < 12
      end
    end

    game.reload

    # need to skip current_account here
    ActionCable.server.broadcast("lobby", { game: game, action: ApplicationCable::LobbyChannel::RECEIVER_ACTIONS.add }.to_json)

    redirect_to room_game_path(game.id)
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end

  def show
    @game = Game.find(params[:id])

    redirect_to root_path unless current_account.game_players.where(game: @game).exists?

    @game.mark_as_started! unless @game.started?
    @game_cards, _, @game_over, @num_of_cards_in_deck = @game.draw_cards
    @players = @game.leaderboard
    @redirect_to_lobby_path = root_path
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end

  def room
    @game = Game.find(params[:id])
    @chat = @game.get_chat
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end
end
