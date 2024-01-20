class Onetime
  def self.create_cards
    Card.colors.keys.each do |color|
      Card.symbols.keys.each do |symbol|
        Card.shadings.keys.each do |shading|
          Card.numbers.keys.each do |number|
            Card.create!(color: color, symbol: symbol, shading: shading, number: number)
          end
        end
      end
    end
  end
end