# == Schema Information
#
# Table name: game_players
#
#  id            :bigint           not null, primary key
#  game_id       :bigint           not null
#  player_id     :bigint           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  score         :integer          default(0)
#  last_score_at :datetime
#
require "test_helper"

class GamePlayerTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
