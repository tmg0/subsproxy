import { z } from 'zod'
import { ofetch } from 'ofetch'
import { createAccountServer } from '~/routes/accounts/[id]/servers/index.post'

const Body = z.object({
  address: z.string().url().trim(),
  alias: z.string().optional()
})

type Body = z.infer<typeof Body>

export const resetSubscriptionServers = async (id: string) => {
  const subscription = await prisma.subscription.findUnique({ where: { id } })
  if (!subscription) { throwBadRequestException() }
  const servers = atob(await ofetch(subscription.address)).split(/[\n\r]/).filter(Boolean).flat()

  const oldServers = await prisma.server.findMany({ where: { subscriptionId: id } })
  const accounts = await prisma.accountServer.groupBy({
    by: ['accountId'],
    _count: { serverId: true },
    where: {
      OR: oldServers.map(({ id }) => ({ serverId: id }))
    }
  })

  await prisma.$transaction([
    prisma.accountServer.deleteMany({ where: { OR: oldServers.map(({ id }) => ({ serverId: id })) } }),
    prisma.server.deleteMany({ where: { subscriptionId: subscription.id } }),
    ...servers.map(address => prisma.server.create({ data: { address, subscriptionId: subscription.id } }))
  ])

  accounts.forEach(({ accountId, _count }) => {
    createAccountServer(accountId, { count: _count.serverId })
  })

  return subscription
}

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Body>(event)

  if (body.address) {
    await prisma.subscription.update({ where: { id }, data: { address: body.address } })
  }

  return resetSubscriptionServers(id)
})
