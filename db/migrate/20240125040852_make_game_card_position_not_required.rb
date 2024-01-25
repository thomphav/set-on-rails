class MakeGameCardPositionNotRequired < ActiveRecord::Migration[7.1]
  def change
    change_column :game_cards, :position, :integer, null: true
  end
end
