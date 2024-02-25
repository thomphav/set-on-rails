class Game::Room
  attr_reader :game

  def initialize(game:)
    raise ArgumentError, "Must include a valid Game" unless game.is_a?(Game)

    @game = game
  end

  def get_room
    hash = redis.hgetall(redis_hash_key)

    hash.values.map { JSON.parse(_1) }
  end

  def get_room_accounts
    ids = get_room.map { _1["id"] }

    Account.where(id: ids)
  end

  def get_room_count
    redis.hlen(redis_hash_key)
  end

  def add_to_room(account:)
    account_key = "account:#{account.id}"

    account_data = {
      id: account.id,
      email: account.email,
      username: account.username,
    }.to_json

    redis.hset(redis_hash_key, account_key, account_data)
  end

  def remove_from_room(account_id:)
    account_key = "account:#{account_id}"

    redis.hdel(redis_hash_key, account_key)
  end

  def clear_room
    redis.del(redis_hash_key)
  end

  private

  def redis
    @redis ||= Redis.new
  end

  def redis_hash_key
    "game:#{game.id}:room"
  end
end