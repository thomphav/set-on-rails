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
  belongs_to :account

  has_many :game_cards, -> { order(position: :asc) }, dependent: :destroy
  has_many :game_players, dependent: :destroy

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

  def as_json(options = {})
    super(options).merge({
      start_time: start_time.nil? ? nil : start_time.to_i * 1000,
      end_time: end_time.nil? ? nil : end_time.to_i * 1000
    })
  end

  def draw_cards(old_cards: [])
    result = true
    candidate_cards = nil

    three_cards = game_cards.in_deck.first(3)

    last_legs = three_cards.empty?

    three_cards.each { |gc| gc.update!(state: :drawn, position: old_cards.pop&.position) } if game_cards.drawn.count < 12

    three_cards =
      GameCard
        .where(id: three_cards.map(&:id))
        .joins("INNER JOIN cards ON game_cards.card_id = cards.id")
        .select(
          "game_cards.*",
          "cards.color AS color",
          "cards.symbol AS symbol",
          "cards.shading AS shading",
          "cards.number AS number",
          # kinda dumb but I want to keep 0,1,2 int values in the db for now.
          "CASE cards.number
            WHEN 0 THEN '#{Card.numbers["one"] + 1}'
            WHEN 1 THEN '#{Card.numbers["two"] + 1}'
            WHEN 2 THEN '#{Card.numbers["three"] + 1}'
            END as formatted_number"
        )

    while result
      candidate_cards =
        game_cards
          .all
          .drawn
          .joins("INNER JOIN cards ON game_cards.card_id = cards.id")
          .select(
            "game_cards.*",
            "cards.color AS color",
            "cards.symbol AS symbol",
            "cards.shading AS shading",
            "cards.number AS number",
            # kinda dumb but I want to keep 0,1,2 int values in the db for now.
            "CASE cards.number
              WHEN 0 THEN '#{Card.numbers["one"] + 1}'
              WHEN 1 THEN '#{Card.numbers["two"] + 1}'
              WHEN 2 THEN '#{Card.numbers["three"] + 1}'
              END as formatted_number"
          )

      if check_board_for_set(candidate_cards)
        result = false
        last_legs = false
      else
        three_cards = game_cards.in_deck.first(3)

        last_legs = three_cards.empty?
        break if last_legs

        three_cards.each_with_index { |gc, index| gc.update!(state: :drawn, position: candidate_cards.length + index) }
      end
    end

    num_of_cards_in_deck = game_cards.in_deck.count

    mark_as_finished! if last_legs && active?

    [candidate_cards, three_cards, last_legs, num_of_cards_in_deck]
  end

  def check_board_for_set(drawn_gcs)
    drawn_gcs.to_a.combination(3).any? do |gcs|
      check_three_for_set(gcs)
    end
  end

  def check_three_for_set(game_cards)
    return false if game_cards.length != 3

    result = true

    features = [:color, :symbol, :shading, :number]
    features.each do |set_attr|
      diff = game_cards[1].try(set_attr) != game_cards[0].try(set_attr)

      if diff
        if game_cards[2].try(set_attr) == game_cards[1].try(set_attr) || game_cards[2].try(set_attr) == game_cards[0].try(set_attr)
          result = false
          break
        end
      else
        if game_cards[2].try(set_attr) != game_cards[0].try(set_attr)
          result = false
          break
        end
      end
    end

    result
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
end
