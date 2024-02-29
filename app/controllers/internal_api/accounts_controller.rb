class InternalApi::AccountsController < ApplicationController
  before_action :authenticate

  def update
    current_account.update!(account_params)

    render json: { username: current_account.username }, status: :ok
  rescue StandardError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def account_params
    params.permit(:username)
  end
end