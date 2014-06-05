task room_destroy: :environment do
  desc "Destroys music rooms to preserve database space..."
  puts "Bye bye rooms!"
  Room.all.each do |room|
    room.destroy
  end
end

task empty_track: :environment do
  desc "Creating an empty track"
  puts "Recording..."
  Track.create(sequence: "[]", instrument: "piano")
end