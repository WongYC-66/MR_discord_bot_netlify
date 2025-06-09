// register-commands.js

// FOR DEVELOPERS:
// 1. Everytimes the bot is newly added to discord channel, run this
// 2. If new command is created, run this with `node register-command.cjs`

import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const APP_TOKEN = process.env.APP_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const DISCORD_GUILD_ID_1 = process.env.DISCORD_GUILD_ID_1; // Optional: for testing in a specific guild
const DISCORD_GUILD_ID_2 = process.env.DISCORD_GUILD_ID_2; // Optional: for testing in a specific guild

console.log({ APP_TOKEN, APPLICATION_ID })   // debug

const commands = [
  {
    name: 'bot',
    description: 'Bot command',
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
    ],
  },
];


const rest = new REST({ version: '10' }).setToken(APP_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      // Routes.applicationGuildCommands(APPLICATION_ID, DISCORD_GUILD_ID_1),   // run this for discord test-server
      Routes.applicationGuildCommands(APPLICATION_ID, DISCORD_GUILD_ID_2),   // run this for discord VNHoes
      // Routes.applicationGuildCommands(APPLICATION_ID),                  // Use Routes.applicationCommands(CLIENT_ID) for global
      { body: commands }
    );
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();
