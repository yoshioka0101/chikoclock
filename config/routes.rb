Rails.application.routes.draw do
  get 'home/index'
  devise_for :users
  root to: "home#index"

  get "up" => "rails/health#show", as: :rails_health_check

end
