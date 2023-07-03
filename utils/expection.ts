export const throwBadRequestException = (message = 'Something bad happened') => {
  throw createError({ statusCode: 500, statusMessage: message })
}

export const throwUnauthorizedException = (message = 'Forbidden') => {
  throw createError({ statusCode: 403, statusMessage: message })
}
