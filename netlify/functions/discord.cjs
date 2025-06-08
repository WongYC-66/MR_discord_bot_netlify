const { verifyKey } = require('discord-interactions')

exports.handler = async (event) => {

  console.log('BODY:', event.body)

  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  const rawBody = event.body

  try {
    const isValid = await verifyKey(rawBody, signature, timestamp, PUBLIC_KEY)

    if (!isValid) {
      return {
        statusCode: 401,
        body: 'Invalid request signature',
      }
    }
  } catch (e) {
    console.error('Signature verification threw:', e)
    return {
      statusCode: 401,
      body: 'Signature verification failed',
    }
  }

  const body = JSON.parse(rawBody)

  // Ping from Discord
  if (body.type === 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: 1 }),
      headers: { 'Content-Type': 'application/json' },
    }
  }
  
  // --------------- FOR DEVELOPERS --------------- :
  // Slash command (example)
  if (body.type === 2 && body.data.name === 'ping') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 4,
        data: { content: '🏓 Pong!' },
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  }



  return {
    statusCode: 400,
    body: 'Unhandled interaction',
  }
}
