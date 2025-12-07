module StructuredErrorLogger
  class << self
    def exception_to_hash(error, context: nil, metadata: {})
      hash = {
        context: context,
        error_class: error.class.to_s,
        error_message: error.message
      }
      hash[:metadata] = metadata if metadata.present?
      if error.respond_to?(:backtrace)
        hash[:backtrace] = error.backtrace
      end
      hash
    end

    def error(error, context: nil, metadata: {})
      log_with_level(:error, error, context: context, metadata: metadata)
    end

    def warn(error, context: nil, metadata: {})
      log_with_level(:warn, error, context: context, metadata: metadata)
    end

    private

    def log_with_level(level, error, context:, metadata:)
      payload = exception_to_hash(error, context: context, metadata: metadata)
      Rails.logger.public_send(level, payload.to_json)
    rescue StandardError => logging_error
      Rails.logger.error("[ERROR] [StructuredErrorLogger] #{logging_error.class}: #{logging_error.message}")
    end
  end
end
