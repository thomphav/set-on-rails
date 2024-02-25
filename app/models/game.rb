# == Schema Information
#
# Table name: games
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  start_time :datetime
#  end_time   :datetime
#  account_id :bigint           not null
#
class Game < ApplicationRecord
  include Game::GameLogic

  belongs_to :account

  has_many :game_cards, -> { order(position: :asc) }, dependent: :destroy
  has_many :game_players, dependent: :destroy
  has_many :players, through: :game_players, source: :account

  scope :pending, -> { where(start_time: nil) }
  scope :active, -> { where.not(start_time: nil).where(end_time: nil) }
  scope :finished, -> { where.not(start_time: nil).where.not(end_time: nil) }

  def started?
    start_time.present?
  end

  def active?
    started? && end_time.nil?
  end

  def finished?
    started? && end_time.present?
  end

  def mark_as_started!
    update!(start_time: Time.current)
  end

  def mark_as_finished!
    update!(end_time: Time.current)
  end

  def leaderboard
    # REFACTOR with sql
    game_players.map do |gp|
      {
        email: gp.player.email,
        score: gp.score
      }
    end
  end

  def as_json(options = {})
    super(options).merge({
      start_time: start_time.nil? ? nil : start_time.to_i * 1000,
      end_time: end_time.nil? ? nil : end_time.to_i * 1000,
      created_at: created_at.to_i * 1000,
    })
  end

  delegate :get_room,
           :get_room_accounts,
           :add_to_room,
           :remove_from_room,
           :clear_room,
           to: :room
  def room
    @room ||= Game::Room.new(game: self)
  end

  delegate :get_chat,
           :add_to_chat,
           :clear_chat,
           to: :chat

  def chat
    @chat ||= Game::Chat.new(game: self)
  end
end
