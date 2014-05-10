class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :signed_in?, :current_user

  #checking for user signed in
  def signed_in?
    true if session[:user_id]
  end

  #current user object return
  def current_user
    if signed_in?
      User.find(session[:user_id])
    else
      redirect_to root_path
    end
  end
end
