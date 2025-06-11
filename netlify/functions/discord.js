import { verifyKey } from 'discord-interactions';
import { handleEvents } from '../handleEvents';

export const handler = async (event) => {

  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  const rawBody = event.body || "{}"
  const APP_PUBLIC_KEY = process.env.APP_PUBLIC_KEY

  // console.log({ APP_PUBLIC_KEY })   // debug
  // console.log(event) // debug

  const isLocalTestServer = event.headers.host.includes('localhost')
  const isFromHostedSelf = event.headers.host.includes('vnhoes-bot.netlify.app')
  console.log(event.headers.host)

  if (!isLocalTestServer && !isFromHostedSelf) {
    // for public release discord bot, must verify input from discord
    let response = await verifyFromDiscord(rawBody, signature, timestamp, APP_PUBLIC_KEY)
    if (response.statusCode !== 200) {
      return response // if error
    }
  }

  try {
    let response = await handleEvents(rawBody)  // handle command
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
    return isValid ?
      {
        statusCode: 200
      } : {
        statusCode: 401,
        body: 'Invalid request signature',
      }
  } catch (e) {
    console.error('Signature verification threw:', e)
    return {
      statusCode: 401,
      body: 'Signature verification failed',
    }
  }
}