class HomeController < ApplicationController
  def index
    @dashboard_link = dashboard_index_path
  end
end
