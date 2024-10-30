class V1::PlacesController < ApplicationController
  require 'httparty'

  def search
    query = params[:query]
    
    # API呼び出しのベースURLとパラメータ
    base_url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    
    # API呼び出し
    begin
      response = HTTParty.get("#{base_url}?query=#{query}&key=#{api_key}")
      
      # APIからの成功ステータス確認
      if response.success?
        render json: response.parsed_response
      else
        # APIがエラーを返した場合のハンドリング
        handle_google_api_error(response)
      end
      
    rescue HTTParty::Error => e
      # HTTParty関連のエラー（ネットワークエラー等）をキャッチ
      log_error("HTTParty Error: #{e.message}")
      render json: { error: "Google Maps APIへのリクエストに失敗しました" }, status: :service_unavailable
    rescue => e
      # その他の予期しないエラーをキャッチ
      log_error("Unknown Error: #{e.message}")
      render json: { error: "内部エラーが発生しました" }, status: :internal_server_error
    end
  end

  private

  # Google Maps APIのエラーハンドリング
  def handle_google_api_error(response)
    case response.code
    when 400
      render json: { error: "無効なリクエストです。パラメータを確認してください。" }, status: :bad_request
    when 403
      render json: { error: "APIキーが無効または使用制限に達しています。" }, status: :forbidden
    when 500
      render json: { error: "Google Maps API サーバーに問題があります。" }, status: :internal_server_error
    else
      render json: { error: "予期しないエラーが発生しました。" }, status: :bad_gateway
    end
  end

  # エラーログの記録
  def log_error(message)
    Rails.logger.error(message)
  end
end
