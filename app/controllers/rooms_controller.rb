class RoomsController < ApplicationController

  def index
    @room = Room.new
  end

  def show
    @room = Room.find(params[:id])
  end

  def create
    @room = Room.create(room_params)
    redirect_to room_path @room
  end

  private
  def room_params
    params[:room].permit(:name, :created_at, :updated_at)
  end

end