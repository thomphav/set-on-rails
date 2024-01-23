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

  def draw_initial_cards
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
  end

  def draw_cards
    result = true
    candidate_cards = nil

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

      result = false
    end

    candidate_cards
  end

  def check_for_set(game_cards)
    return false if game_cards.length != 3

    result = true

    [:color, :symbol, :shading, :number].each do |set_attr|
      diff = game_cards[1].try(set_attr) != game_cards[0].try(set_attr)

      if diff
        if game_cards[2].try(set_attr) == game_cards[1].try(set_attr) || game_cards[2].try(set_attr) == game_cards[0].try(set_attr)
          result = false
          break
        end
      else
        if cards[2].color != game_cards[0].try(set_attr)
          result = false
          break
        end
      end
    end
   
    result
  end
end
