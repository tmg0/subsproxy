import ping from 'ping'

const VMESS_PREFIX = 'vmess://'
const SS_PREFIX = 'ss://'

export const parseHosts = (servers: { address: string }[]) => {
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

  return hosts
}

export const pingServers = (servers: { address: string }[]) => {
  const hosts = parseHosts(servers)
  return Promise.all(hosts.map(host => ping.promise.probe(host)))
}
