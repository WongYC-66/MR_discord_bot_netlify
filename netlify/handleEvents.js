import {
    UnRegisteredCommand,
    myOneLinerLinkResponse,
    myOneLinerImageResponse,
    print,
} from './utility.js'

import * as bot from './bot.js'
import * as drop from './drop.js'
import * as troll from './troll.js'


const helpString =
    `
VNHOES BOT HELP:
  /bot help             : show help
  /bot equip xxxx       : search and return 1st equip
  /bot item xxxx        : search and return 1st item
  /bot monster xxxx     : search and return 1st monster
  /bot skill xxxx       : search and return 1st skill
  /bot music xxxx       : search and return 1st music
  /bot servertime       : show mapleroyals servertime
  /bot roll min max     : roll a number between, up to -10b ~ 10b
  /bot flipcoin         : flip a coin
  /bot selftest         : healthcheck if this BOT is OK
  /bot author           : show author

  # drop
  /drop equip xxxx      : show which mobs drop the equip
  /drop item xxxx       : show which mobs drop the item
  /drop mob xxxx        : show drops of a mob 

  # guide
  /guide apq            : link to apq guide
  /guide apqbon         : show apq bonus map
  /guide cwk            : link to cwkpq guide
  /guide cwkbon         : show cwkpq bonus map
  /guide gpq            : link to gpq guide
  /guide gpqbon         : show gpq bonus map
  /guide opq            : link to opq guide
  /guide lpq            : link to lpq guide
  /guide mage1hit       : show mage1hit table
  /guide reuel          : link to Reuel hp quest
  /guide leech          : show leech picture
  /guide price          : link to Sylafia price guide
  /guide jobadvance     : link to job advance guide
  /guide hpwashinfo     : show hp wash info table
  
  # troll
  /troll pavoweme       : show how much pav owes me
  /troll pavoweeveryone : show how much pav owes everyone
  /troll pavfeels       : show pav feeling today
  /troll sackpav        : sack a random BOSS on Pav
  /troll pat            : pat someone's head
`

const allowedMainCommand = new Set(['bot', 'drop', 'guide', 'troll'])

export const handleEvents = async (rawBody, event) => {
    // refer to discord API, https://discord.com/developers/docs/interactions/receiving-and-responding
    const body = JSON.parse(rawBody)

    // print(body)
    print(body.data)

    // Ping from Discord, DEFAULT, DON'T TOUCH ANYTHING!
    // 1. acknowledge PING
    // 2. verifyKey passed
    // https://discord.com/developers/docs/interactions/overview#configuring-an-interactions-endpoint-url
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
            headers: { 'Content-Type': 'application/json' },
        }
    }

    // --------------- FOR DEVELOPERS --------------- :
    // // Slash command (example)
    // if (body.type === 2 && body.data.name === 'ping') {
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify({
    //             type: 4,
    //             data: { content: '🏓 Pong!' },
    //         }),
    //         headers: { 'Content-Type': 'application/json' },
    //     }
    // }

    const mainCommand = body?.data?.name
    const subCommand = body?.data?.options?.[0]?.name
    const command = `/${mainCommand} ${subCommand}`   // '/bot equip'
    const triggeredUser = body?.member?.user
    let options = body?.data?.options?.[0]

    console.log(command)

    if (!allowedMainCommand.has(mainCommand)) {
        return {
            statusCode: 400,
            body: 'Invalid command, start with /bot or /drop or /guide or /troll',
        }
    }

    options = options?.options
    let query = null
    let targetUser = null

    switch (command) {
        // bot
        case '/bot help':
            return bot.getBotHelpResponse(helpString)

        case '/bot equip':
            options = options?.[0]
            query = options.value
            return bot.getEquipQueryResponse(query)

        case '/bot item':
            options = options?.[0]
            query = options.value
            return bot.getItemQueryResponse(query)

        case '/bot monster':
            options = options?.[0]
            query = options.value
            return bot.getMonsterQueryResponse(query)

        case '/bot skill':
            options = options?.[0]
            query = options.value
            return bot.getSkillQueryResponse(query)

        case '/bot music':
            options = options?.[0]
            query = options.value
            return bot.getMusicQueryResponse(query)

        case '/bot servertime':
            return bot.getServertimeResponse()

        case '/bot roll':       // '/bot roll min max'
            const minInput = options?.[0].value
            const maxInput = options?.[1].value
            return bot.getRollResponse(minInput, maxInput)

        case '/bot flipcoin':
            return bot.getCoinFlipResponse()

        case '/bot selftest':
            return bot.getSelfTestResponse()

        case '/bot author':
            return myOneLinerLinkResponse('ScottY5C', 'https://royals-library.netlify.app/about-me')

        // drop
        case '/drop equip':
            options = options?.[0]
            query = options.value
            return drop.getEquipDroppedByResponse(query)

        case '/drop item':
            options = options?.[0]
            query = options.value
            return drop.getItemDroppedByResponse(query)

        case '/drop mob':
            options = options?.[0]
            query = options.value
            return drop.getMobDropResponse(query)

        // guide
        case '/guide apq':
            return myOneLinerLinkResponse('APQ Guide', 'https://royals.ms/forum/threads/comprehensive-apq-guide-updated-feb-2021.172942/')

        case '/guide apqbon':
            return myOneLinerImageResponse('APQ Bonus Map', 'https://royals.ms/forum/attachments/3z07lbj-png.189083/')

        case '/guide cwk':
            return myOneLinerLinkResponse('CWKPQ Guide', 'https://royals.ms/forum/threads/crimsonwood-party-quest-prequisite-guide-2020-cwpq.153541/')

        case '/guide cwkbon':
            return myOneLinerImageResponse('CWKPQ Bonus Map', 'https://i.imgur.com/KED684z.png')

        case '/guide gpq':
            return myOneLinerLinkResponse('GPQ Guide', 'https://royals.ms/forum/threads/%E2%9C%AF-hollywood-presents-a-comprehensive-guide-to-guild-party-quest-gpq.27299/')

        case '/guide gpqbon':
            return myOneLinerImageResponse('GPQ Bonus Map', 'https://i.imgur.com/EcaEybL.png/')

        case '/guide opq':
            return myOneLinerLinkResponse('OPQ Guide', 'https://royals.ms/forum/threads/orbis-pq-guide.174277/')

        case '/guide lpq':
            return myOneLinerLinkResponse('LPQ Guide', 'https://royals.ms/forum/threads/ludibrium-party-quest-lpq-guide.108791/')

        case '/guide mage1hit':
            return myOneLinerImageResponse('Mage 1 hit', 'https://i.gyazo.com/0f145192abae7abc4bd3e14073e7c9e1.png/')

        case '/guide reuel':
            return myOneLinerLinkResponse('Reuel HP Quest', 'https://royals.ms/forum/threads/comprehensive-search-for-the-elixir-of-life-reuel-hp-quest-guide-lv120.178648/')

        case '/guide leech':
            return myOneLinerImageResponse('Leech', 'https://i.imgur.com/MNEDFOd_d.webp?maxwidth=1520&fidelity=grand')

        case '/guide price':
            return myOneLinerLinkResponse('Sylafia price guide', 'https://docs.google.com/spreadsheets/d/1B3sxmpaW7RGrQAAxAyeR-xS4mdKCTTs_DzgV0qo2p_8/edit?gid=0#gid=0/')

        case '/guide jobadvance':
            return myOneLinerLinkResponse('Job Advancement', 'https://royals.ms/forum/threads/new-source-job-advancement-guide.110142/')

        case '/guide hpwashinfo':
            return myOneLinerImageResponse('Hp Wash Info', 'https://i.imgur.com/pckfDK8.jpeg')

        // troll
        case '/troll pavoweme':
        case '/troll pavoweeveryone':
            return troll.getTrollPavOweMeEveryoneResponse(command, triggeredUser)

        case '/troll pavfeels':
            return troll.getTrollPavFeelResponse()

        case '/troll sackpav':
            return troll.getTrollSackPavResponse()

        case '/troll pat':
            options = options?.[0]
            targetUser = options.value
            return troll.getTrollPatResponse(triggeredUser, targetUser, event)

        // --------------------- Not registered command ---------------------
        default:
            return UnRegisteredCommand()
    }
}