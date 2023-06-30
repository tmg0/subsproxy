export const throwBadRequestException = (message = 'Something bad happened') => {
  throw createError({ statusCode: 500, statusMessage: message })
}
