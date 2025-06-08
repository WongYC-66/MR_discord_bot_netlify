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
        for(let urlPath in urlPathToCategoryName){
            if(urlPathToCategoryName[urlPath].toLowerCase() === itemCategory){
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