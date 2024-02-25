class HomeController < ApplicationController
  def index
    @dashboard_link = dashboard_index_path
    @games = Game.pending.order(created_at: :desc)
  end
end
