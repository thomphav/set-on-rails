# == Schema Information
#
# Table name: accounts
#
#  id            :bigint           not null, primary key
#  status        :integer          default("unverified"), not null
#  email         :citext           not null
#  password_hash :string
#
class Account < ApplicationRecord
  include Rodauth::Model(RodauthMain)

  has_many :games, dependent: :destroy

  enum :status, unverified: 1, verified: 2, closed: 3
end
