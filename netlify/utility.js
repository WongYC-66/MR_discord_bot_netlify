import * as cheerio from 'cheerio';

const LIBRARY_URL = 'https://royals-library.netlify.app';

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

export const generateThumbnailUrl = (type, id) => {
    id = normalizedID(type, id)
    return `${LIBRARY_URL}/images/${type}/${id}.png`
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
    return mobStringsWithURL.join('\n').length < 6000 ? mobStringsWithURL : mobStringsWithoutURL
}

const formatToArrOfMobNameWithURL = (arrayOfElWithIdAndName) => {
    return arrayOfElWithIdAndName.map(({ id, name }) => {
        const mobURL = generateMonsterURL({ id })
        return `[${name}](${mobURL})`
    })
}

const formatToArrOfItemNameWithURL = (arrayOfElWithIdAndName) => {
    return arrayOfElWithIdAndName.map(({ id, name }) => {
        const mobURL = generateMonsterURL({ id })
        return `[${name}](${mobURL})`
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
    return lenWithURL < 6000 ? dropStringsWithURL : dropStringsWithoutURL
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
        if(!dropArr.length) dropArr = ['none']
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