class DashboardController < ApplicationController
  def index
    @games = Game.finished.order(end_time: :desc)
  end
end
