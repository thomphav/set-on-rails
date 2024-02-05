class AddAccountReferenceToGame < ActiveRecord::Migration[7.1]
  def change
    add_reference :games, :account, null: false, foreign_key: true
  end
end
