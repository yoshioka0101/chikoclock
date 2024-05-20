class V1::PlacesController < ApplicationController
  require 'httparty'
  require 'uri'

  def search
    query = URI.encode_www_form_component(params[:query]) # パラメータをエンコード
    response = HTTParty.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=#{query}&key=#{ENV['GOOGLE_MAPS_API_KEY']}")
    render json: response.parsed_response
  end
end