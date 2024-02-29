# == Schema Information
#
# Table name: accounts
#
#  id            :bigint           not null, primary key
#  status        :integer          default("unverified"), not null
#  email         :citext           not null
#  password_hash :string
#  username      :string
#
class Account < ApplicationRecord
  # NOTE: checkout app/misc/rodauth_main.rb for callbacks, hooks, and other configuration
  # example:
  # before_create_account do
    # self.account[:username] = "user-#{SecureRandom.hex(4)}"
  # end

  include Rodauth::Model(RodauthMain)

  validates :username, uniqueness: true, presence: true

  has_many :game_players, dependent: :destroy, foreign_key: "player_id", class_name: "GamePlayer"

  # should only have one as a "creator" of the game and should be optional
  has_many :games, dependent: :destroy
  # create validation 1 game player per unique game

  enum :status, unverified: 1, verified: 2, closed: 3
end
