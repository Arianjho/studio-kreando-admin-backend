import { getPayload, type Payload } from 'payload'
import config from '../payload.config'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

let payload: Payload

beforeAll(async () => {
  const payloadConfig = await config
  payload = await getPayload({ config: payloadConfig })
})

afterAll(async () => {
  await payload.destroy?.()
})

describe('messages access control', () => {
  it('allows unauthenticated create', async () => {
    const doc = await payload.create({
      collection: 'messages',
      data: {
        name: 'Test',
        email: 'test@example.com',
        subject: 'Hola',
        message: 'Mensaje de prueba de acceso',
      },
    })
    expect(doc.id).toBeDefined()
    await payload.delete({ collection: 'messages', id: doc.id })
  })

  it('denies unauthenticated read via REST', async () => {
    const res = await fetch('http://localhost:3011/api/messages')
    expect(res.status).not.toBe(200)
  })
})

describe('projects access control', () => {
  it('allows unauthenticated read via REST', async () => {
    const res = await fetch('http://localhost:3011/api/projects')
    expect(res.status).toBe(200)
  })
})
