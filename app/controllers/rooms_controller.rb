class RoomsController < ApplicationController

  def index
    @room = Room.new
  end

  def search
    room = Room.find_by(name: params[:search])
    if room
      redirect_to "/rooms/#{room.id}"
    else
      redirect_to rooms_path, notice: "Looks like room '#{params[:search]}' doesn't exist -- try creating it!"
    end
  end

  def create
    room = Room.create(room_params)
    if room.save
      redirect_to "/rooms/#{room.id}"
    else
      redirect_to rooms_path, notice: "Looks like that room already exists -- try a different name!"
    end
  end

  def show
    @room = Room.find(params[:id])
  end

  private
  def room_params
    params[:room].permit(:name, :created_at, :updated_at)
  end

end