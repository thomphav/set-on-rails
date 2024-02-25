class HomeController < ApplicationController
  def index
    @dashboard_link = dashboard_index_path
    @games = Game.pending.order(created_at: :desc).map { _1.as_json.merge({ "room_count" => _1.get_room_count }) }
  end
end
