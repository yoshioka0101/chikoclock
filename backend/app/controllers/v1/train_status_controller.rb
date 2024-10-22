class V1::TrainStatusController < ApplicationController
  def index
    area = params[:area]

    # 選択されたエリアに応じてURLを切り替える
    urls = {
      '北海道' => 'https://transit.yahoo.co.jp/diainfo/area/2',
      '東北' => 'https://transit.yahoo.co.jp/diainfo/area/3',
      '首都圏' => 'https://transit.yahoo.co.jp/diainfo/area/4'
    }

    if urls[area]
      begin
        @lines = fetch_area_data(area, urls[area])

        if @lines.empty?
          render json: {message: "遅延情報はありません"}
        else
          render json: @lines
        end
      rescue => e
        handle_error(e)
      end
    else
      render json: { error: "エリアが正しくありません" }, status: :bad_request
    end
  end

  private

  def fetch_area_data(area_name, url)
    begin
      html = URI.open(url)
      doc = Nokogiri::HTML(html)

      lines = []
      doc.css('.elmTblLstLine tr').each do |row|
        line = row.css('td')[0]&.text
        status = row.css('td')[1]&.text
        details = row.css('td')[2]&.text

        # 「平常運転」や空行を除外
        if line.present? && status != '平常運転' && status.present?
          lines << { area: area_name, line: line, status: status, details: details }
        end
      end

      lines
    rescue OpenURI::HTTPError => e
      Rails.logger.error("HTTPエラー (#{area_name}): #{e.message}")
      []
    rescue => e
      Rails.logger.error("サーバーエラー (#{area_name}): #{e.message}")
      []
    end
  end

  def handle_error(error)
    render json: { error: 'サーバーエラーが発生しました' }, status: :internal_server_error
  end
end
