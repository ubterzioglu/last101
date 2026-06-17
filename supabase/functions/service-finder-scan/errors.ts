// Hata sınıfları ve retry davranışı (corteqs service-finder/src/errors.ts'ten port).

export class BudgetExceededError extends Error {
  readonly code = 'budget_exceeded'
  constructor(message = 'Hard cap aşıldı') {
    super(message)
    this.name = 'BudgetExceededError'
  }
}

export class ProviderRateLimitError extends Error {
  readonly code = 'provider_rate_limited'
  readonly retryable = true
  constructor(provider: string, public readonly retryAfterSeconds = 60) {
    super(`Sağlayıcı rate limit: ${provider}`)
    this.name = 'ProviderRateLimitError'
  }
}

export class ProviderTemporaryError extends Error {
  readonly code = 'provider_temporary'
  readonly retryable = true
  constructor(provider: string, detail: string) {
    super(`Geçici sağlayıcı hatası (${provider}): ${detail}`)
    this.name = 'ProviderTemporaryError'
  }
}

export class AuthOrConfigError extends Error {
  readonly code = 'auth_or_config'
  constructor(detail: string) {
    super(`Yapılandırma/yetki hatası: ${detail}`)
    this.name = 'AuthOrConfigError'
  }
}

export function isRetryable(error: unknown): boolean {
  return error instanceof ProviderRateLimitError || error instanceof ProviderTemporaryError
}

export function errorCode(error: unknown): string {
  if (
    error instanceof BudgetExceededError ||
    error instanceof ProviderRateLimitError ||
    error instanceof ProviderTemporaryError ||
    error instanceof AuthOrConfigError
  ) {
    return error.code
  }
  return 'unexpected_error'
}

export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Beklenmeyen hata'
}
