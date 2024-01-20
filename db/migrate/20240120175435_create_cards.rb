class CreateCards < ActiveRecord::Migration[7.1]
  def change
    create_table :cards do |t|
      t.integer :color, null: false
      t.integer :symbol, null: false
      t.integer :shading, null: false
      t.integer :number, null: false

      t.timestamps
    end
  end
end
