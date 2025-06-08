import util from 'util'


import { EmbedBuilder, codeBlock } from 'discord.js';

import { generateEquipURL, generateMonsterURL, generateItemURL } from './utility.js'

const API_URL = 'https://royals-library.netlify.app/api/v1';
const LIBRARY_URL = 'https://royals-library.netlify.app';

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
    // console.log(body.data)
    console.log(util.inspect(body.data, {showHidden: false, depth: null, colors: true}))
    
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

    let options = body.data.options?.[0]


    // --------------------- /bot equip xxxx  ---------------------
    if (options.name === "equip") {
        const query = options.value
        console.log(query)

        let data = await fetch(`${API_URL}/equip?search=${query}`)
        data = await data.json()
        data = data.data?.[0]       // get the first of returned array
        console.log(data)

        if (!data) return NotFound()

        const level = data?.reqLevel || '0'
        const category = data.category?.[2] || 'undefined'
        const upgradeSlot = data?.tuc || '0'
        const equipURL = generateEquipURL(data)

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name)
                            .setURL(equipURL)
                            // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                            // .setDescription('Some description here')
                            .setThumbnail(data.imgURL)
                            .addFields(
                                // { name: 'Regular field title', value: 'Some value here' },
                                // { name: '\u200B', value: '\u200B' },
                                { name: 'Level', value: level, inline: true },
                                { name: 'Category', value: category, inline: true },
                                { name: 'Upgrade', value: upgradeSlot, inline: true },
                                // { name: 'Inline field title', value: 'Some value here', inline: true },
                            )
                        // .setImage('https://i.imgur.com/AfFp7pu.png')
                        // .setTimestamp()
                        // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' })
                    ]
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }

    // --------------------- /bot monster xxxx  ---------------------

    if (options.name === 'monster') {
        const query = options.value
        console.log(query)

        let data = await fetch(`${API_URL}/monster?search=${query}`)
        data = await data.json()
        data = data.data?.[0]       // get the first of returned array
        console.log(data)

        if (!data) return NotFound()

        const level = data?.level || '0'
        const exp = data?.exp?.toString() || '0'
        const Hp = data?.maxHP || '0'
        const monsterURL = generateMonsterURL(data)

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name)
                            .setURL(monsterURL)
                            .setThumbnail(data.imgURL)
                            .addFields(
                                { name: 'Level', value: level, inline: true },
                                { name: 'EXP', value: exp, inline: true },
                                { name: 'HP', value: Hp, inline: true },
                            )
                    ]
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }

    // --------------------- /bot item xxxx  ---------------------

    if (options.name === 'item') {
        const query = options.value
        console.log(query)

        let data = await fetch(`${API_URL}/item?search=${query}`)
        data = await data.json()
        data = data.data?.[0]       // get the first of returned array
        console.log(data)

        if (!data) return NotFound()

        const name = data?.name || 'no name'
        const desc = data?.desc?.replaceAll("\\n", " ") || 'no description'
        const itemURL = generateItemURL(data)

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    embeds: [
                        new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle(data.name)
                            .setURL(itemURL)
                            .setThumbnail(data.imgURL)
                            .addFields(
                                { name: 'Name', value: name, inline: true },
                                { name: 'Description', value: desc, inline: true },
                            )
                    ]
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }

    // --------------------- /bot item xxxx  ---------------------

    if (options.name === 'help') {
        const helpString =
            `VNHOES BOT HELP:
            /bot equip xxxx         : search and return 1st equip from unofficial library
            /bot monster xxxx       : search and return 1st monster from unofficial library
            /bot item xxxx          : search and return 1st item from unofficial library
            /bot help               : show help
        `

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    contents: codeBlock(helpString)
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

