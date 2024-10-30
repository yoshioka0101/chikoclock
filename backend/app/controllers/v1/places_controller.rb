class V1::PlacesController < ApplicationController
  require 'httparty'

  def search
    query = params[:query]
    
    # API呼び出しのベースURLとパラメータ
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    api_key = ENV['GOOGLE_MAPS_API_KEY']

    # API呼び出し
    begin
      response = HTTParty.get("#{base_url}?query=#{query}&key=#{api_key}", timeout: 10)
      
      # APIからの成功ステータス確認
      if response.success?
        render json: response.parsed_response
      else
        # APIがエラーを返した場合のハンドリング
        handle_google_api_error(response)
      end

    rescue HTTParty::Error => e
      log_error("HTTParty Error: #{e.message}")
      render json: { error: "Google Maps APIへのリクエストに失敗しました" }, status: :service_unavailable
    rescue Net::OpenTimeout, Net::ReadTimeout
      log_error("Timeout Error: リクエストがタイムアウトしました。")
      render json: { error: "リクエストがタイムアウトしました" }, status: :request_timeout
    rescue => e
      log_error("Unknown Error: #{e.message}")
      render json: { error: "内部エラーが発生しました" }, status: :internal_server_error
    end
  end

  private

  def handle_google_api_error(response)
    case response.code
    when 400
      render json: { error: "無効なリクエストです。パラメータを確認してください。" }, status: :bad_request
    when 403
      render json: { error: "APIキーが無効または使用制限に達しています。" }, status: :forbidden
    when 429
      render json: { error: "リクエストが多すぎます。しばらくしてから再度お試しください。" }, status: :too_many_requests
    when 500
      render json: { error: "Google Maps API サーバーに問題があります。" }, status: :internal_server_error
    when 502
      render json: { error: "サーバーが停止しているか、負荷が大きい可能性があります。" }, status: :bad_gateway
    else
      render json: { error: "予期しないエラーが発生しました。" }, status: :bad_gateway
    end
  end

  def log_error(message)
    Rails.logger.error(message)
  end
end
