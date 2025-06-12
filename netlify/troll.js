
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
    const page = pickNumber(1, 8)    // boss monster has 8 pages
    let data = await fetchURLAndReturnArr(`${API_URL}/monster?filter=boss&page=${page}`)
    if (!data) return NotFound()

    const bosses = data.filter(boss => boss.hpRecovery >= 2)  // the boss with hpRecovery property seems to be legit boss
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
        url: 'https://media1.tenor.com/m/Wc_Sv1zFlmQAAAAC/nix-voltare-fsp-nix-voltare-fsp-en.gif',
    }

    const caller = {
        id: triggeredUser.id,
        x: 310,         // x = x-position in final image
        y: 65,          // y = y-position in final image
        scale: 1.0
    }

    const target = {
        id: targetUser,
        x: 90,          // x = x-position in final image
        y: 290,         // y = y-position in final image
        scale: 1.0
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
        scale: 0.6,
        url: 'https://i.imgflip.com/9x592f.jpg',
    }

    const caller = {
        id: triggeredUser.id,
        x: 225,
        y: 115,
        scale: 0.4
    }

    const target = {
        id: targetUser,
        x: 135,
        y: 80,
        scale: 0.4
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

