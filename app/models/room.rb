class Room < ActiveRecord::Base

  has_many :tracks, dependent: :destroy
  validates_presence_of :name
  validates_uniqueness_of :name

end