Rails.application.routes.draw do
    namespace :v1 do
      resources :posts, only: [:index, :show, :create, :update, :destroy]
      resources :users, only: [:index, :create]
    end
end