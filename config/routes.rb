Rails.application.routes.draw do

  root 'sessions#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/auth/failure' => redirect('/')

  get '/rooms' => 'rooms#index'
  post '/rooms' => 'rooms#create'

  get '/signout' => 'sessions#destroy', as: 'signout'

end
