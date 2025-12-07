class V1::PlacesController < ApplicationController
  require 'httparty'

  def search
    query = params[:query]
    
    # API呼び出しのベースURLとパラメータ
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    api_key = ENV['GOOGLE_MAPS_API_KEY']

    response = with_external_api(service: "Google Maps API", operation: "places_search") do
      HTTParty.get("#{base_url}?query=#{query}&key=#{api_key}", timeout: 10)
    end

    ensure_success!(response, service: "Google Maps API", operation: "places_search")

    render json: response.parsed_response
  end

  private
end
