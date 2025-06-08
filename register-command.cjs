// register-commands.js

// FOR DEVELOPERS:
// 1. Everytimes the bot is newly added to discord channel, run this
// 2. If new command is created, run this with `node register-command.cjs`

const { REST, Routes } = require('discord.js');

const APP_TOKEN = process.env.APP_TOKEN;
const APPLICATION_ID = process.env.APPLICATION_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID; // Optional: for testing in a specific guild

console.log({ APP_TOKEN, APPLICATION_ID, DISCORD_GUILD_ID })   // debug

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  // Add more commands here
];

const rest = new REST({ version: '10' }).setToken(APP_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(APPLICATION_ID, DISCORD_GUILD_ID),   // run this for discord test-server
      // Routes.applicationGuildCommands(APPLICATION_ID),                  // Use Routes.applicationCommands(CLIENT_ID) for global
      { body: commands }
    );
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error(err);
  }
})();
