class V1::TrainStatusController < ApplicationController
  require 'open-uri'
  require 'nokogiri'
  require 'timeout'

  MAX_RETRIES = 3
  TIMEOUT_SECONDS = 10

  def index
    area = params[:area]

    # 選択されたエリアに応じてURLを切り替える
    urls = {
      '北海道' => 'https://transit.yahoo.co.jp/diainfo/area/2',
      '東北' => 'https://transit.yahoo.co.jp/diainfo/area/3',
      '首都圏' => 'https://transit.yahoo.co.jp/diainfo/area/4',
      '中部' => 'https://transit.yahoo.co.jp/diainfo/area/5',
      '関西' => 'https://transit.yahoo.co.jp/diainfo/area/6',
      '九州' => 'https://transit.yahoo.co.jp/diainfo/area/7',
      '中国' => 'https://transit.yahoo.co.jp/diainfo/area/8',
      '四国' => 'https://transit.yahoo.co.jp/diainfo/area/9'
    }

    if urls[area]
      begin
        @lines = fetch_area_data(area, urls[area])

        # 空の情報または平常運転しかない場合の処理
        if @lines.empty?
          render json: { message: "遅延情報はありません" }
        else
          render json: @lines
        end
      rescue Timeout::Error
        render json: { error: "リクエストがタイムアウトしました" }, status: :request_timeout
      rescue OpenURI::HTTPError => e
        log_error("HTTPエラー: #{e.message}")
        render json: { error: "データの取得に失敗しました" }, status: :bad_gateway
      rescue => e
        log_error("サーバーエラー: #{e.message}")
        render json: { error: "サーバー内部エラーが発生しました" }, status: :internal_server_error
      end
    else
      render json: { error: "エリアが正しくありません" }, status: :bad_request
    end
  end

  private

  # エラーハンドリングを含むデータ取得メソッド
  def fetch_area_data(area_name, url)
    attempts = 0

    begin
      attempts += 1
      Timeout.timeout(TIMEOUT_SECONDS) do
        html = URI.open(url)
        doc = Nokogiri::HTML(html)

        lines = []
        doc.css('.elmTblLstLine tr').each do |row|
          # 路線名とリンクを取得
          line_element = row.css('td')[0]&.css('a')&.first
          line_name = line_element&.text
          line_url = line_element&.[]('href')
          status = row.css('td')[1]&.text
          details = row.css('td')[2]&.text

          # 「平常運転」や空行を除外
          if line_name.present? && status != '平常運転' && status.present?
            lines << {
              area: area_name,
              line: line_name,
              url: line_url ? "https://transit.yahoo.co.jp#{line_url}" : nil, # 絶対URLに変換
              status: status,
              details: details
            }
          end
        end

        lines
      end
    rescue Timeout::Error
      log_error("タイムアウトエラー (#{area_name})")
      retry if attempts < MAX_RETRIES
      raise
    rescue OpenURI::HTTPError => e
      log_error("HTTPエラー (#{area_name}): #{e.message}")
      raise
    rescue => e
      log_error("不明なエラー (#{area_name}): #{e.message}")
      raise
    end
  end

  # ログを記録するメソッド
  def log_error(message)
    Rails.logger.error(message)
  end
end
