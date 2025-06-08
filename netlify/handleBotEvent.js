const API_URL = 'https://royals-library.netlify.app/api/v1'

const NotFound = () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: { content: 'Not found' },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const handleBotEvent = async (rawBody) => {
    // refer to discord API, https://discord.com/developers/docs/interactions/receiving-and-responding
    const body = JSON.parse(rawBody)
    console.log(body.data)

    // Ping from Discord, DEFAULT, DON'T TOUCH ANYTHING!
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // Ping from Discord, DEFAULT, DON'T TOUCH ANYTHING!


    // e.g. /bot equip maple gun

    if (body.data.name !== 'bot' && body.type !== 2) {
        return {
            statusCode: 400,
            body: 'Invalid command, start with "/bot " and type must be 2',
        }
    }

    // --------------- FOR DEVELOPERS --------------- :
    // // Slash command (example)
    // if (body.type === 2 && body.data.name === 'ping') {
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify({
    //             type: 4,
    //             data: { content: '🏓 Pong!' },
    //         }),
    //         headers: { 'Content-Type': 'application/json' },
    //     }
    // }

    const options = body.data.options?.[0]

    // 1. /bot equip maplegun
    if (options.name === "equip") {
        const query = options.value
        console.log(query)

        let data = await fetch(`${API_URL}/equip?search=${query}`)
        data = await data.json()
        data = data.data?.[0]       // get the first of returned array
        console.log(data)

        if (!data) return NotFound()

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    embeds: [
                        {
                            title: data.name,                        // optional: name of the item
                            description: 'description!',             // optional: additional text
                            image: {
                                url: data.imageURL                   // your image link here
                            },
                            url: data.imageURL  ,                    // optional: makes title clickable
                            color: 0xffcc00                          // optional: embed border color
                        }
                    ]
                },
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

