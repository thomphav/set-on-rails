class CreateGameCards < ActiveRecord::Migration[7.1]
  def change
    create_table :game_cards do |t|
      t.integer :position, null: false
      t.integer :state, null: false, default: 0
      t.references :game, null: false, foreign_key: true
      t.references :card, null: false, foreign_key: true

      t.timestamps
    end
  end
end
