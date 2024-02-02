module Dashboard
  class ShowComponent < ReactComponent
    def initialize(raw_props)
      super("Dashboard", raw_props: raw_props)
    end

    def props
      raw_props.merge(
        # price: helpers.number_to_currency(raw_props[:price])
      )
    end
  end
end