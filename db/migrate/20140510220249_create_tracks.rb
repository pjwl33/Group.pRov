class CreateTracks < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :sequence
      t.references :user
      t.references :room
      t.timestamps
    end
  end
end
