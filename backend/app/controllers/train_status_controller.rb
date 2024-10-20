class TrainStatusController < ApplicationController
    def index
      begin
        @lines = fetch_all_areas
        render json: @lines
      rescue => e
        handle_error(e)
      end
    end
  
    private
  
    def fetch_all_areas
      urls = [
        { area: '北海道', url: 'https://transit.yahoo.co.jp/diainfo/area/2' },
        { area: '東北', url: 'https://transit.yahoo.co.jp/diainfo/area/3' },
        { area: '首都圏', url: 'https://transit.yahoo.co.jp/diainfo/area/4' }
      ]
  
      all_lines = []
      urls.each do |entry|
        all_lines.concat(fetch_area_data(entry[:area], entry[:url]))
      end
  
      all_lines
    end
  
    def fetch_area_data(area_name, url)
      begin
        html = URI.open(url)
        doc = Nokogiri::HTML(html)
  
        lines = []
        doc.css('.elmTblLstline tr').each do |row|
          line = row.css('td')[0]&.text
          status = row.css('td')[1]&.text
          details = row.css('td')[2]&.text
  
          lines << { area: area_name, line: line, status: status, details: details }
        end
  
        lines
      rescue OpenURI::HTTPError => e
        Rails.logger.error("HTTPエラー (#{area_name}): #{e.message}")
        render json: { error: "データ取得に失敗しました" }, status: :bad_request
        return []
      rescue => e
        Rails.logger.error("サーバーエラー (#{area_name}): #{e.message}")
        render json: { error: "サーバー内部で問題が発生しました" }, status: :internal_server_error
        return []
      end
    end
  
    def handle_error(error)
      case error
      when OpenURI::HTTPError
        render json: { error: 'リクエストが不正です' }, status: :bad_request  # 400系エラー
      else
        render json: { error: 'サーバーエラーが発生しました' }, status: :internal_server_error  # 500系エラー
      end
    end
  end
  