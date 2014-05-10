class User < ActiveRecord::Base

  has_many :tracks
  validates_presence_of :uid, :name, :oauth_token, :oauth_expires_at
  validates_uniqueness_of :uid, :oauth_token

  def self.from_omniauth(auth)
    where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end

end
