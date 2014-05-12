require 'spec_helper'

describe User do

  it { should validate_presence_of(:uid) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:oauth_token) }
  it { should validate_presence_of(:oauth_expires_at) }
  it { should validate_uniqueness_of(:uid) }
  it { should validate_uniqueness_of(:oauth_token) }
  it { should have_many(:tracks) }

  describe "#from_omniauth" do
    it "checks the omniauth provider and creates a User if they are unique" do
      User.from_omniauth('facebook', 'test-ID')
      expect(User.find_by(uid: 'test-ID')).to_be true
    end
  end

end

