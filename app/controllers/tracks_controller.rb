class TracksController < ApplicationController

  def create
    @room = Room.find(params[:room])
    track = @room.tracks.create({
      user_id: current_user.id,
      sequence: params[:sequence],
      instrument: params[:instrument]
      })
    return_data = { object: track, user: current_user.name }

    respond_to do |format|
      format.html { redirect_to "/rooms/#{@room.id}"}
      format.json { render json: return_data.to_json }
    end
  end

end