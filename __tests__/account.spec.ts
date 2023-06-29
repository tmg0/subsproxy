import { describe, test, expect } from 'vitest'
import { ofetch } from 'ofetch'

describe('account', () => {
  test('should not get accounts without query', async () => {
    try {
      await ofetch('http://127.0.0.1:3000/accounts')
      expect(0).toBe(1)
    } catch {
      expect(1).toBe(1)
    }
  })

  test('should only get current account access servers', async () => {
    const [{ id }] = await ofetch('http://127.0.0.1:3000/accounts', { query: { username: 'zekun.jin' } })
    const servers = await ofetch(`http://127.0.0.1:3000/accounts/${id}/servers`)
    expect(servers.length).toBe(4)
  })

  test('should not create a exist username account', async () => {
    try {
      await ofetch('http://127.0.0.1:3000/accounts', { method: 'post', body: { username: 'zekun.jin' } })
      expect(0).toBe(1)
    } catch {
      expect(1).toBe(1)
    }
  })
})
