Rails.application.routes.draw do
  get 'dashboard/index'
  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  resources :home, only: [:index]
  resources :games, only: [:show, :create]
  resources :dashboard, only: [:index]

  namespace :internal_api do
    resources :games, only: [:update] do
      collection do
        post :check_for_set
      end
    end
  end
end
