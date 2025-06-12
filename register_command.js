// register_commands.js

// FOR DEVELOPERS:
// 1. Everytimes the bot is newly added to discord channel, must run to register
// 2. When need new command, must run too
//  `node register_command.js`

import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const APP_TOKEN = process.env.APP_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const DISCORD_GUILD_ID_1 = process.env.DISCORD_GUILD_ID_1; // Optional: for testing in a specific guild
const DISCORD_GUILD_ID_2 = process.env.DISCORD_GUILD_ID_2; // Optional: for testing in a specific guild

console.log({ APP_TOKEN, APPLICATION_ID, DISCORD_GUILD_ID_1, DISCORD_GUILD_ID_2 })   // debug

const commands = [
  //  ------- BOT ------- 
  {
    name: 'bot',
    description: 'bot command',
    options: [
      {
        type: 1,    // SUB_COMMAND
        name: 'help',
        description: 'Show help info',
      },
      {
        type: 1, // SUB_COMMAND
        name: 'equip',
        description: 'Describe an equip or equip id',
        options: [
          {
            name: 'query',
            description: 'Equip name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'item',
        description: 'Describe a item or item id',
        options: [
          {
            name: 'query',
            description: 'Item name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'monster',
        description: 'Describe a monster or monster id',
        options: [
          {
            name: 'query',
            description: 'Monster name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'skill',
        description: 'Describe a skill or skill id',
        options: [
          {
            name: 'query',
            description: 'Skill name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'music',
        description: 'Describe a music',
        options: [
          {
            name: 'query',
            description: 'Music name',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'servertime',
        description: 'Show mapleroyals servertime',
      },
      {
        name: 'roll',
        description: 'Roll a random number between min and max',
        type: 1, // Subcommand
        options: [
          {
            name: 'min',
            description: '-10b to 10b',
            type: 4,  // Integer
            required: true,
          },
          {
            name: 'max',
            description: '-10b to 10b',
            type: 4,  // Integer
            required: true,
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'flipcoin',
        description: 'show result of a coin flip',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'selftest',
        description: 'healthcheck if this BOT is OK',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'author',
        description: 'show link to author',
      },

    ]
  },
  //  ------- DROP -------
  {
    name: 'drop',
    description: 'drop commands',
    options: [
      {
        type: 1, // SUB_COMMAND
        name: 'equip',
        description: 'show which mobs drop the equip',
        options: [
          {
            name: 'query',
            description: 'Equip name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'item',
        description: 'show which mobs drop the item',
        options: [
          {
            name: 'query',
            description: 'Item name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        type: 1, // SUB_COMMAND
        name: 'mob',
        description: 'show drops of a mob',
        options: [
          {
            name: 'query',
            description: 'Mob name or ID',
            type: 3, // STRING
            required: true,
          },
        ],
      },
    ],
  },
  //  ------- GUIDE -------
  {
    name: 'guide',
    description: 'guide commands',
    options: [
      {
        type: 1,    // SUB_COMMAND
        name: 'apq',
        description: 'show link to apq guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'apqbon',
        description: 'show image of apq bonus map',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'cwk',
        description: 'show link to cwkpq guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'cwkbon',
        description: 'show image of cwkpq bonus map',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'gpq',
        description: 'show link to gpq guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'gpqbon',
        description: 'show image of gpq bonus map',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'opq',
        description: 'show link to opq guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'lpq',
        description: 'show link to lpq guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'mage1hit',
        description: 'show image of mage 1 hit tma',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'reuel',
        description: 'show link to reuel hp quest',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'leech',
        description: 'show image of leech info',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'price',
        description: 'show link to sylafia price guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'jobadvance',
        description: 'show link to job advance guide',
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'hpwashinfo',
        description: 'show image of hp wash info',
      },

    ]
  },
  //  ------- TROLL -------
  {
    name: 'troll',
    description: 'troll commands',
    options: [
      {
        type: 1,    // SUB_COMMAND
        name: 'owe',
        description: 'show how much someone owed me, a troll feature',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'oweall',
        description: 'show how much someone owed everyone, a troll feature',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'feels',
        description: 'show how someone feels today, a troll feature',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'feels',
        description: 'sack a random BOSS on someone, a troll feature',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'pat',
        description: 'pat a user\' head',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true // or true if you always want them to pick
          }
        ]
      },
      {
        type: 1,    // SUB_COMMAND
        name: 'slap',
        description: 'slap someone',
        options: [
          {
            name: 'target',
            description: 'who',
            type: 6, // USER
            required: true // or true if you always want them to pick
          }
        ]
      },
    ],
  },
];


const rest = new REST({ version: '10' }).setToken(APP_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(APPLICATION_ID, DISCORD_GUILD_ID_1),   // run this for discord server 1
      // Routes.applicationGuildCommands(APPLICATION_ID),                  // Use Routes.applicationCommands(CLIENT_ID) for global
      { body: commands }
    );

    await rest.put(
      Routes.applicationGuildCommands(APPLICATION_ID, DISCORD_GUILD_ID_2),   // run this for discord server 2
      // Routes.applicationGuildCommands(APPLICATION_ID),                  // Use Routes.applicationCommands(CLIENT_ID) for global
      { body: commands }
    );
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();
