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
