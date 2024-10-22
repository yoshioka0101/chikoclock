class V1::TrainStatusController < ApplicationController
  require 'open-uri'

  def index
    begin
      @lines = fetch_all_areas.reject { |line| line[:status] == '平常運転' || line[:line].blank? || line[:status].blank? || line[:details].blank? }
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
      Rails.logger.info("Fetching data for #{area_name}: #{doc.to_html}")
  
      lines = []
      doc.css('.elmTblLstLine tr').each do |row|
        line = row.css('td')[0]&.text
        status = row.css('td')[1]&.text
        details = row.css('td')[2]&.text
  
        Rails.logger.info("Line: #{line}, Status: #{status}, Details: #{details}")
        
        lines << { area: area_name, line: line, status: status, details: details }
      end
      lines
    rescue => e
      Rails.logger.error("Error fetching data for #{area_name}: #{e.message}")
      return []
    end
  end

  def handle_error(error)
    case error
    when OpenURI::HTTPError
      render json: { error: 'リクエストが不正です' }, status: :bad_request
    else
      render json: { error: 'サーバーエラーが発生しました' }, status: :internal_server_error
    end
  end
end
