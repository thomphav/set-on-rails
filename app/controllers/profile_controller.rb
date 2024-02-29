class ProfileController < ApplicationController
  before_action :authenticate

  def index
    @id = current_account.id
    @username = current_account.username
  end
end