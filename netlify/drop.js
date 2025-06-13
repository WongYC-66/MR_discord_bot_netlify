import {
    API_URL,
    decideDropStrings,
    decideMobStrings,
    fetchURL,
    fetchURLAndReturnArr,
    fetchURLAndReturnFirst,
    generateEmbedResponse,
    generateEquipURL,
    generateItemURL,
    generateMonsterURL,
    makeEmbed,
    NotFound,
    pickMatchedNameOrWithDrop,
    splitLongDropStringIntoArray,
    splitLongMobStringIntoArray
} from "./utility"

export const getEquipDroppedByResponse = async (query) => {
    console.log(query)
    // 1. fetch the query to get the 1st Equip that matches
    let data = await fetchURLAndReturnFirst(`${API_URL}/equip?search=${query}`)
    if (!data) return NotFound()

    // 2. fetch the detail, assume the ID always correct since fetch 1 is ok.
    let equipInfo = await fetchURL(`${API_URL}/equip?id=${data.id}`)

    const name = data?.name || 'undefined'
    const url = generateEquipURL(data)
    const thumbnailURL = data?.imgURL || 'undefined'
    const mobs = equipInfo.droppedBy || []

    console.log(name, mobs) // equip names, and array of mobs

    let mobStrings = decideMobStrings(mobs)

    if (!mobStrings.length) mobStrings = ['Nothing dropped it']

    const Embed = makeEmbed({ name, url, thumbnailURL })
    Embed.fields = splitLongMobStringIntoArray(mobStrings)
    return generateEmbedResponse(Embed)
}

export const getItemDroppedByResponse = async (query) => {
    console.log(query)
    // 1. fetch the query to get the 1st Item that matches
    let data = await fetchURLAndReturnFirst(`${API_URL}/item?search=${query}`)
    if (!data) return NotFound()

    // 2. fetch the detail, assume the ID always correct since fetch 1 is ok.
    let itemInfo = await fetchURL(`${API_URL}/item?id=${data.id}`)

    const name = data?.name || 'undefined'
    const url = generateItemURL(data)
    const thumbnailURL = data?.imgURL || 'undefined'
    const mobs = itemInfo?.droppedBy || []

    console.log(name, mobs) // item names, and array of mobs

    let mobStrings = decideMobStrings(mobs)

    if (!mobStrings.length) mobStrings = ['Nothing dropped it']

    const Embed = makeEmbed({ name, url, thumbnailURL })
    Embed.fields = splitLongMobStringIntoArray(mobStrings)
    return generateEmbedResponse(Embed)
}

export const getMobDropResponse = async (query) => {
    console.log(query)
    // 1. fetch the query to get list
    let data = await fetchURLAndReturnArr(`${API_URL}/monster?search=${query}`)
    if (!data) return NotFound()

    // 2. be selective here, pick the exact name first, then pick the one with drops
    // i think this is what user hope to see
    data = pickMatchedNameOrWithDrop(data, query)

    // 3. fetch the detail, assume the ID always correct since fetch 1 is ok.
    let mobInfo = await fetchURL(`${API_URL}/monster?id=${data.id}`)

    const name = data?.name || 'undefined'
    const url = generateMonsterURL(data)
    const thumbnailURL = data?.imgURL || 'undefined'
    const drops = mobInfo.drops

    console.log(name, drops) // item names, and array of mobs

    const dropStrings = decideDropStrings(drops)

    const Embed = makeEmbed({ name, url, thumbnailURL })
    Embed.fields = splitLongDropStringIntoArray(dropStrings)
    return generateEmbedResponse(Embed)
}
