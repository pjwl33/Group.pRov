class Track < ActiveRecord::Base

  belongs_to :user
  belongs_to :room
  validates_presence_of :sequence
  validates_presence_of :instrument

end