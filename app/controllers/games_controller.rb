class GamesController < ApplicationController
  protect_from_forgery with: :exception

  def index
  end

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

    @game_id = game.id
    @game_cards, _, @game_over = game.draw_cards
    puts "gameCards: #{@game_cards}"
    puts "gameOver: #{@game_over}"
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end
end
