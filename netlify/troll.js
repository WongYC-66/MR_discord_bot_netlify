import commaNumber from "comma-number"
import {
    addFieldsToEmbed,
    API_URL,
    fetchURLAndReturnArr,
    generateCodeBlockAndEmbedResponse,
    generateCodeBlockResponse,
    generateMonsterURL,
    generatePlainTextResponse,
    getFeeling,
    makeEmbed,
    NotFound,
    pickNumber
} from "./utility"

export const getTrollPavOweMeEveryoneResponse = (command, triggeredUser) => {
    let min = 0
    let max = 100000000
    let toWho = command === '/troll pavoweme' ? 'you' : 'everyone'
    let content = `\`\`\`
Pav owes ${toWho} ${commaNumber(pickNumber(min, max))}! A Random number from 0-100m. PS: this a troll
\`\`\`${command === '/troll pavoweme' ? `<@${triggeredUser?.id}>` : ''}`
    return generatePlainTextResponse(content)
}

export const getTrollPavFeelResponse = () => {
    const feeling = getFeeling()
    const content = `Pav feels **${feeling}** today! Doesn't he ?`
    return generateCodeBlockResponse(content)
}

export const getTrollSackPavResponse = async () => {
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
    const content = `SACKING WARNING : You spawned a **${name}** onto Pav's face ! Pav feels **${feeling}** now.`

    const Embed = makeEmbed({ name, url, thumbnailURL })
    addFieldsToEmbed(
        [
            { name: 'Level', value: level, inline: true },
            { name: 'EXP', value: exp, inline: true },
            { name: 'HP', value: Hp, inline: true },
        ],
        Embed,
    )
    return generateCodeBlockAndEmbedResponse(content, Embed)
}

export const getTrollPatResponse = (triggeredUser, targetUser) => {
    console.log(triggeredUser, targetUser)
    const feeling = getFeeling()
    let content = `<@${triggeredUser?.id}> pats <@${targetUser}>'s head ! <@${targetUser}> feels ${feeling} now !`
    return generatePlainTextResponse(content)
}

