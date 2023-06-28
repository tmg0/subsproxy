import { z } from 'zod'
import { ofetch } from 'ofetch'
import { prisma } from '~/utils/prisma'

const Subscription = z.object({
  address: z.string().url().trim(),
  alias: z.string().optional()
})

export type Subscription = Required<z.infer<typeof Subscription>>

export default defineEventHandler(async (event) => {
  const body = await readBody<Subscription>(event)
  Subscription.parse(body)
  const subsctiption = await prisma.subsctiption.create({ data: body })
  const servers = atob(await ofetch(body.address)).split(/[\n\r]/).filter(Boolean).flat()
  await Promise.all(servers.map(address => prisma.server.create({ data: { address, subscriptionId: subsctiption.id } })))
  return subsctiption
})
