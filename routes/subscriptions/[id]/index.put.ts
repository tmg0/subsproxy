import { ofetch } from 'ofetch'
import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const subsctiption = await prisma.subsctiption.findUnique({ where: { id } })
  const servers = atob(await ofetch(subsctiption.address)).split(/[\n\r]/).filter(Boolean).flat()
  await Promise.all(servers.map(address => prisma.server.create({ data: { address, subscriptionId: subsctiption.id } })))
  await prisma.server.deleteMany({ where: { subscriptionId: subsctiption.id } })
  return subsctiption
})
