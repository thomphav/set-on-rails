class Game::Chat
  attr_reader :game

  MESSAGE_DATA = Struct.new(:account_id, :account_email, :message, :sent_at)
  
  def initialize(game:)
    raise ArgumentError, "Must include a valid Game" unless game.is_a?(Game)
  
    @game = game
  end

  def get_chat
    values = redis.lrange(redis_list_key, 0, -1)

    values.map { JSON.parse(_1) }
  end

  def add_to_chat(account:, message:)
    message = MESSAGE_DATA.new(
      account_id: account.id,
      account_email: account.email,
      message: message,
      sent_at: Time.current.to_i,
    )

    redis.rpush(redis_list_key, message.to_json)
    ActionCable.server.broadcast("game_#{game.id}_chat", message.to_json)
  end

  def clear_chat
    redis.del(redis_list_key)
  end

  private

  def redis
    @redis ||= Redis.new
  end

  def redis_list_key
    "game:#{game.id}:chat"
  end
end  