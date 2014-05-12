require 'spec_helper'

describe Room do

  subject(:room){Room.create(name: "Group Music App")}

  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:name) }
  it { should have_many(:tracks) }

end