class GamesController < ApplicationController
  # before_action :authenticate
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

    @game_cards, _, @game_over, @num_of_cards_in_deck = @game.draw_cards

    # # Broadcast the game state to all subscribed clients
    # ApplicationCable::GameChannel.broadcast_to(
    #   @game,
    #   action: 'update',
    #   game_cards: @game_cards,
    #   game_over: @game_over,
    #   num_of_cards_in_deck: @num_of_cards_in_deck
    # )
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end

  def room
    @game = Game.find(params[:id])
    @game.room.set_room(account: current_account)

    @room = @game.room.get_room

    ActionCable.server.broadcast("game_#{@game.id}_room", @room.to_json)
  rescue StandardError => e
    Rails.logger.error(e)
    render plain: "error", status: :unprocessable_entity
  end
end
