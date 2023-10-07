import { getAccountServers } from '../index.get'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const servers = await getAccountServers(event, id)
  return btoa(servers.map(({ address }) => address).join('\n'))
})
