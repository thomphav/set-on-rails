# == Schema Information
#
# Table name: cards
#
#  id         :bigint           not null, primary key
#  color      :integer          not null
#  symbol     :integer          not null
#  shading    :integer          not null
#  number     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Card < ApplicationRecord
  has_many :game_cards, dependent: :destroy

  enum color: [:red, :green, :purple]
  enum symbol: [:diamond, :squiggle, :oval]
  enum shading: [:solid, :striped, :open]
  enum number: [:one, :two, :three]

  validate :read_only

  private

  def read_only
    raise ActiveRecord::ReadOnlyRecord
  end
end
