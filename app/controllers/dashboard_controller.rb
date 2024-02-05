class DashboardController < ApplicationController
  before_action :authenticate

  def index
    @games = Game.finished.order(end_time: :desc)
  end
end
