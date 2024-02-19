# == Schema Information
#
# Table name: game_cards
#
#  id         :bigint           not null, primary key
#  position   :integer
#  state      :integer          default("in_deck"), not null
#  game_id    :bigint           not null
#  card_id    :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class GameCard < ApplicationRecord
  belongs_to :game
  belongs_to :card

  enum state: [:in_deck, :drawn, :used]

  delegate :color, to: :card
  delegate :symbol, to: :card
  delegate :shading, to: :card
  delegate :number, to: :card

  scope :with_card_attributes, -> {
    joins(:card)
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
  }
end
