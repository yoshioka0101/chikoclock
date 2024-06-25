Rails.application.routes.draw do
  namespace :v1 do
    resources :posts, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get 'hash/:hash_string', to: 'posts#show_by_hash'
      end
    end
    resources :users, only: [:index, :create]
    get 'places/search', to: 'places#search'
  end
end
