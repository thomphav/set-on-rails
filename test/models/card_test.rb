# == Schema Information
#
# Table name: cards
#
#  id         :bigint           not null, primary key
#  color      :integer          not null
#  symbol     :integer          not null
#  shading    :integer          not null
#  number     :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require "test_helper"

class CardTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
