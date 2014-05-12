require 'spec_helper'

describe Track do

  it { should validate_presence_of(:sequence) }
  it { should belong_to(:user) }
  it { should belong_to(:room) }

end