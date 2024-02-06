class HomeController < ApplicationController
  def index
    @dashboard_link = dashboard_index_path
    @games = current_account.games.active.order(start_time: :desc) if current_account
  end
end
