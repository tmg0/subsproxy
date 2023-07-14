import { z } from 'zod'
import { H3Event } from 'h3'
import { prisma } from '~/utils/prisma'
import { getUserAgentFromHeader } from '~/utils/common'

const Query = z.object({
  encode: z.boolean()
})

export const createAccountDevice = async (event: H3Event) => {
  const id = getRouterParam(event, 'id')

  const devices = await prisma.device.findMany({ where: { accountId: id } })

  const ua = getUserAgentFromHeader(event)
  const hasAccessUA = devices.some(device => device.ua === ua)

  if (hasAccessUA) { return }

  const accessDevices = devices.filter(({ ua }) => !ua)

  if (!accessDevices.length) { throwBadRequestException() }

  await prisma.device.update({ data: { ua }, where: { id: accessDevices[0].id } })
}

export const getAccountServers = async (event: H3Event, id: string) => {
  const hash = getAccessTokenFromHeader(event)

  if (hash) {
    try {
      await asyncVerify(hash)
    } catch {
      throwUnauthorizedException()
    }
  }

  if (!hash) { await createAccountDevice(event) }

  const serverIds = await prisma.accountServer.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: serverIds.map(({ serverId }) => ({ id: serverId })) } })

  return servers
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query: z.infer<typeof Query> = getQuery(event)
  const servers = await getAccountServers(event, id)
  return query.encode ? btoa(servers.map(({ address }) => address).join('\n')) : servers
})
