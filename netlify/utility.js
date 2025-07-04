import util from 'util'
import fs from 'fs';
import path from 'path';

import * as cheerio from 'cheerio';
import { codeBlock } from 'discord.js';
import { Jimp } from 'jimp';
import { GifUtil, GifFrame, GifCodec } from 'gifwrap';

export const LIBRARY_URL = 'https://royals-library.netlify.app';
export const API_URL = 'https://royals-library.netlify.app/api/v1';

const urlPathToCategoryName = {
    "/weapon": "weapon",
    "/hat": "Hat",
    "/top": "Top",
    "/bottom": "Bottom",
    "/overall": "Overall",
    "/shoes": "Shoes",
    "/gloves": "Glove",
    "/cape": "Cape",
    "/shield": "Shield",
    "/faceacc": "Face Accessory",
    "/eyeacc": "Eye Decoration",
    "/earring": "Earrings",
    "/ring": "Ring",
    "/pendant": "Pendant",
    "/belt": "Belt",
    "/medal": "Medal",
    "/shoulder": "Shoulder Accessory",
}

const catogeryRangeList = {
    // info used from https://maplestory.io/api/GMS/64/item/category
    // also, https://maplestory.io/api/GMS/196/item/category
    "Gun": { min: 1490000, max: 1500000, category: "Two-Handed Weapon" },
    "Knuckle": { min: 1480000, max: 1490000, category: "Two-Handed Weapon" },
    "Claw": { min: 1470000, max: 1480000, category: "Two-Handed Weapon" },
    "Dagger": { min: 1330000, max: 1340000, category: "One-Handed Weapon" },
    "Bow": { min: 1450000, max: 1460000, category: "Two-Handed Weapon" },
    "CrossBow": { min: 1460000, max: 1470000, category: "Two-Handed Weapon" },
    "Staff": { min: 1380000, max: 1390000, category: "One-Handed Weapon" },
    "Wand": { min: 1370000, max: 1380000, category: "One-Handed Weapon" },
    "One-Handed Sword": { min: 1300000, max: 1310000, category: "One-Handed Weapon" },
    "Two-Handed Sword": { min: 1400000, max: 1410000, category: "Two-Handed Weapon" },
    "One-Handed Blunt Weapon": { min: 1320000, max: 1330000, category: "One-Handed Weapon" },
    "Two-Handed Blunt Weapon": { min: 1420000, max: 1430000, category: "Two-Handed Weapon" },
    "One-Handed Axe": { min: 1310000, max: 1320000, category: "One-Handed Weapon" },
    "Two-Handed Axe": { min: 1410000, max: 1420000, category: "Two-Handed Weapon" },
    "Spear": { min: 1430000, max: 1440000, category: "Two-Handed Weapon" },
    "Pole Arm": { min: 1440000, max: 1450000, category: "Two-Handed Weapon" },

    "Cash": { min: 1701000, max: 1704000, category: "One-Handed Weapon" },

    "Hat": { min: 1000000, max: 1009999, category: "Armor" },
    "Face Accessory": { min: 1010000, max: 1019999, category: "Accessory" },
    "Eye Decoration": { min: 1020000, max: 1029999, category: "Accessory" },
    "Glove": { min: 1080000, max: 1089999, category: "Armor" },
    "Pendant": { min: 1120000, max: 1129999, category: "Accessory" },
    "Belt": { min: 1130000, max: 1139999, category: "Accessory" },
    "Medal": { min: 1140000, max: 1149999, category: "Accessory" },
    "Cape": { min: 1100000, max: 1109999, category: "Armor" },
    "Earrings": { min: 1030000, max: 1039999, category: "Accessory" },
    "Ring": { min: 1110000, max: 1119999, category: "Accessory" },
    "Shield": { min: 1090000, max: 1099999, category: "Armor" },
    "Overall": { min: 1050000, max: 1059999, category: "Armor" },
    "Top": { min: 1040000, max: 1049999, category: "Armor" },
    "Bottom": { min: 1060000, max: 1069999, category: "Armor" },
    "Shoes": { min: 1070000, max: 1079999, category: "Armor" },
    "Test Armor": { min: 1690100, max: 1690200, category: "Armor" },

    "Badge": { min: 1180000, max: 1189999, category: "Accessory" },
    "Emblem": { min: 1190000, max: 1190500, category: "Accessory" },
    "Pocket Item": { min: 1160000, max: 1169999, category: "Accessory" },
    "Power Source": { min: 1190200, max: 1190300, category: "Accessory" },
    "Shoulder Accessory": { min: 1150000, max: 1159999, category: "Accessory" },
    "Totem": { min: 1202000, max: 1202200, category: "Accessory" },
}

const toCategoryURL = (subCategory) => {
    for (let urlPath in urlPathToCategoryName) {
        if (urlPathToCategoryName[urlPath] === subCategory) {
            return urlPath.slice(1,)
        }
    }
    return 'undefined'
}

const normalizedID = (type, id) => {
    // console.log({ type, id })
    switch (type) {
        case 'maps':
            return String(id).padStart(9, '0')
        case 'characters':
        case 'items':
            return String(id).padStart(8, '0')
        case 'monsters':
        case 'skills':
        case 'npcs':
            return String(id).padStart(7, '0')
        default:
            return id
    }
}

export const print = (obj) => {
    console.log(util.inspect(obj, { showHidden: false, depth: null, colors: true }))
}

export const generateThumbnailUrl = (type, id) => {
    id = normalizedID(type, id)
    return `${LIBRARY_URL}/images/${type}/${id}.png`
}

export const toMinute = (audioLength) => {
    if (!audioLength) return 'undefined'
    const sec = Number(audioLength)
    const min = Math.floor(sec / 60).toString().padStart(2, '0')
    const remainSec = (sec % 60).toFixed().padStart(2, '0')
    return `${min}:${remainSec}`
}

export const generateEquipURL = (data) => {
    const isWeapon = data.category[1].toLowerCase().includes('weapon')
    if (isWeapon) {
        return `${LIBRARY_URL}/weapon/id=${data.id}`
    } else {
        let itemCategory = data.category[2].toLowerCase()
        let category = 'undefined'
        for (let urlPath in urlPathToCategoryName) {
            if (urlPathToCategoryName[urlPath].toLowerCase() === itemCategory) {
                category = urlPath.slice(1,)    // remove '/.
                break
            }
        }
        return `${LIBRARY_URL}/${category}/id=${data.id}`
    }
}

const generateEquipURLWithOnlyId = (id) => {
    let foundSubCategory = 'undefined'
    let foundCategory = 'undefined'
    for (let subCategory in catogeryRangeList) {
        let { min, max, category } = catogeryRangeList[subCategory]
        if (min <= id && id <= max) {
            foundSubCategory = subCategory
            foundCategory = category
            break
        }
    }
    const isWeapon = foundCategory.toLowerCase().includes('weapon')
    const categoryURL = toCategoryURL(foundSubCategory)

    let returnURL = isWeapon
        ? `${LIBRARY_URL}/weapon/id=${id}`
        : `${LIBRARY_URL}/${categoryURL}/id=${id}`

    return returnURL
}

export const generateMonsterURL = (data) => {
    return `${LIBRARY_URL}/monster/id=${data.id}`
}

export const generateItemURL = (data) => {
    let itemCategory = 'undefined'
    let itemId = Number(data.id)
    const categoryToItemRanges = {
        'use': { min: 2000000, max: 2999999 },
        'setup': { min: 3000000, max: 3999999 },
        'etc': { min: 4000000, max: 4999999 },
    }

    for (let category in categoryToItemRanges) {
        let { min, max } = categoryToItemRanges[category]
        if (min <= itemId && itemId <= max) itemCategory = category
    }
    return `${LIBRARY_URL}/${itemCategory}/id=${data.id}`
}

export const generateSkillURL = (data) => {
    return `${LIBRARY_URL}/skill/id=${data.id}`
}

export async function getDatetimeFromRoyals() {
    const url = 'https://www.timeanddate.com/worldclock/timezone/utc';

    const res = await fetch(url);
    const html = await res.text();

    const $ = cheerio.load(html);

    // The time is inside <span id="ct">, e.g. <span id="ct" class="h1">16:40:03</span>
    const time = $('#ct').text().trim();

    // The date is inside <div id="ctdat">, e.g. <div id="ctdat">Monday, 9 June 2025</div>
    const date = $('#ctdat').text().trim()
    const slicedDate = date.split(' ').slice(1,).join(' ')

    // console.log(`UTC Time: ${time}`);
    // console.log(`UTC Date: ${date}`);

    return `${time} ${slicedDate}`
}

export const pickNumber = (minInput, maxInput) => {
    const min = Math.min(minInput, maxInput)
    const max = Math.max(minInput, maxInput)
    const size = max - min + 1
    const rand = Math.floor(Math.random() * size)
    return min + rand
}

export const decideMobStrings = (mobs) => {
    let mobStringsWithURL = formatToArrOfMobNameWithURL(mobs)
    let mobStringsWithoutURL = formatToArrOfName(mobs)
    let lenWithURL = mobStringsWithURL.join('\n').length
    console.log({ lenWithURL })
    return lenWithURL < 4500 ? mobStringsWithURL : mobStringsWithoutURL
}

const formatToArrOfMobNameWithURL = (arrayOfElWithIdAndName) => {
    return arrayOfElWithIdAndName.map(({ id, name }) => {
        const mobURL = generateMonsterURL({ id })
        return `[${name}](${mobURL})`
    })
}

const formatToArrOfItemNameWithURL = (arrayOfElWithIdAndName) => {
    return arrayOfElWithIdAndName.map(({ id, name }) => {
        const isEquip = Number(id) < 2000000
        const itemURL = isEquip ? generateEquipURLWithOnlyId(id) : generateItemURL({ id })
        return `[${name}](${itemURL})`
    })
}

const formatToArrOfName = (arrayOfElWithIdAndName) => {
    return arrayOfElWithIdAndName.map(({ name }) => name)
}

export const splitLongMobStringIntoArray = (strArr) => {
    const MAX_FIELDS = 6;
    const MAX_FIELD_CHARS = 1024;

    // Calculate total characters (including '\n' after each line)
    const totalLength = strArr.reduce((acc, str) => acc + str.length + 1, 0);
    const idealFields = Math.min(MAX_FIELDS, strArr.length);
    const idealChunkSize = Math.ceil(totalLength / idealFields);

    const result = [];
    let current = [];
    let currentLen = 0;
    let fieldCount = 1;

    for (let i = 0; i < strArr.length; i++) {
        const str = strArr[i];
        const strLen = str.length + 1; // +1 for newline

        // Start new field if we exceed ideal chunk size or hard limit
        if ((currentLen + strLen > idealChunkSize && result.length < MAX_FIELDS - 1) || currentLen + strLen > MAX_FIELD_CHARS) {
            result.push({
                name: `Dropped By (${fieldCount})`,
                value: current.join('\n'),
                inline: true,
            });
            fieldCount++;
            current = [str];
            currentLen = strLen;
        } else {
            current.push(str);
            currentLen += strLen;
        }
    }

    if (current.length) {
        result.push({
            name: `Dropped By (${fieldCount})`,
            value: current.join('\n'),
            inline: true,
        });
    }
    return result;
};

export const decideDropStrings = (drops) => {
    const dropStringsWithURL = processDropsWithURL(drops)
    const dropStringsWithoutURL = processDropsWithoutURL(drops)
    const lenWithURL = Object.values(dropStringsWithURL).flat().join('\n').length
    console.log({ lenWithURL })
    return lenWithURL < 4500 ? dropStringsWithURL : dropStringsWithoutURL
}

const processDropsWithURL = (drops) => {
    let returnObj = {}
    for (let key in drops) {
        returnObj[key] = formatToArrOfItemNameWithURL(drops[key])
    }
    return returnObj
}

const processDropsWithoutURL = (drops) => {
    let returnObj = {}
    for (let key in drops) {
        returnObj[key] = formatToArrOfName(drops[key])
    }
    return returnObj
}

export const splitLongDropStringIntoArray = (drops) => {
    const MAX_FIELD_CHARS = 1024;
    let result = []
    for (let dropCategory in drops) {
        let dropArr = drops[dropCategory]
        if (!dropArr.length) dropArr = ['none']
        dropCategory = dropCategory.replace('Drops', '')
        let fieldCount = 1

        const totalLen = dropArr.join('\n').length
        const fieldNeeded = Math.ceil(totalLen / MAX_FIELD_CHARS)
        const itemPerField = Math.ceil(dropArr.length / fieldNeeded)

        for (let i = 0; i < fieldNeeded; i++) {
            let sliced = dropArr.slice(i * itemPerField, (i + 1) * itemPerField)

            result.push({
                name: `${dropCategory} (${fieldCount})`,
                value: sliced.join('\n'),
                inline: true,
            });

            fieldCount += 1
        }
    }

    return result;
};

export const pickMatchedNameOrWithDrop = (data, query) => {
    // if has name matched, get the first one with drops
    // else get whatever at first
    // console.log(query)
    // console.log(data)
    let nameMatchedWithDrop = data      // avoid sort, use sorted res from API
        .filter(({ name }) => name.trim().toLowerCase() === query.toLowerCase())
        .filter(({ drops }) => drops == true)
    let res = data[0]
    if (nameMatchedWithDrop.length) {
        res = nameMatchedWithDrop[0]
    }
    return res
}

export const getFeeling = () => {
    const choices = [
        "internal screaming",
        "pretending to care",
        "spooked",
        "just vibing",
        "big nope",
        "error 404 emotion",
        "send help",
        "low battery mode",
        "blank stare",
        "crying in the club",
        "laughing but dying inside",
        "caught in 4k",
        "it’s fine I’m fine",
        "faking confidence",
        "tiny rage",
        "full gremlin mode",
        "keyboard smashing",
        "suspicious",
        "emotional support chaos",
        "socially exhausted",
        "brain buffering",
        "existential crisis",
        "sarcasm activated",
        "malfunctioning",
        "looking for the exit",
        "when coffee hits",
        "meme face activated",
        "too broke to feel",
        "random dance mode",
        "done but still going"
    ];
    const randIdx = Math.floor(Math.random() * (choices.length))
    return choices[randIdx]
}

export const fetchURLAndReturnFirst = async (url) => {
    let data = await fetch(url)
    data = await data.json()
    return data.data?.[0]       // get the first of returned array
}

export const fetchURLAndReturnArr = async (url) => {
    let data = await fetch(url)
    data = await data.json()
    return data.data      // get the array, no need pagination info
}

export const fetchURL = async (url) => {
    let detailInfo = await fetch(url)
    return await detailInfo.json()
}

export const fetchDiscordUserAvatar = async (userId) => {
    const botToken = process.env.APP_TOKEN
    const userResponse = await fetch(`https://discord.com/api/v10/users/${userId}`, {
        headers: { Authorization: `Bot ${botToken}` }
    });

    if (!userResponse.ok) throw new Error('Failed to fetch user info');

    const user = await userResponse.json();
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`;

    return avatarUrl;
}

export const saveImageBuffer = (buffer, outputPath) => {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    const stats = fs.statSync(outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    // CheckImageSize
    console.log(`✅ Image saved to: ${outputPath}`);
    console.log(`📏 File size: ${fileSizeKB} KB`);
}

export const overlayAvatarsToBaseImage = async (caller, target, background) => {
    // console.log(caller, target, background)
    const [baseImage, callerImage, targetImage] = await Promise.all([
        Jimp.read(background.url),
        Jimp.read(caller.avatarURL),
        Jimp.read(target.avatarURL),
    ]);

    callerImage.scale(caller.scale);
    targetImage.scale(target.scale);
    baseImage.scale(background.scale);

    baseImage
        .composite(callerImage, caller.x, caller.y)
        .composite(targetImage, target.x, target.y);

    const buffer = await baseImage.getBuffer('image/png');
    return buffer;
}

export const fetchGiffBufferFromUrl = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    return Buffer.from(await res.arrayBuffer());
};

export const overlayAvatarsToAnimatedGif = async (caller, target, background) => {
    console.log('overlaying animated gif')

    const [gif, callerImage, targetImage] = await Promise.all([
        GifUtil.read(await fetchGiffBufferFromUrl(background.url)),
        Jimp.read(caller.avatarURL),
        Jimp.read(target.avatarURL),
    ]);

    callerImage.scale(caller.scale);
    targetImage.scale(target.scale);

    const frames = await Promise.all(gif.frames.map(async (frame) => {
        const jimpFrame = await new Jimp({
            width: frame.bitmap.width,
            height: frame.bitmap.height,
            data: Buffer.from(frame.bitmap.data)
        });

        jimpFrame.scale(background.scale);

        jimpFrame
            .composite(callerImage.clone(), caller.x, caller.y)
            .composite(targetImage.clone(), target.x, target.y);

        return new GifFrame(jimpFrame.bitmap, {
            delayCentisecs: frame.delayCentisecs,
            disposalMethod: frame.disposalMethod,
        });
    }));


    GifUtil.quantizeDekker(frames);

    const codec = new GifCodec();
    const encodedGif = await codec.encodeGif(frames, { loops: gif.loops });
    return encodedGif.buffer; // This is your Buffer
};

export const deferDiscordInteraction = async (interaction) => {
    await fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 5 }),
    });
}

export async function sendDiscordImageWebhook({ imageBuffer, fileName, Embed, interaction }) {
    // console.log({ fileName, interaction })

    const webhookUrl = `https://discord.com/api/v10/webhooks/${interaction.application_id}/${interaction.token}`;

    const fileType = fileName.split('.').at(-1)
    const blob = new Blob([imageBuffer], { type: `image/${fileType}` });
    const form = new FormData();
    form.append('file', blob, fileName);
    form.append('payload_json', JSON.stringify({
        embeds: [Embed],
    }));

    const res = await fetch(webhookUrl, {       // send to discord webhook
        method: 'POST',
        body: form,
    });

    if (!res.ok) {
        const err = await res.text();
        console.error(interaction)
        throw new Error(`Failed to send image to Discord: ${res.status} - ${err}`);
    }

    return await res.json();
}

export const makeEmbed = ({ name, description, url, thumbnailURL }) => {
    return {
        color: 0x0099ff,
        title: name,
        url,
        description,
        thumbnail: {
            url: thumbnailURL
        },
        fields: [],
    };
}

export const addFieldsToEmbed = (fieldArr, embed) => {
    for (let { name, value, inline } of fieldArr) {
        embed.fields.push({ name, value, inline })
    }
    return embed
}

////////////////////  RESPONSE ////////////////////

export const NotFound = () => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: { content: 'Not found' },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const UnRegisteredCommand = () => {
    return {
        statusCode: 400,
        body: 'Un-registered command',
    }
}

export const myOneLinerLinkResponse = (name, url) => {
    const Embed = makeEmbed({})
    Embed.color = 0x00b0f4
    Embed.description = `[${name}](${url})`
    return generateEmbedResponse(Embed)
}

export const myOneLinerImageResponse = (name, url) => {
    const Embed = makeEmbed({ name })
    Embed.image = { url }
    Embed.color = 0x00b0f4
    Embed.description = `[${name}](${url})`
    return generateEmbedResponse(Embed)
}

export const generatePlainTextResponse = (content) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: content
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const generateCodeBlockResponse = (content) => {
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

export const generateEmbedResponse = (embed) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [embed]
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const generateCodeBlockAndEmbedResponse = (content, embed) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: codeBlock(content),
                embeds: [embed],
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const generatePlainTextAndEmbedResponse = (content, embed) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                content: content,
                embeds: [embed],
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const generateEmbedAndAttachmentResponse = (embed, attachment) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            type: 4,
            data: {
                embeds: [embed],
                files: [attachment],
            },
        }),
        headers: { 'Content-Type': 'application/json' },
    }
}

export const generatedImageResponse = async ({ caller, target, background, event, wording }) => {
    const isLocalTestServer = event.headers.host.includes('localhost')
    const isInternalCall = event.headers['x-internal-bypass'] === 'true';
    console.log(caller, target, { isLocalTestServer, isInternalCall })
    const interaction = JSON.parse(event.body)
    // console.log(interaction)

    const [avatarURL1, avatarURL2] = await Promise.all([
        fetchDiscordUserAvatar(caller.id),
        fetchDiscordUserAvatar(target.id),
    ])

    caller.avatarURL = avatarURL1
    target.avatarURL = avatarURL2

    // Step 1: Defer interaction to avoid 3sec timeout
    if (!isLocalTestServer && !isInternalCall) await deferDiscordInteraction(interaction)

    const fileName = `${wording}.gif`
    // const imageBuffer = await overlayAvatarsToBaseImage(caller, target, background)
    const imageBuffer = await overlayAvatarsToAnimatedGif(caller, target, background)

    // Step 2 : Send image
    if (isLocalTestServer || isInternalCall) {
        // dev mode, save to local folder instead to verify location and file size, netlify dev would cleanup
        const outputPath = path.join(__dirname, '/output', fileName);
        if (!isInternalCall) saveImageBuffer(imageBuffer, outputPath)     // netlify can't save anything on hosted
    } else {
        const Embed = makeEmbed({
            name: `${wording} ${wording} ${wording}!`,
            description: `<@${caller.id}> ${wording} <@${target.id}>!`,
        })
        Embed.image = { url: `attachment://${fileName}` }
        await sendDiscordImageWebhook({ imageBuffer, fileName, Embed, interaction });
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
    };
}