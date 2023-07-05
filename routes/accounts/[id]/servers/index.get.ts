import { z } from 'zod'
import { prisma } from '~/utils/prisma'
import { getUserAgentFromHeader, pingServers } from '~/utils/common'

const Query = z.object({
  encode: z.boolean()
})

const hasDeadServer = async (servers: { address: string }[]) => {
  const pingResponses = await pingServers(servers)
  return !pingResponses.map(({ alive }) => alive).includes(false)
}

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const accountDevices = await prisma.accountDevice.findMany()
  if (!accountDevices || !accountDevices.length) { throwBadRequestException() }

  const ua = getUserAgentFromHeader(event)
  const hasEmpty = accountDevices.some(({ deviceId }) => !deviceId)

  if (hasEmpty) {
    const { id: deviceId } = await prisma.device.create({ data: { ua } })
    const { id: accountDeviceId } = await prisma.accountDevice.findFirst({ where: { deviceId: null } })
    await prisma.accountDevice.update({ where: { id: accountDeviceId }, data: { deviceId } })
  }

  const devices = await prisma.device.findMany({ where: { OR: accountDevices.map(({ deviceId }) => ({ id: deviceId })) } })

  if (!hasEmpty && !devices.some(device => device.ua === ua)) { throwBadRequestException() }

  const query: z.infer<typeof Query> = getQuery(event)
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

  return query.encode ? btoa(servers.map(({ address }) => address).join('\n')) : servers
})
