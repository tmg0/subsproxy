import { refetchSubscriptionServers } from '~/routes/subscriptions/[id]/index.put'

export default defineCronHandler('0 0 0 * * *', async () => {
  const subscriptions = await prisma.subscription.findMany()
  Promise.all(subscriptions.map(({ id }) => refetchSubscriptionServers(id)))
})
