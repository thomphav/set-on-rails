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
end
