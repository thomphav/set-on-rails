class DashboardController < ApplicationController
  before_action :authenticate

  def index
    @games = current_account.games.finished.order(end_time: :desc)
  end
end
