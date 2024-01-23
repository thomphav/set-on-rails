require "test_helper"

class InternalApi::GamesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get internal_api_games_index_url
    assert_response :success
  end
end
