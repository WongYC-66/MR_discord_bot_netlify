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
        name: 'equip',     // e.g. /bot equip maple shild
        description: 'Describe an item or item id',
        type: 3, // STRING
        required: false,
      },
      {
        name: 'monster',     // e.g. /bot monster zakum
        description: 'Describe a monster or monster id',
        type: 3, // STRING
        required: false,
      },
      {
        name: 'item',     // e.g. /bot item power elixir
        description: 'Describe a monster or monster id',
        type: 3, // STRING
        required: false,
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
