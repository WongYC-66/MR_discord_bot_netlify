const { verifyKey } = require('discord-interactions')

exports.handler = async (event) => {

  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  const rawBody = event.body || "{}"
  const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY

  // console.log({ APP_PUBLIC_KEY })   // debug
  // console.log(event) // debug

  const isLocalTestServer = event.headers.host.includes('localhost')

  if (!isLocalTestServer) {
    // for public release discord bot, must verify input from discord
    let response = await verifyFromDiscord(rawBody, signature, timestamp, APP_PUBLIC_KEY)
    if (response.statusCode !== 200) {
      return response // if error
    }
  }

  try {
    let response = await handleBotEvent(rawBody)  // handle command
    return response
  } catch (e) {
    console.error(e)
    return {
      statusCode: 500,
      body: `Internal Error, ${e.message}`,
    }
  }

}

const verifyFromDiscord = async (rawBody, signature, timestamp, APP_PUBLIC_KEY) => {
  try {
    const isValid = await verifyKey(rawBody, signature, timestamp, APP_PUBLIC_KEY)

    if (!isValid) {
      return {
        statusCode: 401,
        body: 'Invalid request signature',
      }
    } else {
      return {
        statusCode: 200,
      }
    }
  } catch (e) {
    console.error('Signature verification threw:', e)
    return {
      statusCode: 401,
      body: 'Signature verification failed',
    }
  }
}

const handleBotEvent = async (rawBody) => {
  const body = JSON.parse(rawBody)
  console.log({ body })

  // Ping from Discord, DEFAULT, DON'T TOUCH ANYTHING!
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


  // Not registered command
  return {
    statusCode: 400,
    body: 'Un-registered command',
  }
}