class GamesController < ApplicationController
  protect_from_forgery with: :exception

  def create
    game = Game.new

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

    redirect_to game_path(game.id)
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end

  def show
    game = Game.find(params[:id])

    @game =
      game
        .attributes
        .except("created_at", "updated_at")
        .merge(start_time: (game.start_time&.to_i || 0) * 1000, end_time: (game.end_time&.to_i || 0) * 1000)

    @game_cards, _, @game_over = game.draw_cards
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end
end
