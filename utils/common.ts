import ping from 'ping'

export const pingServers = (servers: { address: string }[]) => {
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

  return Promise.all(hosts.map(host => ping.promise.probe(host)))
}
