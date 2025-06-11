import { runSelfTests } from './discord.test.js'
import {
    addFieldsToEmbed,
    API_URL,
    fetchURLAndReturnFirst,
    generateCodeBlockResponse,
    generateEmbedResponse,
    generateEquipURL,
    generateItemURL,
    generateMonsterURL,
    generateSkillURL,
    getDatetimeFromRoyals,
    makeEmbed,
    NotFound,
    pickNumber,
    toMinute
} from './utility.js'



import commaNumber from 'comma-number'

export const getBotHelpResponse = (helpString) => {
    return generateCodeBlockResponse(helpString)
}

export const getEquipQueryResponse = async (query) => {
    console.log(query)
    let data = await fetchURLAndReturnFirst(`${API_URL}/equip?search=${query}`)
    if (!data) return NotFound()

    const name = data?.name || 'undefined'
    const level = data?.reqLevel || '0'
    const category = data.category?.[2] || 'undefined'
    const upgradeSlot = data?.tuc || '0'
    const thumbnailURL = data?.imgURL || 'undefined'
    const url = generateEquipURL(data)

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Level', value: level, inline: true },
            { name: 'Category', value: category, inline: true },
            { name: 'Upgrade', value: upgradeSlot, inline: true },
        ],
        Embed,
    )
    return generateEmbedResponse(Embed)
}

export const getMonsterQueryResponse = async (query) => {
    console.log(query)
    let data = await fetchURLAndReturnFirst(`${API_URL}/monster?search=${query}`)
    if (!data) return NotFound()

    const name = data?.name || 'undefined'
    const level = data?.level || '0'
    const exp = data?.exp?.toString() || '0'
    const Hp = data?.maxHP || '0'
    const thumbnailURL = data?.imgURL || 'undefined'
    const url = generateMonsterURL(data)

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Level', value: level, inline: true },
            { name: 'EXP', value: exp, inline: true },
            { name: 'HP', value: Hp, inline: true },
        ],
        Embed,
    )
    return generateEmbedResponse(Embed)
}


export const getItemQueryResponse = async (query) => {
    console.log(query)
    let data = await fetchURLAndReturnFirst(`${API_URL}/item?search=${query}`)
    if (!data) return NotFound()

    const name = data?.name || 'no name'
    const desc = data?.desc?.replaceAll("\\n", " ") || 'no description'
    const thumbnailURL = data?.imgURL || 'undefined'
    const url = generateItemURL(data)

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Name', value: name, inline: true },
            { name: 'Description', value: desc, inline: true },
        ],
        Embed,
    )
    return generateEmbedResponse(Embed)
}

export const getSkillQueryResponse = async (query) => {
    console.log(query)
    let data = await fetchURLAndReturnFirst(`${API_URL}/skill?search=${query}`)
    if (!data) return NotFound()

    const name = data?.name || 'no name'
    const desc = data?.desc?.replaceAll("\\n", " ") || 'no description'
    const url = generateSkillURL(data)
    const thumbnailURL = data?.imgURL || 'undefined'
    const job = data?.job

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Name', value: name, inline: true },
            { name: 'Description', value: desc, inline: true },
            { name: 'Job', value: job, inline: true },
        ],
        Embed,
    )
    return generateEmbedResponse(Embed)
}

export const getMusicQueryResponse = async (query) => {
    console.log(query)
    let data = await fetchURLAndReturnFirst(`${API_URL}/music?search=${query}`)
    if (!data) return NotFound()

    const name = data?.name || 'no name'
    const length = toMinute(data.length)
    const bgm = data?.bgm || 'undefined'
    const url = data?.bgmURL || 'undefined'

    const commandString = `📋 Copy this and paste into chat: \n/play ${url}`

    // const recommendedMusicBot = `[FlaviBot](https://discord.com/oauth2/authorize?client_id=684773505157431347&permissions=36701184&scope=bot+applications.commands)`      
    const recommendedMusicBot = `[CakeyBot](https://discord.com/oauth2/authorize?client_id=288163958022471680&permissions=3147776&redirect_uri=https://cakey.bot/success_invite.html&response_type=code&scope=bot+applications.commands)`
    // modified by chatgpt about the access grant request

    const Embed = makeEmbed({ name, url })
    addFieldsToEmbed(
        [
            { name: 'Name', value: bgm, inline: true },
            { name: 'Length', value: length, inline: true },
            { name: 'Music Bot', value: recommendedMusicBot, inline: true },
            { name: 'trigger Music Bot', value: commandString, inline: true },
        ],
        Embed,
    )
    return generateEmbedResponse(Embed)
}

export const getServertimeResponse = async () => {
    const GMT0DateTime = await getDatetimeFromRoyals()
    const content = `mapleroyals servertime : ${GMT0DateTime}`
    return generateCodeBlockResponse(content)
}

export const getRollResponse = (minInput, maxInput) => {
    let min = Number(minInput)
    let max = Number(maxInput)
    let content = null

    const notInRange = (n) => !(-1e10 <= n && n <= 1e10)

    if (isNaN(min) || isNaN(max) || notInRange(min) || notInRange(max)) {
        content = 'Please Enter Valid Number between -10b, 10b'
    } else {
        content = `Between ${commaNumber(min)} to ${commaNumber(max)}, you rolled a ${commaNumber(pickNumber(min, max))}!`
    }
    return generateCodeBlockResponse(content)
}

export const getCoinFlipResponse = () => {
    const choices = ['Head', 'Tail']
    const randIdx = Math.floor(Math.random() * (choices.length))
    const result = choices[randIdx]
    const content = (`You flipped a ${result}!`)
    return generateCodeBlockResponse(content)
}

export const getSelfTestResponse = async () => {
    const content = await runSelfTests()
    return generateCodeBlockResponse(content)
}