module ErrorHandler
  extend ActiveSupport::Concern

  class ApiError < StandardError
    attr_reader :status, :message, :code, :additional_fields

    def initialize(status:, message:, code: nil, **additional_fields)
      @status = status
      @message = message
      @code = code || status.to_s.upcase
      @additional_fields = additional_fields
      super(message)
    end

    def to_hash
      { status: status, message: message, code: code }.merge(additional_fields.compact)
    end
  end

  included do
    rescue_from ApiError, with: :render_api_error_exception
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActionController::ParameterMissing, with: :render_bad_request
    rescue_from ActionController::UnknownFormat, with: :render_not_acceptable
    rescue_from StandardError, with: :render_internal_server_error if Rails.env.production?
  end

  def render_error(status:, message:, code: nil, **additional_fields)
    payload = ErrorHandler.payload(
      status: status,
      message: message,
      code: code,
      **additional_fields
    )

    respond_to do |format|
      format.json { render json: payload, status: status }
      format.html { render plain: "#{code || status}: #{message}", status: status }
      format.any  { render json: payload, status: status }
    end
  end

  def render_api_error(error_hash)
    render_error(**error_hash)
  end

  def render_api_error_exception(exception)
    handle_and_render(
      exception: exception,
      status: exception.status,
      code: exception.code,
      message: exception.message,
      additional_fields: exception.additional_fields
    )
  end

  def log_error(error, context: nil, metadata: {})
    ErrorHandler.log_error(
      error,
      context: context,
      metadata: { request_id: request.request_id }.merge(metadata)
    )
  end

  def render_not_found(error)
    handle_and_render(
      exception: error,
      status: :not_found,
      code: "NOT_FOUND",
      message: error.message
    )
  end

  def render_bad_request(error)
    handle_and_render(
      exception: error,
      status: :bad_request,
      code: "BAD_REQUEST",
      message: error.message
    )
  end

  def render_internal_server_error(error)
    handle_and_render(
      exception: error,
      status: :internal_server_error,
      code: "INTERNAL_SERVER_ERROR",
      message: "内部エラーが発生しました"
    )
  end

  def render_not_acceptable(error)
    handle_and_render(
      exception: error,
      status: :not_acceptable,
      code: "NOT_ACCEPTABLE",
      message: "受理できないリクエスト形式です"
    )
  end

  private

  def handle_and_render(exception:, status:, code:, message:, additional_fields: {})
    metadata = {
      request_id: request.request_id,
      path: request.path,
      method: request.method,
      params: request.filtered_parameters
    }

    log_error(exception, context: code, metadata: metadata)
    ErrorHandler.notify_error(exception, context: code, metadata: metadata)

    render_error(
      status: status,
      message: message,
      code: code,
      **additional_fields
    )
  end

  class << self
    def payload(status:, message:, code: nil, **additional_fields)
      error_body = { status: status, message: message, code: code || status.to_s.upcase }
      extra_fields = additional_fields.compact
      error_body.merge!(extra_fields) if extra_fields.any?

      { error: error_body }
    end

    def log_error(error, context: nil, metadata: {})
      StructuredErrorLogger.error(
        error,
        context: context,
        metadata: metadata
      )
    end

    def notify_error(error, context: nil, metadata: {})
      return unless defined?(Sentry)

      Sentry.with_scope do |scope|
        scope.set_context(:error_handler, { context: context, metadata: metadata })
        Sentry.capture_exception(error)
      end
    rescue StandardError => notify_error
      Rails.logger.error("[ERROR] [ErrorHandler::Sentry] #{notify_error.class}: #{notify_error.message}")
    end

    # Error factory methods
    def bad_request(message = "リクエストが無効です")
      ApiError.new(status: :bad_request, message: message, code: "BAD_REQUEST")
    end

    def not_found(message = "リソースが見つかりません")
      ApiError.new(status: :not_found, message: message, code: "NOT_FOUND")
    end

    def forbidden(message = "アクセスが拒否されました")
      ApiError.new(status: :forbidden, message: message, code: "FORBIDDEN")
    end

    def timeout(message = "タイムアウトしました")
      ApiError.new(status: :request_timeout, message: message, code: "TIMEOUT")
    end

    def rate_limit(message = "リクエストが多すぎます", retry_after: nil)
      ApiError.new(status: :too_many_requests, message: message, code: "RATE_LIMIT_EXCEEDED", retry_after: retry_after)
    end

    def not_acceptable(message = "受理できないリクエスト形式です")
      ApiError.new(status: :not_acceptable, message: message, code: "NOT_ACCEPTABLE")
    end

    def service_unavailable(message = "サービスが利用できません")
      ApiError.new(status: :service_unavailable, message: message, code: "SERVICE_UNAVAILABLE")
    end

    def bad_gateway(message = "外部サーバーエラー")
      ApiError.new(status: :bad_gateway, message: message, code: "BAD_GATEWAY")
    end

    def internal_server_error(message = "内部エラーが発生しました")
      ApiError.new(status: :internal_server_error, message: message, code: "INTERNAL_SERVER_ERROR")
    end

    def from_http_status(status_code, message: nil)
      case status_code
      when 400
        bad_request(message)
      when 403
        forbidden(message)
      when 406
        not_acceptable(message)
      when 408
        timeout(message)
      when 429
        rate_limit(message)
      when 500
        internal_server_error(message)
      when 502
        bad_gateway(message)
      when 503
        service_unavailable(message)
      else
        internal_server_error(message)
      end
    end

    def from_http_response(response, message: nil)
      status_code = response.code.to_i
      from_http_status(status_code, message: message)
    end
  end
end
