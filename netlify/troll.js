
import commaNumber from "comma-number"
import {
    addFieldsToEmbed,
    API_URL,
    fetchURLAndReturnArr,
    generatedImageResponse,
    generateMonsterURL,
    generatePlainTextAndEmbedResponse,
    generatePlainTextResponse,
    getFeeling,
    makeEmbed,
    NotFound,
    pickNumber,
} from "./utility"

export const getTrollOweResponse = (command, triggeredUser, targetUser) => {
    let min = 0
    let max = 100000000
    let toWho = command === '/troll owe' ? 'you' : 'everyone'
    let mention = command === '/troll owe' ? `(<@${triggeredUser.id}>)` : ''

    let content = `<@${targetUser}> owed ${toWho}${mention} \`\`\` He/She owes ${toWho} ${commaNumber(pickNumber(min, max))}! A Random number from 0-100m. PS: this a troll
\`\`\``
    return generatePlainTextResponse(content)
}

export const getTrollFeelsResponse = (targetUser) => {
    const feeling = getFeeling()
    const content = `<@${targetUser}> \`\`\`feels **${feeling}** today! Doesn't he ?\`\`\``
    return generatePlainTextResponse(content)
}

export const getTrollSackResponse = async (triggeredUser, targetUser) => {
    const fetchTasks = Array(8).fill().map((_, i) => fetchURLAndReturnArr(`${API_URL}/monster?filter=boss&page=${i + 1}`))
    let data = await Promise.all(fetchTasks)
    data = data.flat()
    if (!data.length) return NotFound()

    const bosses = data.filter(boss => boss.imgURL && boss.drops)  // legit boss = the one with drops and with image?
    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)]

    const name = randomBoss?.name || 'undefined'
    const level = randomBoss?.level || '0'
    const exp = randomBoss?.exp?.toString() || '0'
    const Hp = randomBoss?.maxHP || '0'
    const thumbnailURL = randomBoss?.imgURL || 'undefined'
    const url = generateMonsterURL(randomBoss)

    const feeling = getFeeling()
    const content = `SACKING WARNING : <@${triggeredUser.id}> spawned a **${name}** onto <@${targetUser}>'s face ! <@${targetUser}> feels **${feeling}** now.`

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Level', value: level, inline: true },
            { name: 'EXP', value: exp, inline: true },
            { name: 'HP', value: Hp, inline: true },
        ],
        Embed,
    )
    return generatePlainTextAndEmbedResponse(content, Embed)
}

export const getTrollPatResponse = async (triggeredUser, targetUser, event) => {

    // pat online image
    const background = {
        scale: 1.0,
        url: 'https://media.tenor.com/6fa6sool-Y4AAAAi/love-pat.gif',
    }

    const caller = {
        id: triggeredUser.id,
        x: 0,         // x = x-position in final image
        y: 0,          // y = y-position in final image
        scale: 0.35
    }

    const target = {
        id: targetUser,
        x: 75,          // x = x-position in final image
        y: 120,         // y = y-position in final image
        scale: 0.35
    }

    const params = {
        caller,
        target,
        background,
        event,
        wording: 'pat',
    }

    return generatedImageResponse(params)
}

export const getSlapPunchResponse = async (triggeredUser, targetUser, event) => {

    // punch online image
    const background = {
        scale: 1.0,
        url: 'https://media.tenor.com/Hfvbf7U6_VMAAAAi/peach-cat.gif',
    }

    const caller = {
        id: triggeredUser.id,
        x: 150,
        y: 100,
        scale: 0.35
    }

    const target = {
        id: targetUser,
        x: 50,
        y: 215,
        scale: 0.35
    }

    const params = {
        caller,
        target,
        background,
        event,
        wording: 'slap',
    }

    return generatedImageResponse(params)
}

