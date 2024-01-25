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
require "test_helper"

class GameCardTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
