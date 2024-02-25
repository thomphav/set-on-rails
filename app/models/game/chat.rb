class Game::Chat
  attr_reader :game

  MESSAGE_DATA = Struct.new(:account_id, :account_email, :message, :sent_at)
  
  def initialize(game:)
    raise ArgumentError, "Must include a valid Game" unless game.is_a?(Game)
  
    @game = game
  end

  def get_chat
    hash = redis.hgetall(redis_hash_key)

    hash.values.map { JSON.parse(_1) }
  end

  def get_message(account_key:)
    message = redis.hget(redis_hash_key, account_key)

    JSON.parse(message)
  end

  def add_to_chat(account:, message:)
    sent_at = Time.current.to_i
    account_key = "account:#{account.id}:sent_at:#{sent_at}"

    message = MESSAGE_DATA.new(
      account_id: account.id,
      account_email: account.email,
      message: message,
      sent_at: sent_at,
    )

    redis.hset(redis_hash_key, account_key, message.to_json)

    account_key
  end

  def clear_chat
    redis.del(redis_hash_key)
  end

  private

  def redis
    @redis ||= Redis.new
  end

  def redis_hash_key
    "game:#{game.id}:chat"
  end
end  