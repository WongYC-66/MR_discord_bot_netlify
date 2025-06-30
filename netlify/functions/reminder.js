// Receive an GET request, then send a reminder to discord channel

// invoke endpoint :
// http://localhost:8888/.netlify/functions/reminder?event=[]&channel_id=[]
// must specify event and channel_id


const allEvents = {
    'cake': {
        eventName: 'Cake boss',
        intervalHr: [4, 8, 12, 16, 20, 24],
        roleId: '@&1389125881384927362',    // discord RoleId
    },
}

export const handler = async (event) => {

    const params = new URLSearchParams(event.rawQuery || "")
    const channelId = params.get("channel_id")
    const eventType = params.get("event")

    const eventObj = allEvents[eventType]

    // Error, un-registered event
    if (!eventType || !eventObj) {
        return {
            statusCode: 400,
            body: `Invalid Event Type, should be one of [${Object.keys(allEvents)}]`
        }
    }
    // Error, un-specified channel_id event
    if (!channelId) {
        return {
            statusCode: 400,
            body: `Invalid, please specify your channel_id`
        }
    }

    // ---------------- Valid input ----------------

    const nextIsoTimeSlot = getNextIsoTimeSlot(eventObj.intervalHr)
    const finalContent = `⏰ Reminder : <${eventObj.roleId}> ${eventObj.eventName} ${toDiscordDynamicTime(nextIsoTimeSlot)}`    // ⏰ Reminder : <@&1389125881384927362> cake boss <t:1751265900:R>

    console.log(finalContent)

    // Try to send to discord channel
    const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${process.env.APP_TOKEN}`,
        },
        body: JSON.stringify({ content: finalContent })
    })

    // Fail to send to discord
    if (!res.ok) {
        const errText = await res.text()
        console.log(`Failed to send reminder: ${errText}`)
        return {
            statusCode: res.status,
            body: `Failed to send reminder: ${errText}`
        }
    }

    // Success send to discord
    console.log('Reminder sent successfully')
    return {
        statusCode: 200,
        body: "Reminder sent successfully"
    }
}

const toDiscordDynamicTime = (isoDateTime) => {
    let dateObj = new Date(isoDateTime)
    let secSinceEpoch = Math.ceil(dateObj / 1000)
    return `<t:${secSinceEpoch}:R>`
}

const getNextIsoTimeSlot = (slots) => {
    const now = new Date();
    const currentUTC = now.getUTCHours();

    // Find the next slot
    let nextSlot = slots.find(slot => currentUTC < slot);

    // If slot 24, wrap to next day at 00:00
    const nextDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + (nextSlot === 24 ? 1 : 0),
        nextSlot === 24 ? 0 : nextSlot,
        0, 0, 0
    ));

    return nextDate.toISOString();
}