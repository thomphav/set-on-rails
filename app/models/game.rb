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
    game_cards
      .all
      .joins("INNER JOIN cards ON game_cards.card_id = cards.id")
      .select(
        "game_cards.*",
        "CASE cards.color
          WHEN 0 THEN '#{Card.colors.key(0)}'
          WHEN 1 THEN '#{Card.colors.key(1)}'
          WHEN 2 THEN '#{Card.colors.key(1)}'
          END as color",
        "CASE cards.symbol
          WHEN 0 THEN '#{Card.symbols.key(0)}'
          WHEN 1 THEN '#{Card.symbols.key(1)}'
          WHEN 2 THEN '#{Card.symbols.key(2)}'
          END as symbol",
        "CASE cards.shading
          WHEN 0 THEN '#{Card.shadings.key(0)}'
          WHEN 1 THEN '#{Card.shadings.key(1)}'
          WHEN 2 THEN '#{Card.shadings.key(2)}'
          END as shading",
        "CASE cards.number
          WHEN 0 THEN '#{Card.numbers.key(0)}'
          WHEN 1 THEN '#{Card.numbers.key(1)}'
          WHEN 2 THEN '#{Card.numbers.key(2)}'
          END as number"
      )
  end

  def check_for_set

  end
end
