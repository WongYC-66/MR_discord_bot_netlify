import util from 'util'
import { EmbedBuilder, codeBlock } from 'discord.js';

import {
    generateEquipURL,
    generateMonsterURL,
    generateItemURL,
    generateSkillURL,
    getDatetimeFromRoyals
} from './utility.js'

const API_URL = 'https://royals-library.netlify.app/api/v1';
const helpString =
    `
VNHOES BOT HELP:
  /bot help             : show help
  /bot equip xxxx       : search and return 1st equip
  /bot item xxxx        : search and return 1st item
  /bot monster xxxx     : search and return 1st monster
  /bot skill xxxx       : search and return 1st skill
  /bot music xxxx       : search and return 1st music
  /bot servertime       : show mapleroyals servertime
  /bot roll min max     : roll a number between, up to -10000 ~ 10000
`

export const handleBotEvent = async (rawBody) => {
    // refer to discord API, https://discord.com/developers/docs/interactions/receiving-and-responding
    const body = JSON.parse(rawBody)
    // console.log(body.data)
    console.log(util.inspect(body.data, { showHidden: false, depth: null, colors: true }))

    // Ping from Discord, DEFAULT, DON'T TOUCH ANYTHING!
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
            headers: { 'Content-Type': 'application/json' },
        }
    }

    // e.g. /bot equip maple gun
    if (body.data.name !== 'bot') {
        return {
            statusCode: 400,
            body: 'Invalid command, start with "/bot "',
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

    let subCommand = body.data.options?.[0].name
    let options = body.data.options?.[0]


    // --------------------- /bot equip xxxx  ---------------------
    if (subCommand === "equip") {
        options = options?.options?.[0]
        const query = options.value
        return getEquipQueryResponse(query)
    }
    // --------------------- /bot monster xxxx  ---------------------
    if (subCommand === 'monster') {
        options = options?.options?.[0]
        const query = options.value
        return getMonsterQueryResponse(query)
    }
    // --------------------- /bot item xxxx  ---------------------
    if (subCommand === 'item') {
        options = options?.options?.[0]
        const query = options.value
        return getItemQueryResponse(query)
    }
    // --------------------- /bot item xxxx  ---------------------
    if (subCommand === 'skill') {
        options = options?.options?.[0]
        const query = options.value
        return getSkillQueryResponse(query)
    }
    // --------------------- /bot item xxxx  ---------------------
    if (subCommand === 'music') {
        options = options?.options?.[0]
        const query = options.value
        return getMusicQueryResponse(query)
    }
    // --------------------- /bot servertime  ---------------------
    if (subCommand === 'servertime') {
        const GMT0DateTime = await getDatetimeFromRoyals()
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: `mapleroyals servertime : ${GMT0DateTime}`
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- /bot roll min max  ---------------------
    if (subCommand === 'roll') {
        const minInput = options?.options?.[0].value
        const maxInput = options?.options?.[1].value
        let min = Number(minInput)
        let max = Number(maxInput)
        let content = null


        const notInRange = (n) => !(-10000 <= n && n <= 10000)

        if (isNaN(min) || isNaN(max) || notInRange(min) || notInRange(max)) {
            content = 'Please Enter Valid Number between -10000, 10000'
        } else {
            content = `${pickNumber(min, max)} . (${min} - ${max})`
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: `${content}`
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- /bot help  ---------------------
    if (subCommand === 'help') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: codeBlock(helpString)
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- Not registered command ---------------------
    return {
        statusCode: 400,
        body: 'Un-registered command',
    }
}

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


const getEquipQueryResponse = async (query) => {
    console.log(query)

    let data = await fetch(`${API_URL}/equip?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    const name = data?.name || 'undefined'
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
                        .setTitle(name)
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

const getMonsterQueryResponse = async (query) => {
    console.log(query)

    let data = await fetch(`${API_URL}/monster?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    const name = data?.name || 'undefined'
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
                        .setTitle(name)
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


const getItemQueryResponse = async (query) => {
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
                        .setTitle(name)
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

const getSkillQueryResponse = async (query) => {
    console.log(query)

    let data = await fetch(`${API_URL}/skill?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    const name = data?.name || 'no name'
    const desc = data?.desc?.replaceAll("\\n", " ") || 'no description'
    const skilLURL = generateSkillURL(data)
    const job = data?.job

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(name)
                        .setURL(skilLURL)
                        .setThumbnail(data.imgURL)
                        .addFields(
                            { name: 'Name', value: name, inline: true },
                            { name: 'Description', value: desc, inline: true },
                            { name: 'Job', value: job, inline: true },
                        )
                ]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const getMusicQueryResponse = async (query) => {
    console.log(query)

    let data = await fetch(`${API_URL}/music?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    const name = data?.name || 'no name'
    const length = (data?.length || 'undefined') + 's'
    const bgm = data?.bgm || 'undefined'
    const bgmURL = data?.bgmURL || 'undefined'

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [
                    new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(name)
                        .setURL(bgmURL)
                        .addFields(
                            { name: 'Name', value: bgm, inline: true },
                            { name: 'Length', value: length, inline: true },
                        )
                ]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const pickNumber = (minInput, maxInput) => {
    const min = Math.min(minInput, maxInput)
    const max = Math.max(minInput, maxInput)
    const size = max - min + 1
    const rand = Math.floor(Math.random() * size)
    return min + rand
}