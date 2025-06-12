import path from 'path';

import commaNumber from "comma-number"
import { AttachmentBuilder } from 'discord.js';

import {
    addFieldsToEmbed,
    API_URL,
    // fetchDiscordAvatarURL,
    fetchURLAndReturnArr,
    generateCodeBlockAndEmbedResponse,
    generateCodeBlockResponse,
    generateEmbedAndAttachmentResponse,
    generateMonsterURL,
    generatePlainTextResponse,
    getFeeling,
    makeEmbed,
    NotFound,
    // overlayAvatarsToBaseImage,
    pickNumber,
    // saveImageBuffer
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

export const getTrollPatResponse = async (triggeredUser, targetUserId, event) => {
    return NotFound()
    console.log(triggeredUser, targetUserId)
    console.log(event.headers.host)
    console.log(typeof event.headers.host)
    const isLocalTestServer = event.headers.host.includes('localhost')

    // const feeling = getFeeling()
    // let content = `<@${triggeredUser?.id}> pats <@${targetUser}>'s head ! <@${targetUser}> feels ${feeling} now !`
    
    // let avatarUrl1 = fetchDiscordAvatarURL(triggeredUser.id)
    // let avatarUrl2 = fetchDiscordAvatarURL(targetUserId)
    const baseImageUrl = 'https://media1.tenor.com/m/Wc_Sv1zFlmQAAAAC/nix-voltare-fsp-nix-voltare-fsp-en.gif';      // Pat Image URL

    if (isLocalTestServer) {
        var avatarUrl1 = 'https://cdn.discordapp.com/avatars/474557435219279873/3f235eb0c6279115704c8edfe617c04a.png?size=128';
        var avatarUrl2 = 'https://cdn.discordapp.com/avatars/154242342180618240/5dd10d847d569ade65c29c31ac0bb52b.png?size=128';
    }

    // const __dirname = dirname(import.meta.filename);
    console.log({ __dirname })
    const outputPath = path.join(__dirname, 'output', `combined_${avatarUrl1}_${avatarUrl2}.png`);

    const position1 = { x: 100, y: 280 }; // pos of avatar1
    const position2 = { x: 310, y: 60 };  // pos of avatar2

    const combinedBuffer = await overlayAvatarsToBaseImage(avatarUrl1, avatarUrl2, baseImageUrl, outputPath, position1, position2)
    saveImageBuffer(combinedBuffer)

    const Embed = makeEmbed({})
    const Attachment = new AttachmentBuilder(outputPath);

    return generateEmbedAndAttachmentResponse(Embed, Attachment)
}

