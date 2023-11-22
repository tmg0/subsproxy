import { refetchSubscriptionServers } from '~/routes/subscriptions/[id]/index.put'
import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { subscriptionId } = await prisma.server.findUnique({ where: { id } })
  return refetchSubscriptionServers(subscriptionId)
})
