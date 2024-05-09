Rails.application.routes.draw do
  devise_for :users

  resources :posts, only: [:new, :create, :show]

  get "up" => "rails/health#show", as: :rails_health_check
end
