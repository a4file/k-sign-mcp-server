export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class SignNotFoundError extends DomainError {
  readonly signId: string;

  constructor(signId: string) {
    super(`Sign not found: ${signId}`);
    this.name = 'SignNotFoundError';
    this.signId = signId;
  }
}

export class InvalidSearchKeywordError extends DomainError {
  constructor() {
    super('Search keyword must not be empty');
    this.name = 'InvalidSearchKeywordError';
  }
}
