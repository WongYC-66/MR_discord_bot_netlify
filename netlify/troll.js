import fs from 'fs/promises'
import path from 'path';

import commaNumber from "comma-number"
import {
    addFieldsToEmbed,
    API_URL,
    deferDiscordInteraction,
    fetchDiscordUserAvatar,
    fetchURLAndReturnArr,
    generateCodeBlockAndEmbedResponse,
    generateCodeBlockResponse,
    generateEmbedAndAttachmentResponse,
    generateMonsterURL,
    generatePlainTextResponse,
    getFeeling,
    makeEmbed,
    NotFound,
    overlayAvatarsToBaseImage,
    pickNumber,
    saveImageBuffer,
    sendDiscordImageWebhook
} from "./utility"
import { AttachmentBuilder } from 'discord.js';

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

export const getTrollPatResponse = async (triggeredUser, targetUser, event) => {
    const isLocalTestServer = event.headers.host.includes('localhost')
    console.log(triggeredUser, targetUser, { isLocalTestServer })
    const interaction = event.body

    const baseImageUrl = 'https://media1.tenor.com/m/Wc_Sv1zFlmQAAAAC/nix-voltare-fsp-nix-voltare-fsp-en.gif';      // Pat Image URL

    const [avatarUrl1, avatarUrl2] = await Promise.all([
        fetchDiscordUserAvatar(triggeredUser.id),
        fetchDiscordUserAvatar(targetUser),
    ])

    // Step 1: Defer interaction
    if (!isLocalTestServer) await deferDiscordInteraction(interaction)

    const fileName = `combined_${triggeredUser.id}_${targetUser}.png`

    const position1 = { x: 90, y: 290 }; // pos of avatar1, only trial and error to find out
    const position2 = { x: 310, y: 65 };  // pos of avatar2
    const imageBuffer = await overlayAvatarsToBaseImage(avatarUrl1, avatarUrl2, baseImageUrl, position1, position2)

    // Step 2 : Send image
    if (isLocalTestServer) {
        // dev mode, save to local folder, netlify dev would cleanup
        const outputPath = path.join(__dirname, '/output', fileName);
        saveImageBuffer(imageBuffer, outputPath)
    } else {
        const Embed = makeEmbed({
            name: `<@${triggeredUser.id}> pats <@${targetUser}>!`
        })
        Embed.image = { url: `attachment://${fileName}` }
        await sendDiscordImageWebhook(imageBuffer, fileName, Embed, interaction.application_id, interaction.token);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
}