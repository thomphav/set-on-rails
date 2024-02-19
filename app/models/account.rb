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
  has_many :game_players, dependent: :destroy, foreign_key: "player_id", class_name: "GamePlayer"
  # create validation 1 game player per unique game

  enum :status, unverified: 1, verified: 2, closed: 3
end
