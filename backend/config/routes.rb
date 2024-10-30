Rails.application.routes.draw do
  namespace :v1 do
    mount_devise_token_auth_for 'User', at: 'auth'

    resources :posts, only: [:index, :show, :create, :update, :destroy] do
      collection do
        get 'hash/:hash_string', to: 'posts#show_by_hash'
      end
    end
    resources :users, only: [:index, :create]
    get 'train_status', to: 'train_status#index'
    get 'places/search', to: 'places#search'
  end
end
