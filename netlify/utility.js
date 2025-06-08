import { formatInTimeZone } from 'date-fns-tz'

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

export async function getDatetimeFromRoyals() {
    const url = 'http://worldclockapi.com/api/json/utc/now';

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();

    const isoString = data.currentDateTime;

    // Format while staying in UTC timezone
    const formatted = formatInTimeZone(new Date(isoString), 'UTC', "HH:mm:ss - MMMM do, yyyy")

    // Output: 16:14:02 - June 9th, 2025
    return formatted
}
