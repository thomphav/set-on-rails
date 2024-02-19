class AddScoreToGamePlayer < ActiveRecord::Migration[7.1]
  def change
    add_column :game_players, :score, :integer, default: 0
  end
end
