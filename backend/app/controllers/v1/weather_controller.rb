require 'net/http'
require 'uri'
require 'json'

module V1
  class WeatherController < ApplicationController
    LOCATIONS = {
      tokyo: "139.6917,35.6895",
      osaka: "135.5023,34.6937",
      sapporo: "141.3545,43.0618",
      nagoya: "136.9066,35.1815",
      fukuoka: "130.4017,33.5904",
      sendai: "140.8721,38.2688",
      hiroshima: "132.4553,34.3853",
      kanazawa: "136.6562,36.5781",
      naha: "127.6811,26.2125",
      kagoshima: "130.5571,31.5966"
    }


    REQUEST_LIMIT = 50000
    @@request_count = 0 # アプリケーション全体で保持するリクエストカウント
    @@limit_reset_time = Time.now + 24.hours # レートリミットのリセット時間

    def show
      # リセット時間を過ぎたらカウントをリセット
      if Time.now >= @@limit_reset_time
        @@request_count = 0
        @@limit_reset_time = Time.now + 24.hours
      end

      # レートリミットチェック
      if @@request_count >= REQUEST_LIMIT
        retry_after_seconds = (@@limit_reset_time - Time.now).to_i
        raise ErrorHandler.rate_limit(
          "リクエストの上限に達しました。#{retry_after_seconds}秒後に再試行してください。",
          retry_after: retry_after_seconds
        )
      end

      appid = ENV['YAHOO_WEATHER_APPID']
      coordinates = LOCATIONS.values.join(" ")
      url = "https://map.yahooapis.jp/weather/V1/place?coordinates=#{coordinates}&appid=#{appid}&output=json"

      # APIリクエスト
      uri = URI.parse(url)
      response = Net::HTTP.get_response(uri)

      unless response.is_a?(Net::HTTPSuccess)
        raise ErrorHandler.from_http_response(response)
      end

      weather_data = JSON.parse(response.body)
      @@request_count += LOCATIONS.size # 成功時にカウントを増やす
      render json: { message: "天気情報の取得に成功しました", data: weather_data }, status: :ok
    end
  end
end
