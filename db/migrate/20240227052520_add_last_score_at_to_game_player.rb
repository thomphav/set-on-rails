class AddLastScoreAtToGamePlayer < ActiveRecord::Migration[7.1]
  def change
    add_column :game_players, :last_score_at, :datetime
  end
end
