export class EdgeCaseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'EdgeCaseError'
  }
}
export class NotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'NotFoundError'
  }
}
