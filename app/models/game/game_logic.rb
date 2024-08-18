module Game::GameLogic
  extend ActiveSupport::Concern

  NEW_DRAW_COUNT = 3
  MIN_DRAWN_COUNT = 12

  def draw_cards(old_cards: [])
    three_cards = []

    if game_cards.drawn.count < MIN_DRAWN_COUNT
      three_cards = draw
      three_cards.each { _1.update!(state: :drawn, position: old_cards.pop&.position) }
    end

    drawn_cards, game_over = cycle_through_board

    num_of_cards_in_deck = game_cards.in_deck.count

    [drawn_cards, three_cards, game_over, num_of_cards_in_deck]
  end

  def cycle_through_board
    set_on_board = false
    game_over = false

    until set_on_board
      set_on_board = set_on_board?(drawn_game_cards: drawn_cards)

      unless set_on_board
        game_over = draw.empty?
        break if game_over

        three_cards = draw
        three_cards.each_with_index { |gc, index| gc.update!(state: :drawn, position: drawn_cards.length + index) }
      end
    end

    [drawn_cards, game_over]
  end

  def set_on_board?(drawn_game_cards: [])
    drawn_game_cards.to_a.combination(3).any? { set_from_cards?(game_cards: _1) }
  end

  def set_from_cards?(game_cards: [])
    return false unless game_cards.length == 3

    Card::FEATURES.each do |feature|
      values = game_cards.map { |card| card.try(feature) }

      if values.uniq.length == 2
        return false
      end
    end

    true
  end

  def handle_result(result:, game_cards: [], current_account:)
    if result
      player = current_account.game_players.find_by(game: self)

      # eventually we'd want to rather count the specific CardSet records but this'll do for now
      player&.increment!(:score)
      player&.update_last_score_at!

      game_cards.each { _1.update!(state: :used) }

      resort_positions if game_cards.drawn.count > 11

      self.draw_cards(old_cards: game_cards.to_a)
    else
      [[], []]
    end
  end

  def draw
    game_cards
      .all
      .in_deck
      .with_card_attributes
      .order(:id)
      .limit(NEW_DRAW_COUNT)
  end

  def drawn_cards
    game_cards
      .all
      .drawn
      .with_card_attributes
      .order(:position)
  end

  def resort_positions
    cards = drawn_cards.order(:position)
    
    cards.each { |c, index| c.update!(position: index) }
  end
end
