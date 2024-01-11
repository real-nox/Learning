import { ActivityType, Client, IntentsBitField } from "discord.js";
import { createsnow } from "./events/Snow-msg"
import { config } from 'dotenv';

config();
const Token = process.env.BOT_TOKEN
const IF = IntentsBitField.Flags

export const client = new Client({
  intents: [
    IF.Guilds,
    IF.GuildMessages,
    IF.GuildMembers,
    IF.MessageContent
  ],
});

if (!Token) {
  console.error('Bot token is missing. Make sure to set the BOT_TOKEN environment variable.');
  process.exit(1);
}

client.login(Token);

client.once("ready", async (client) => {
  console.log(`${client.user.tag} - Is functionally working and ready to serve the military!`);
  client.user.setActivity({ name: 'k- help', type: ActivityType.Playing });
  client.user.setPresence({ status: 'online' });
  createsnow(client);
});