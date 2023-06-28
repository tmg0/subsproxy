import { z } from 'zod'
import { prisma } from '../../utils/prisma'

const Subscription = z.object({
  address: z.string().url().trim(),
  alias: z.string().optional()
})

export type Subscription = Required<z.infer<typeof Subscription>>

export default defineEventHandler(async (event) => {
  const body = await readBody<Subscription>(event)
  Subscription.parse(body)
  return prisma.subsctiption.create({ data: body })
})
