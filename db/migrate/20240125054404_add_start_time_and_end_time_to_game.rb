class AddStartTimeAndEndTimeToGame < ActiveRecord::Migration[7.1]
  def change
    add_column :games, :start_time, :datetime
    add_column :games, :end_time, :datetime
  end
end
