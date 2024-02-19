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

    # should be a method called leaderboard from game
    @players = @game.leaderboard
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end

  def room
    @game = Game.find(params[:id])
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end
end
