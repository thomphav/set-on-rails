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
class GamePlayer < ApplicationRecord
  belongs_to :player, class_name: "Account"
  belongs_to :game

  def update_last_score_at!
    update!(last_score_at: Time.current)
  end
end
