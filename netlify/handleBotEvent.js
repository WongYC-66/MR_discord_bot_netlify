import util from 'util'
import { EmbedBuilder, codeBlock } from 'discord.js';
import commaNumber from 'comma-number';

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
  /bot roll min max     : roll a number between, up to -10b ~ 10b
  /bot flipcoin         : flip a coin
  /bot author           : show author

  # guide
  /bot apqguide         : link to apq guide
  /bot apqbon           : show apq bonus map
  /bot cwkguide         : link to cwkpq guide
  /bot cwkbon           : show cwkpq bonus map
  /bot gpqguide         : link to gpq guide
  /bot gpqbon           : show gpq bonus map
  /bot opqguide         : link to opq guide
  /bot lpqguide         : link to lpq guide
  /bot mage1hit         : show mage1hit table
  /bot reuel            : link to Reuel hp quest
  /bot leech            : show leech picture
  /bot priceguide       : link to Sylafia price guide
  /bot jobadvance       : link to job advance guide
  /bot hpwashinfo       : show hp wash info table
  
  # troll
  /troll pavoweme         : show how much pav owes me
  /troll pavoweeveryone   : show how much pav owes everyone
  /troll pavfeels         : show pav feeling today
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
    if (body.data.name !== 'bot' && body.data.name !== 'troll') {
        return {
            statusCode: 400,
            body: 'Invalid command, start with "/bot " or "/troll "',
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
    // --------------------- /bot equip xxxx  ---------------------
    if (subCommand === "equip") {
        options = options?.options?.[0]
        const query = options.value
        return getEquipQueryResponse(query)
    }
    // --------------------- /bot item xxxx  ---------------------
    if (subCommand === 'item') {
        options = options?.options?.[0]
        const query = options.value
        return getItemQueryResponse(query)
    }
    // --------------------- /bot monster xxxx  ---------------------
    if (subCommand === 'monster') {
        options = options?.options?.[0]
        const query = options.value
        return getMonsterQueryResponse(query)
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
                    content: codeBlock(`mapleroyals servertime : ${GMT0DateTime}`)
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


        const notInRange = (n) => !(-1e10 <= n && n <= 1e10)

        if (isNaN(min) || isNaN(max) || notInRange(min) || notInRange(max)) {
            content = 'Please Enter Valid Number between -10b, 10b'
        } else {
            content = `Between ${commaNumber(min)} to ${commaNumber(max)}, you rolled a ${commaNumber(pickNumber(min, max))}!`
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: codeBlock(content)
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- /bot flipcoin  ---------------------
    if (subCommand === 'flipcoin') {
        const choices = ['Head', 'Tail']
        const randIdx = Math.floor(Math.random() * (choices.length))
        const result = choices[randIdx]

        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: codeBlock(`You flipped a ${result}!`)
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- /bot author  ---------------------
    if (subCommand === 'author') {
        let response = myOneLinerLinkResponse('ScottY5C', 'https://royals-library.netlify.app/about-me')
        return response
    }
    // ######## GUIDE ########
    // --------------------- /bot apqguide  ---------------------
    if (subCommand === 'apqguide') {
        let response = myOneLinerLinkResponse('APQ Guide', 'https://royals.ms/forum/threads/comprehensive-apq-guide-updated-feb-2021.172942/')
        return response
    }
    // --------------------- /bot apqbon  ---------------------
    if (subCommand === 'apqbon') {
        let response = myOneLinerImageResponse('APQ Bonus Map', 'https://royals.ms/forum/attachments/3z07lbj-png.189083/')
        return response
    }
    // --------------------- /bot cwkguide  ---------------------
    if (subCommand === 'cwkguide') {
        let response = myOneLinerLinkResponse('CWKPQ Guide', 'https://royals.ms/forum/threads/crimsonwood-party-quest-prequisite-guide-2020-cwpq.153541/')
        return response
    }
    // --------------------- /bot cwkbon  ---------------------
    if (subCommand === 'cwkbon') {
        let response = myOneLinerImageResponse('CWKPQ Bonus Map', 'https://imgur.com/KED684z/')
        return response
    }
    // --------------------- /bot gpqguide  ---------------------
    if (subCommand === 'gpqguide') {
        let response = myOneLinerLinkResponse('GPQ Guide', 'https://royals.ms/forum/threads/%E2%9C%AF-hollywood-presents-a-comprehensive-guide-to-guild-party-quest-gpq.27299/')
        return response
    }
    // --------------------- /bot gpqbon  ---------------------
    if (subCommand === 'gpqbon') {
        let response = myOneLinerImageResponse('GPQ Bonus Map', 'https://i.imgur.com/EcaEybL.png/')
        return response
    }
    // --------------------- /bot opqguide  ---------------------
    if (subCommand === 'opqguide') {
        let response = myOneLinerLinkResponse('OPQ Guide', 'https://royals.ms/forum/threads/orbis-pq-guide.174277/')
        return response
    }
    // --------------------- /bot lpqguide  ---------------------
    if (subCommand === 'lpqguide') {
        let response = myOneLinerLinkResponse('LPQ Guide', 'https://royals.ms/forum/threads/ludibrium-party-quest-lpq-guide.108791/')
        return response
    }
    // --------------------- /bot mage1hit  ---------------------
    if (subCommand === 'mage1hit') {
        let response = myOneLinerImageResponse('Mage 1 hit', 'https://imgur.com/a/UZbW1Hk/')
        return response
    }
    // --------------------- /bot reuel  ---------------------
    if (subCommand === 'reuel') {
        let response = myOneLinerLinkResponse('Reuel HP Quest', 'https://royals.ms/forum/threads/comprehensive-search-for-the-elixir-of-life-reuel-hp-quest-guide-lv120.178648/')
        return response
    }
    // --------------------- /bot leech  ---------------------
    if (subCommand === 'leech') {
        let response = myOneLinerImageResponse('Leech', 'https://imgur.com/a/SFucr4l/')
        return response
    }
    // --------------------- /bot priceguide  ---------------------
    if (subCommand === 'leech') {
        let response = myOneLinerLinkResponse('Sylafia price guide', 'https://docs.google.com/spreadsheets/d/1B3sxmpaW7RGrQAAxAyeR-xS4mdKCTTs_DzgV0qo2p_8/edit?gid=0#gid=0/')
        return response
    }
    // --------------------- /bot jobadvance  ---------------------
    if (subCommand === 'jobadvance') {
        let response = myOneLinerLinkResponse('Job Advancement', 'https://royals.ms/forum/threads/new-source-job-advancement-guide.110142/')
        return response
    }
    // --------------------- /bot hpwashinfo  ---------------------
    if (subCommand === 'hpwashinfo') {
        let response = myOneLinerLinkResponse('Hp Wash Info', 'https://imgur.com/a/s2xNvh3/')
        return response
    }
    // ######## TROLL ######## 
    // --------------------- /bot pavoweme  ---------------------
    if (subCommand === 'pavoweme' || subCommand === 'pavoweeveryone') {
        let min = 0
        let max = 100000000
        let toWho = subCommand === 'pavoweme' ? 'me' : 'everyone'
        let content = `Pav owes ${toWho} ${commaNumber(pickNumber(min, max))}! A Random number from 0-100m. PS: this a troll`
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: codeBlock(content)
                },
            }),
            headers: { 'Content-Type': 'application/json' },
        }
    }
    // --------------------- /bot pavfeeling  ---------------------
    if (subCommand === 'pavfeels') {
        const choices = [
            "happy",
            "sad",
            "angry",
            "excited",
            "nervous",
            "anxious",
            "lonely",
            "hopeful",
            "jealous",
            "grateful",
            "confused",
            "embarrassed",
            "proud",
            "guilty",
            "bored",
            "frustrated",
            "relaxed",
            "scared",
            "content",
            "ashamed",
            "curious",
            "overwhelmed",
            "surprised",
            "peaceful",
            "disappointed",
            "enthusiastic",
            "loved",
            "resentful",
            "confident",
            "indifferent"
        ];
        const randIdx = Math.floor(Math.random() * (choices.length))
        const result = choices[randIdx]
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: codeBlock(`Pav feels **${result}** today! Doesn't he ?`)
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

const myOneLinerLinkResponse = (name, url) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [
                    {
                        description: `[${name}](${url})`,
                        color: 0x00b0f4
                    }
                ]
            }
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const myOneLinerImageResponse = (name, url) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [
                    {
                        title: name,
                        image: {
                            url: url // must be a public URL
                        },
                        color: 0x00b0f4
                    }
                ]
            }
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