import { z } from 'zod'
import { H3Event } from 'h3'
import { prisma } from '~/utils/prisma'
import { getUserAgentFromHeader, pingServers } from '~/utils/common'

const Query = z.object({
  encode: z.boolean()
})

const hasDeadServer = async (servers: { address: string }[]) => {
  const pingResponses = await pingServers(servers)
  return !pingResponses.map(({ alive }) => alive).includes(false)
}

export const getAccountServers = async (event: H3Event, id: string) => {
  const accountDevices = (await prisma.accountDevice.findMany()) || []
  if (!accountDevices || !accountDevices.length) { throwBadRequestException() }

  const devices = await prisma.device.findMany({
    where: {
      OR: accountDevices.map(({ deviceId }) => ({ id: deviceId })).filter(({ id }) => !!id)
    }
  })

  const ua = getUserAgentFromHeader(event)
  const hasAccessUA = devices.some(device => device.ua === ua)

  if (!hasAccessUA) {
    const hasEmpty = accountDevices.some(({ deviceId }) => !deviceId)

    if (!hasEmpty) { throwBadRequestException() }

    if (hasEmpty) {
      await prisma.$transaction(async (prisma) => {
        const { id: deviceId } = await prisma.device.create({ data: { ua } })
        const { id: accountDeviceId } = await prisma.accountDevice.findFirst({ where: { deviceId: null } })
        await prisma.accountDevice.update({ where: { id: accountDeviceId }, data: { deviceId } })
      })
    }
  }

  const serverIds = await prisma.accountServer.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: serverIds.map(({ serverId }) => ({ id: serverId })) } })

  hasDeadServer(servers).then((valid) => {
    if (!valid) {
      /**
       * TODO: Refetch subscriptions.
       *
       * Step 1: Refetch subscriptions
       * Step 2: Remove servers belongs to subscriptions
       * Step 3: Remove account server relationships
       * Step 4: Create new servers
       * Step 5: Bind new servers to account
       */
    }
  })

  return servers
}

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const query: z.infer<typeof Query> = getQuery(event)
  const servers = await getAccountServers(event, id)
  return query.encode ? btoa(servers.map(({ address }) => address).join('\n')) : servers
})
