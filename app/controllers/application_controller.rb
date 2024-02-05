class ApplicationController < ActionController::Base
  private

  def current_account
    @current_account ||= rodauth.rails_account
  end

  def authenticate
    rodauth.require_account # redirect to login page if not authenticated
  end
end
