class V1::PlacesController < ApplicationController
  require 'httparty'

  def search
    query = params[:query]
    response = HTTParty.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{query}&key=#{ENV['GOOGLE_MAPS_API_KEY']}")
    render json: response.parsed_response
  end
end
