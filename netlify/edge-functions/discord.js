import { verifyKey } from 'discord-interactions'

const PUBLIC_KEY = 'YOUR_DISCORD_PUBLIC_KEY' // Replace with your bot's public key

export default async function handler(req) {
  const { method, headers, body } = req

  if (method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const rawBody = await req.text()
  const signature = headers.get('x-signature-ed25519')
  const timestamp = headers.get('x-signature-timestamp')

  // Validate request
  const isValid = verifyKey(rawBody, signature, timestamp, PUBLIC_KEY)
  if (!isValid) {
    return new Response('Bad request signature', { status: 401 })
  }

  const json = JSON.parse(rawBody)

  // Discord ping check (for registration)
  if (json.type === 1) {
    return new Response(JSON.stringify({ type: 1 }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Slash command handler
  if (json.type === 2 && json.data.name === 'ping') {
    return new Response(JSON.stringify({
      type: 4, // CHANNEL MESSAGE WITH SOURCE
      data: {
        content: 'Pong!',
      },
    }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response('Not handled', { status: 400 })
}
