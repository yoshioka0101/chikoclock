module ExternalApiHandling
  extend ActiveSupport::Concern

  EXTERNAL_TIMEOUT_ERRORS = [
    Net::OpenTimeout,
    Net::ReadTimeout,
    Timeout::Error
  ].freeze

  EXTERNAL_HTTP_ERRORS = [
    HTTParty::Error,
    Faraday::Error,
    OpenURI::HTTPError
  ].freeze

  def with_external_api(service:, operation: nil, &block)
    raise ArgumentError, "block is required" unless block_given?

    block.call
  rescue *EXTERNAL_TIMEOUT_ERRORS => e
    log_error(e, context: "#{service} Timeout", metadata: base_metadata(operation: operation))
    raise ErrorHandler.timeout("#{service}でタイムアウトしました")
  rescue *EXTERNAL_HTTP_ERRORS => e
    log_error(e, context: "#{service} HTTP", metadata: base_metadata(operation: operation))
    raise ErrorHandler.bad_gateway("#{service}からの取得に失敗しました")
  rescue StandardError => e
    log_error(e, context: "#{service} Unknown", metadata: base_metadata(operation: operation))
    raise ErrorHandler.service_unavailable("#{service}が利用できません")
  end

  def ensure_success!(response, service:, operation: nil)
    status_code =
      if response.respond_to?(:code)
        response.code.to_i
      elsif response.respond_to?(:status)
        response.status.to_i
      end

    success =
      if response.respond_to?(:success?)
        response.success?
      else
        status_code && status_code.between?(200, 299)
      end

    return if success

    log_error(
      "非成功レスポンス status=#{status_code}",
      context: "#{service} Response",
      metadata: base_metadata(operation: operation, status: status_code)
    )

    raise ErrorHandler.from_http_status(status_code || 502, message: "#{service}でエラーが発生しました")
  end

  private

  def base_metadata(operation: nil, status: nil)
    {}.tap do |meta|
      meta[:operation] = operation if operation
      meta[:status] = status if status
    end
  end
end
