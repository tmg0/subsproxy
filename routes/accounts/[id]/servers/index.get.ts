import { z } from 'zod'
import { prisma } from '~/utils/prisma'
import { pingServers } from '~/utils/common'

const Query = z.object({
  encode: z.boolean()
})

const hasDeadServer = async (servers: { address: string }[]) => {
  const pingResponses = await pingServers(servers)
  return !pingResponses.map(({ alive }) => alive).includes(false)
}

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
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
