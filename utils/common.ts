import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import ping from 'ping'

export const VMESS_PREFIX = 'vmess://'
export const SS_PREFIX = 'ss://'

export const isVmess = (address: string) => address.startsWith(VMESS_PREFIX)
export const isShadowsocks = (address: string) => address.startsWith(SS_PREFIX)

export const parseHosts = (servers: { address: string }[]) => {
  const hosts: string[] = servers.map(({ address }) => {
    if (isVmess(address)) {
      const decode = atob(address.replace(VMESS_PREFIX, ''))
      return JSON.parse(decode).add
    }

    if (isShadowsocks(address)) {
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

export const getAccessTokenFromHeader = (event: H3Event) => {
  return getHeader(event, 'Authorization')
}

export const asyncVerify = (token: string, secretKey = '') => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decode) => {
      if (err) { reject(err) }
      resolve(decode)
    })
  })
}

export const generateAccessToken = (payload: any, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

export const getUserAgentFromHeader = (event: H3Event) => {
  return getHeader(event, 'User-Agent')
}
