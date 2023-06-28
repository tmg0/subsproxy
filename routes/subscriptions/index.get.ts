import { prisma } from '../../utils/prisma'

export default defineEventHandler(() => {
  return prisma.subsctiption.findMany()
})
