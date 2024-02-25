class AddUsernameToAccount < ActiveRecord::Migration[7.1]
  def change
    add_column :accounts, :username, :string
  end
end
