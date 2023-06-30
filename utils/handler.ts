import { EventHandler } from 'h3'

export const defineAuthenticatedEventHandler = (handler: EventHandler) => {
  return defineEventHandler(async (event) => {
    // do something before the route handler
    const response = await handler(event)
    // do something after the route handler
    return handler(event)
  })
}
