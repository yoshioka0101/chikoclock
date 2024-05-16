Rails.application.routes.draw do  
    namespace :v1 do
      resources :posts, only: [:index, :shoe, :create, :update, :destroy]
      resources :users, only: [:index, :create]
      get 'places/search', to: 'places#search'

    end
end