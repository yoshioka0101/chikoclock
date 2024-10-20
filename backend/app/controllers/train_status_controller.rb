class TrainStatusController < ApplicationController
    def index
      @lines = fetch_all_areas  # スクレイピングによるデータ取得
      render json: @lines
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
    end
  end
  