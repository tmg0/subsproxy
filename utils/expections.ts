export const throwBadRequestException = (message = 'Something bad happened') => {
  throw new Error(message)
}
