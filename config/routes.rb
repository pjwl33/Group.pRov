Rails.application.routes.draw do

  root 'sessions#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/auth/failure' => redirect('/')

  post '/rooms' => 'rooms#create'
  post '/tracks' => 'tracks#create'
  get '/tracks' => 'tracks#index'
  get '/rooms' => 'rooms#index'
  get '/get_tracks' => 'rooms#get_tracks'
  get '/rooms/search' => 'rooms#search'
  get '/rooms/:id' => 'rooms#show'

  get '/signout' => 'sessions#destroy', as: 'signout'

end
