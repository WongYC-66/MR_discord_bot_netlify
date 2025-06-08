const { verifyKey } = require('discord-interactions')

const PUBLIC_KEY = '20ee356b0c6b8ee31c1c693df6d368a711a82e98f76f00801eee2b4d6ac09e14'

exports.handler = async (event) => {
  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  const rawBody = event.body

  const isValid = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY)

  if (!isValid) {
    return {
      statusCode: 401,
      body: 'Invalid request signature',
    }
  }

  const body = JSON.parse(rawBody)

  if (body.type === 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
      headers: { 'Content-Type': 'application/json' },
    }
  }

  if (body.type === 2 && body.data.name === 'ping') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: {
          content: '🏓 Pong!',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  }

  return {
    statusCode: 400,
    body: 'Unhandled interaction',
  }
}
