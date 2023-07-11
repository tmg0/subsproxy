import { EventHandler } from 'h3'
import { CronJob } from 'cron'
import { asyncVerify, getAccessTokenFromHeader } from './common'
import { throwUnauthorizedException } from './expection'

export const defineAuthenticatedEventHandler = (handler: EventHandler) => {
  return defineEventHandler(async (event) => {
    const hash = getAccessTokenFromHeader(event)
    if (!hash) { throwUnauthorizedException() }

    try {
      await asyncVerify(hash)
      return handler(event)
    } catch {
      throwUnauthorizedException()
    }
  })
}

export const defineCronHandler = (cron: string, handler: () => void) => {
  return new CronJob(cron, handler)
}
