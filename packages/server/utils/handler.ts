import { EventHandler } from 'h3'
import { asyncVerify, getAccessTokenFromHeader } from './common'
import { throwUnauthorizedException } from './expection'
import { SECRET_KEY } from './constant'

export const defineAuthenticatedEventHandler = (handler: EventHandler) => {
  return defineEventHandler(async (event) => {
    const hash = getAccessTokenFromHeader(event)
    if (!hash) { throwUnauthorizedException() }

    try {
      await asyncVerify(hash, SECRET_KEY)
      return handler(event)
    } catch {
      throwUnauthorizedException()
    }
  })
}
