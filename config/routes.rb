Rails.application.routes.draw do
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  root "home#index"

  resources :home, only: [:index]
  resources :games, only: [:show, :create]
  resources :dashboard, only: [:index]

  namespace :internal_api do
    resources :games, only: [:show, :update] do
      collection do
        post :check_for_set
      end
    end
  end

  # Routes handled by RodauthApp
  # $ rails rodauth:routes

  # /login                   rodauth.login_path
  # /create-account          rodauth.create_account_path
  # /verify-account-resend   rodauth.verify_account_resend_path
  # /verify-account          rodauth.verify_account_path
  # /change-password         rodauth.change_password_path
  # /change-login            rodauth.change_login_path
  # /logout                  rodauth.logout_path
  # /remember                rodauth.remember_path
  # /reset-password-request  rodauth.reset_password_request_path
  # /reset-password          rodauth.reset_password_path
  # /verify-login-change     rodauth.verify_login_change_path
  # /close-account           rodauth.close_account_path
end
