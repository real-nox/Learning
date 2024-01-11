import { EmbedBuilder, Message } from "discord.js";
import { errHandler } from "./error";
import { DATABASE, KAI, WORKSPACE } from "../core/utils/corefunctions";
import { Admins, DEventManager, DEventStaff, EventManagers, EventStaff, Host, JRA, StarMOD, normalroles, rolepermited, superiorsroles } from "./roles";

let stablechance: number = 0;
let stablestartingTime: number = 0;
let sca: string = "Off"
let chanc: string = "Off"
let scanum: number = 0
let chancnum: number = 0

export const serverConfigs = new Map<string, { stablechance: number; crazyys: string; scaringphase: string }>();

export const demaror = async (mg: Message, chance: number, scareph: number) => {
  const serverId = mg.guild.id;
  let serverConfigss = serverConfigs.get(serverId);

  if (!serverConfigss) {
    serverConfigss = { stablechance: 0, crazyys: "Off", scaringphase: "Off" };
    serverConfigs.set(serverId, serverConfigss);
  }
  serverConfigss.stablechance = chance;
  serverConfigss.crazyys = chance === 1 ? "On" : "Off";
  serverConfigss.scaringphase = scareph === 1 ? "On" : "Off";

  sca = serverConfigss.crazyys === "On" ? "On" : "Off";
  scanum = serverConfigss.crazyys === "On" ? 1 : 0;

  chanc = serverConfigss.scaringphase === "On" ? "On" : "Off";
  chancnum = serverConfigss.scaringphase === "On" ? 1 : 0;

}

export const reactor = async (mg: Message) => {
  const member = mg.member;
  try {
    if (!member.roles.cache.some(role => superiorsroles.includes(role.id)) || !member.roles.cache.some(role => normalroles.includes(role.id))) {
      mg.react("📛");
    } else if (member.roles.cache.some(role => superiorsroles.includes(role.id)) || !member.roles.cache.some(role => normalroles.includes(role.id))) {
      mg.react("❌");
    }
  } catch (err: any) {
    console.log(err);
    errHandler(err, mg);
  }
};

export const configurator = async (mg: Message, chance: number, scareph: number) => {
  const serverId = mg.guild.id;
  let serverConfig = serverConfigs.get(serverId);

  if (!serverConfig) {
    serverConfig = { stablechance: 0, crazyys: "Off", scaringphase: "Off" };
    serverConfigs.set(serverId, serverConfig);
  }

  serverConfig.stablechance = chance;
  serverConfig.crazyys = chance === 1 ? "On" : "Off";
  serverConfig.scaringphase = scareph === 1 ? "On" : "Off";

  const channel = mg.channel;

  const configsbed = new EmbedBuilder()
    .setTitle("🧱 Configurations")
    .setDescription(`Hello **${mg.author.username}**! You have configured the bot to:\n- Scaring Phase: \`\`${serverConfig.scaringphase}\`\`\n- Crazy mode : \`\`${serverConfig.crazyys}\`\`\nThe configuration is completely done!`)
    .setTimestamp()
    .setFooter({ text: `Reserved for: ${mg.guild.name}`, iconURL: `${mg.guild.iconURL()}` });

  try {
    mg.react("🔧");
    console.warn(`Config command was used by ${mg.author.username}!`);
    channel.send({ embeds: [configsbed] });

    mg.react("✅");
  } catch (err: any) {
    console.log(err);
    errHandler(err, mg);
  }
};

export const guide25 = async (mg: Message) => {
  const channel = mg.channel
  let kgrlconfig = '`` kgrl- config:\n``'
  let kgrlhost = '`` kgrl- s:/start:\n``'
  let snow = '`` ksnow- s or start:\n``'
  let snowdec = `Simple command to start snow game!`
  let confdec = `This command is used to change the __way of the Game__! **Scaring Phase**; is a phases that scares people, "On" or "Off". **Crazy mode**; this mode is very hard and fast than the regular mode, "On" or "Off".\n`
  let hostdec = `kgrl- start or kgrl- s + number of rounds + timer + max winners. To Start the game!\n`
  let testdec = `Thanks to our brilliant Event Staff who helped this project a lot and to our Leads : <@693725593409421332>, <@1006467857049198622> and <@671016674668838952>!`

  try {
    const guidebed = new EmbedBuilder()
      .setTitle("Bot's Guide")
      .setDescription(`
    ${mg.author.client.user.username} Bot is a discord bot that can run a games called **Green Light Red light** and **Snow Game**. This bot has a lot of commands for a lot of services.`)
      .setFields(
        { name: "🧱 Configurations:", value: kgrlconfig + confdec, inline: false },
        { name: "🎀 Hosting/Starting:", value: kgrlhost + hostdec + snow + snowdec, inline: false },
        { name: "🎯 Testers:", value: testdec, inline: false }
      ).setTimestamp().setFooter({ text: `Reserved for: ${mg.guild.name}`, iconURL: `${mg.guild.iconURL()}` })
    channel.send({ embeds: [guidebed] })
  } catch (err: any) {
    console.log(err);
    errHandler(err, mg);
  }
}
export const modificator = async (mg: Message, startingTime: number) => {
  stablestartingTime = startingTime;
}
export { stablechance, stablestartingTime, chancnum, scanum };

export const s_guide = async (mg: Message) => {
  const channel = mg.channel

  let kgrlconfig = '`` kgrl- config:\n``'
  let kgrlhost = '`` kgrl- s:/start:\n``'
  let snow = '`` ksnow- s or start:\n``'
  let snowdec = `Simple command to start snow game!`
  let confdec = `This command is used to change the __way of the Game__! **Scaring Phase**; is a phases that scares people, "On" or "Off". **Crazy mode**; this mode is very hard and fast than the regular mode, "On" or "Off".\n`
  let hostdec = `kgrl- start or kgrl- s + number of rounds + timer + max winners. To Start the game!\n`

  let Management =
    `\`\`k- report\`\`: This command, is used to let the developer know what is the problem or the issue.
  \`\`k- check-r\`\`: This command, is used to let you check the permited roles and the handlers of commands of this bot.
  \`\`kgrl- d-c\`\`: This command, is used delete the channel's data of the bot **p.s:** That doesn't not mean delete channel.
  \`\`k- list-cmds\`\` for more informations.`

  try {
    const guidebed = new EmbedBuilder()
      .setTitle("Bot's Guide")
      .setDescription(`Welcome <@${mg.author.id}> this is reserved for Leads only.`)
      .setFields(
        { name: "🧱 Configurations:", value: kgrlconfig + confdec, inline: false },
        { name: "🎀 Hosting/Starting:", value: kgrlhost + hostdec + snow + snowdec, inline: false },
        { name: "🔐 Management:", value: Management, inline: false },
      ).setTimestamp().setFooter({ text: `Reserved for: ${mg.guild.name}`, iconURL: `${mg.guild.iconURL()}` })
    channel.send({ embeds: [guidebed] })
  } catch (err: any) {
    console.log(err);
    errHandler(err, mg);
  }
}

export const check_roles = async (mg: Message) => {
  const channel = mg.channel
  const embedroles = new EmbedBuilder()
    .setTitle(`Role of ${mg.guild.name}`)
  try {
    if (mg.guild.id === WORKSPACE) {
      embedroles.setFields(
        { name: "Host", value: `<@&${Host}>`, inline: false }
      )
    } else if (mg.guild.id === KAI) {
      embedroles.setFields(
        { name: "Superiors", value: `<@&${Admins}> \n <@&${JRA}> \n <@&${StarMOD}> \n <@&${EventManagers}>`, inline: true },
        { name: "Normal", value: `<@&${EventStaff}> \n <@&${rolepermited}>`, inline: true }
      )
    } else if (mg.guild.id === DATABASE) {
      embedroles.setFields(
        { name: "Superiors", value: `<@&${DEventManager}>`, inline: true },
        { name: "Normal", value: `<@&${DEventStaff}>`, inline: true }
      )
    }
    channel.send({ embeds: [embedroles] })
  } catch (err: any) {
    console.log(err);
    errHandler(err, mg);
  }
}