import util from 'util'
import { EmbedBuilder, codeBlock } from 'discord.js';
import commaNumber from 'comma-number';

import {
    generateEquipURL,
    generateMonsterURL,
    generateItemURL,
    generateSkillURL,
    getDatetimeFromRoyals,
    pickNumber,
    decideMobStrings,
    splitLongMobStringIntoArray,
    decideDropStrings,
    splitLongDropStringIntoArray,

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

  # drop
  /drop equip xxxx      : show which mobs drop the equip
  /drop item xxxx       : show which mobs drop the item
  /drop mob xxxx        : show drops of a mob 

  # guide
  /guide apq            : link to apq guide
  /guide apqbon         : show apq bonus map
  /guide cwk            : link to cwkpq guide
  /guide cwkbon         : show cwkpq bonus map
  /guide gpq            : link to gpq guide
  /guide gpqbon         : show gpq bonus map
  /guide opq            : link to opq guide
  /guide lpq            : link to lpq guide
  /guide mage1hit       : show mage1hit table
  /guide reuel          : link to Reuel hp quest
  /guide leech          : show leech picture
  /guide price          : link to Sylafia price guide
  /guide jobadvance     : link to job advance guide
  /guide hpwashinfo     : show hp wash info table
  
  # troll
  /troll pavoweme       : show how much pav owes me
  /troll pavoweeveryone : show how much pav owes everyone
  /troll pavfeels       : show pav feeling today
`
const allowedMainCommand = new Set(['bot', 'drop', 'guide', 'troll'])

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

    const mainCommand = body.data.name
    if (!allowedMainCommand.has(mainCommand)) {
        return {
            statusCode: 400,
            body: 'Invalid command, start with /bot or /guide or /troll',
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
    let command = `/${mainCommand} ${subCommand}`
    console.log(command)

    let options = body.data.options?.[0]

    // --------------------- /bot help  ---------------------
    if (command === '/bot help') {
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
    if (command === "/bot equip") {
        options = options?.options?.[0]
        const query = options.value
        return getEquipQueryResponse(query)
    }
    // --------------------- /bot item xxxx  ---------------------
    if (command === '/bot item') {
        options = options?.options?.[0]
        const query = options.value
        return getItemQueryResponse(query)
    }
    // --------------------- /bot monster xxxx  ---------------------
    if (command === '/bot monster') {
        options = options?.options?.[0]
        const query = options.value
        return getMonsterQueryResponse(query)
    }
    // --------------------- /bot skill xxxx  ---------------------
    if (command === '/bot skill') {
        options = options?.options?.[0]
        const query = options.value
        return getSkillQueryResponse(query)
    }
    // --------------------- /bot music xxxx  ---------------------
    if (command === '/bot music') {
        options = options?.options?.[0]
        const query = options.value
        return getMusicQueryResponse(query)
    }
    // --------------------- /bot servertime  ---------------------
    if (command === '/bot servertime') {
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
    if (command === '/bot roll') {
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
    if (command === '/bot flipcoin') {
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
    if (command === '/bot author') {
        let response = myOneLinerLinkResponse('ScottY5C', 'https://royals-library.netlify.app/about-me')
        return response
    }
    // ######## DROP ########
    if (command === '/drop equip') {
        options = options?.options?.[0]
        const query = options.value
        return getEquipDroppedByResponse(query)
    }
    if (command === '/drop item') {
        options = options?.options?.[0]
        const query = options.value
        return getItemDroppedByResponse(query)
    }
    if (command === '/drop mob') {
        options = options?.options?.[0]
        const query = options.value
        return getMobDropResponse(query)
    }
    // ######## GUIDE ########
    // --------------------- /guide apq  ---------------------
    if (command === '/guide apq') {
        let response = myOneLinerLinkResponse('APQ Guide', 'https://royals.ms/forum/threads/comprehensive-apq-guide-updated-feb-2021.172942/')
        return response
    }
    // --------------------- /guide apqbon  ---------------------
    if (command === '/guide apqbon') {
        let response = myOneLinerImageResponse('APQ Bonus Map', 'https://royals.ms/forum/attachments/3z07lbj-png.189083/')
        return response
    }
    // --------------------- /guide cwkguide  ---------------------
    if (command === '/guide cwk') {
        let response = myOneLinerLinkResponse('CWKPQ Guide', 'https://royals.ms/forum/threads/crimsonwood-party-quest-prequisite-guide-2020-cwpq.153541/')
        return response
    }
    // --------------------- /guide cwkbon  ---------------------
    if (command === '/guide cwkbon') {
        let response = myOneLinerImageResponse('CWKPQ Bonus Map', 'https://i.imgur.com/KED684z.png')
        return response
    }
    // --------------------- /guide gpqguide  ---------------------
    if (command === '/guide gpq') {
        let response = myOneLinerLinkResponse('GPQ Guide', 'https://royals.ms/forum/threads/%E2%9C%AF-hollywood-presents-a-comprehensive-guide-to-guild-party-quest-gpq.27299/')
        return response
    }
    // --------------------- /guide gpqbon  ---------------------
    if (command === '/guide gpqbon') {
        let response = myOneLinerImageResponse('GPQ Bonus Map', 'https://i.imgur.com/EcaEybL.png/')
        return response
    }
    // --------------------- /guide opqguide  ---------------------
    if (command === '/guide opq') {
        let response = myOneLinerLinkResponse('OPQ Guide', 'https://royals.ms/forum/threads/orbis-pq-guide.174277/')
        return response
    }
    // --------------------- /guide lpqguide  ---------------------
    if (command === '/guide lpq') {
        let response = myOneLinerLinkResponse('LPQ Guide', 'https://royals.ms/forum/threads/ludibrium-party-quest-lpq-guide.108791/')
        return response
    }
    // --------------------- /guide mage1hit  ---------------------
    if (command === '/guide mage1hit') {
        let response = myOneLinerImageResponse('Mage 1 hit', 'https://i.gyazo.com/0f145192abae7abc4bd3e14073e7c9e1.png/')
        return response
    }
    // --------------------- /guide reuel  ---------------------
    if (command === '/guide reuel') {
        let response = myOneLinerLinkResponse('Reuel HP Quest', 'https://royals.ms/forum/threads/comprehensive-search-for-the-elixir-of-life-reuel-hp-quest-guide-lv120.178648/')
        return response
    }
    // --------------------- /guide leech  ---------------------
    if (command === '/guide leech') {
        let response = myOneLinerImageResponse('Leech', 'https://i.imgur.com/MNEDFOd_d.webp?maxwidth=1520&fidelity=grand')
        return response
    }
    // --------------------- /guide priceguide  ---------------------
    if (command === '/guide price') {
        let response = myOneLinerLinkResponse('Sylafia price guide', 'https://docs.google.com/spreadsheets/d/1B3sxmpaW7RGrQAAxAyeR-xS4mdKCTTs_DzgV0qo2p_8/edit?gid=0#gid=0/')
        return response
    }
    // --------------------- /guide jobadvance  ---------------------
    if (command === '/guide jobadvance') {
        let response = myOneLinerLinkResponse('Job Advancement', 'https://royals.ms/forum/threads/new-source-job-advancement-guide.110142/')
        return response
    }
    // --------------------- /guide hpwashinfo  ---------------------
    if (command === '/guide hpwashinfo') {
        let response = myOneLinerImageResponse('Hp Wash Info', 'https://i.imgur.com/pckfDK8.jpeg')
        return response
    }
    // ######## TROLL ######## 
    // --------------------- /bot pavoweme  ---------------------
    if (command === '/troll pavoweme' || command === '/troll pavoweeveryone') {
        let min = 0
        let max = 100000000
        let toWho = command === 'pavoweme' ? 'me' : 'everyone'
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
    if (command === '/troll pavfeels') {
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

    const commandString = `📋 Copy this and paste into chat: \n/play ${bgmURL}`
    const recommendedMusicBot = `[FlaviBot](https://discord.com/oauth2/authorize?client_id=684773505157431347&permissions=36701184&scope=bot+applications.commands
)`      // modified by chatgpt about the access grant request

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
                            { name: 'Music Bot', value: recommendedMusicBot, inline: true },
                            { name: 'trigger Music Bot', value: commandString, inline: true },
                        )
                ]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const getEquipDroppedByResponse = async (query) => {
    console.log(query)

    // 1. fetch the query to get the 1st Equip that matches
    let data = await fetch(`${API_URL}/equip?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    // 2. fetch the detail
    let equipInfo = await fetch(`${API_URL}/equip?id=${data.id}`)
    equipInfo = await equipInfo.json()

    // ready to output
    const name = data?.name || 'undefined'
    const equipURL = generateEquipURL(data)
    const mobs = equipInfo.droppedBy || []

    console.log(name, mobs) // equip names, and array of mobs

    let mobStrings = decideMobStrings(mobs)

    if (!mobStrings.length) mobStrings = ['Nothing dropped it']

    const embeddedObj = {
        color: 0x0099ff,
        title: name,
        url: equipURL,
        thumbnail: {
            url: data.imgURL,
        },
        fields: splitLongMobStringIntoArray(mobStrings)
    };


    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [embeddedObj]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const getItemDroppedByResponse = async (query) => {
    console.log(query)

    // 1. fetch the query to get the 1st Item that matches
    let data = await fetch(`${API_URL}/item?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    // 2. fetch the detail
    let itemInfo = await fetch(`${API_URL}/item?id=${data.id}`)
    itemInfo = await itemInfo.json()

    // ready to output
    const name = data?.name || 'undefined'
    const itemURL = generateItemURL(data)
    const mobs = itemInfo?.droppedBy || []

    console.log(name, mobs) // item names, and array of mobs

    let mobStrings = decideMobStrings(mobs)

    if (!mobStrings.length) mobStrings = ['Nothing dropped it']

    const embeddedObj = {
        color: 0x0099ff,
        title: name,
        url: itemURL,
        thumbnail: {
            url: data.imgURL,
        },
        fields: splitLongMobStringIntoArray(mobStrings)
    };

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [embeddedObj]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

const getMobDropResponse = async (query) => {
    console.log(query)

    // 1. fetch the query to get the 1st Item that matches
    let data = await fetch(`${API_URL}/monster?search=${query}`)
    data = await data.json()
    data = data.data?.[0]       // get the first of returned array
    console.log(data)

    if (!data) return NotFound()

    // 2. fetch the detail
    let mobInfo = await fetch(`${API_URL}/monster?id=${data.id}`)
    mobInfo = await mobInfo.json()

    // ready to output
    const name = data?.name || 'undefined'
    const monsterURL = generateMonsterURL(data)
    const drops = mobInfo.drops

    console.log(name, drops) // item names, and array of mobs

    let dropStrings = decideDropStrings(drops)
    // console.log(dropStrings)

    const embeddedObj = {
        color: 0x0099ff,
        title: name,
        url: monsterURL,
        thumbnail: {
            url: data.imgURL,
        },
        fields: splitLongDropStringIntoArray(dropStrings)
    };

    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [embeddedObj]
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

