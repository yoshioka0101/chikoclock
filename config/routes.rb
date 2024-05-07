Rails.application.routes.draw do
  get 'home/index'
  devise_for :users
  root to: "home#index"

  resources :posts, only: [:new, :create, :show]

  get "up" => "rails/health#show", as: :rails_health_check
end
