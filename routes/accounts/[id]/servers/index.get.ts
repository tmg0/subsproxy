import { z } from 'zod'
import ping from 'ping'
import { prisma } from '~/utils/prisma'

const Query = z.object({
  encode: z.boolean()
})

const pingServers = async (servers: { address: string }[]) => {
  const VMESS_PREFIX = 'vmess://'
  const SS_PREFIX = 'ss://'

  const hosts: string[] = servers.map(({ address }) => {
    if (address.startsWith(VMESS_PREFIX)) {
      const decode = atob(address.replace(VMESS_PREFIX, ''))
      return JSON.parse(decode).add
    }

    if (address.startsWith(SS_PREFIX)) {
      const [encode] = address.replace(SS_PREFIX, '').split('#')
      const [_, server] = atob(encode).split(':')
      return server.split('@')[1]
    }

    return address
  })
  return !(await (Promise.all(hosts.map(host => ping.promise.probe(host))))).map(alive => alive).includes(false)
}

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const query: z.infer<typeof Query> = getQuery(event)
  const serverIds = await prisma.accountServer.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: serverIds.map(({ serverId }) => ({ id: serverId })) } })

  pingServers(servers).then((valid) => {
    if (!valid) {
      // TODO: Refetch subscriptions.
    }
  })

  return query.encode ? btoa(servers.map(({ address }) => address).join('\n')) : servers.map(({ id }) => ({ id }))
})
