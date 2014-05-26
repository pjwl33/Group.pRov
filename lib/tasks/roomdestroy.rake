task room_destroy: :environment do
  desc "Destroys music rooms to preserve database space..."
  puts "Bye bye rooms!"
  Room.all.each do |room|
    room.destroy
  end
end