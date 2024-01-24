# == Schema Information
#
# Table name: games
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Game < ApplicationRecord
  has_many :game_cards, -> { order(position: :asc) }, dependent: :destroy

  def draw_cards
    result = true
    candidate_cards = nil

    three_cards = game_cards.in_deck.first(3)
    three_cards.each { |gc| gc.update!(state: :drawn) } if game_cards.drawn.count < 12
    three_cards =
      GameCard
        .where(id: three_cards.map(&:id))
        .joins("INNER JOIN cards ON game_cards.card_id = cards.id")
        .select(
          "game_cards.*",
          "cards.color AS color",
          "cards.symbol AS symbol",
          "cards.shading AS shading",
          "cards.number AS number",
          # kinda dumb but I want to keep 0,1,2 int values in the db for now.
          "CASE cards.number
            WHEN 0 THEN '#{Card.numbers["one"] + 1}'
            WHEN 1 THEN '#{Card.numbers["two"] + 1}'
            WHEN 2 THEN '#{Card.numbers["three"] + 1}'
            END as formatted_number"
        )

    while result
      candidate_cards =
        game_cards
          .all
          .drawn
          .joins("INNER JOIN cards ON game_cards.card_id = cards.id")
          .select(
            "game_cards.*",
            "cards.color AS color",
            "cards.symbol AS symbol",
            "cards.shading AS shading",
            "cards.number AS number",
            # kinda dumb but I want to keep 0,1,2 int values in the db for now.
            "CASE cards.number
              WHEN 0 THEN '#{Card.numbers["one"] + 1}'
              WHEN 1 THEN '#{Card.numbers["two"] + 1}'
              WHEN 2 THEN '#{Card.numbers["three"] + 1}'
              END as formatted_number"
          )

      result = false if check_board_for_set(game_cards)
    end

    [candidate_cards, three_cards]
  end

  def check_board_for_set(game_cards)
    game_cards.to_a.combination(3).any? do |gcs|
      check_three_for_set(gcs)
    end
  end

  def check_three_for_set(game_cards)
    return false if game_cards.length != 3

    result = true

    features = [:color, :symbol, :shading, :number]
    features.each do |set_attr|
      diff = game_cards[1].try(set_attr) != game_cards[0].try(set_attr)

      if diff
        if game_cards[2].try(set_attr) == game_cards[1].try(set_attr) || game_cards[2].try(set_attr) == game_cards[0].try(set_attr)
          result = false
          break
        end
      else
        if game_cards[2].try(set_attr) != game_cards[0].try(set_attr)
          result = false
          break
        end
      end
    end

    result
  end
end
