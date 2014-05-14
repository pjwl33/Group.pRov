class RoomsController < ApplicationController

  before_action :current_user

  def index
    @room = Room.new

    rooms_ids = current_user.tracks.pluck(:room_id).uniq.sort!
    @rooms = rooms_ids.map { |id| Room.find(id) }

    respond_to do |format|
      format.html { render 'index' }
      format.json { render json: @rooms.to_json }
    end
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
    user_ids = @room.tracks.pluck(:user_id).uniq.sort!
    @users = user_ids.map { |id| User.find(id) }
  end

  def get_tracks
    # binding.pry
    room = Room.find(params[:id])
    user_ids = room.tracks.pluck(:user_id).uniq.sort!
    users = user_ids.map { |id| User.find(id) }

    return_data = { users: users, tracks: room.tracks }
    respond_to do |format|
      format.html { redirect_to rooms_path }
      format.json { render json: return_data.to_json }
    end
  end

  private
  def room_params
    params[:room].permit(:name, :created_at, :updated_at)
  end

end