import { EmbedBuilder, Message } from "discord.js"
import { config } from 'dotenv';
import { errHandler } from "../../configs/error";
import { DEventManager, DEventStaff, Host, rolepermited } from "../../configs/roles";
import { serverConfigs } from "../../configs/configurations";

config();

export const KAI = process.env.KAI
export const DATABASE = process.env.DATABASE
export const WORKSPACE = process.env.WORKSPACE

export const testor = async (mg: Message) => {
    const channel = mg.channel;
    const embedBuilder = new EmbedBuilder()
        .setTitle("Cake For you! :cake:")
        .setTimestamp()
        .setFooter({ text: `Reserved for: ${mg.guild.name}`, iconURL: `${mg.guild.iconURL()}` });

    try {
        const role = mg.guild.roles.cache.find(r => r.name === rolepermited);

        if (role) {
            const rolesInfo = [];

            if (mg.guild.id === DATABASE) {
                rolesInfo.push("Leads : <@&" + DEventManager + ">\nEvent Staff : <@&" + DEventStaff + ">");

                if (role) {
                    const roleMembers = role.members.map(member => `- <@${member.id}>`).join('\n');
                    rolesInfo.push(`**Roles ${role.name}:**\n${roleMembers}`);
                }
            } else if (mg.guild.id === WORKSPACE) {
                rolesInfo.push("Roles in this bot: \n**" + mg.guild.name + "**: \nStaff : <@&" + Host + ">.");

                if (role) {
                    const roleMembers = role.members.map(member => `- <@${member.id}>`).join('\n');
                    rolesInfo.push(`**Roles ${role.name}:**\n${roleMembers}`);
                }
            }

            embedBuilder.setFields({ name: `**Roles of ${mg.guild.name}**`, value: `${rolesInfo.join('\n')}` });

            channel.send({ embeds: [embedBuilder] });
        } else {
            const embedBuilder = new EmbedBuilder()
                .setDescription(`${rolepermited} isn't in this server.`)
            channel.send({ embeds: [embedBuilder] })
        }
    } catch (err: any) {
        console.error(err);
        errHandler(err, mg);
    }

};

export const lister = async (mg: Message) => {
    const channel = mg.channel
    const KGRLCmds = `\`\`kgrl- start\`\` or \`\`kgrl- s\`\` + rounds, timer, max winners \n\`\`kgrl- config\`\`and \`\`kgrl- d-c\`\``
    const maincmds = `\`\`k- help\`\`\n\`\`k- report\`\` + message\n\`\`k- feedback\`\`\n\`\`k- guide\`\`\n\`\`k- s-guide\`\`\n\`\`k- check-r\`\`\n\`\`k- check\`\`\n`
    const snowcmds = `\`\`ksnow- start\`\` or \`\`ksnow- s\`\``
    const listbeds = new EmbedBuilder()
        .setTitle("📋 List Of Commands")
        .setDescription(`Hello <@${mg.author.id}>, this is the list of all the commands:`).setFields(
            { name: "Main Commands", value: maincmds, inline: false },
            { name: "Green Red lights", value: KGRLCmds, inline: false },
            { name: "Snow Ball", value: snowcmds, inline: false },
        )
    try {
        channel.send({ embeds: [listbeds] })
    } catch (err: any) {
        console.log(err);
        errHandler(err, mg);
    }
}

export const feed = async (mg: Message) => {
    const channel = mg.channel

    channel.send(`## Thank you for participating in this game! Feel free to leave a feedback in: https://discord.com/channels/859736561830592522/973580801163792384`);
}

export const help = async (mg: Message) => {
    const channel = mg.channel
    const bedded = new EmbedBuilder()
        .setTitle(`Help Command of ${mg.client.user.tag}`)
        .setDescription(`${mg.client.user.tag} is a discord bot reserved for ${mg.guild.name}.\n**Command of GRL:**\n\`\`Use k- guide\`\` to see all the commands.\n**Command of Snow Ball:**\n\`\`Use ksnow- start\`\` to start a new game.`).setColor("Random")
    try {
        channel.send({ embeds: [bedded] })
    } catch (err: any) {
        console.log(err);
        errHandler(err, mg);
    }
}

export const check = async (mg: Message) => {
    const guildid = mg.guild.id;
    const guildname = mg.guild.name;
    console.warn(`Check command was used by ${mg.author.username}!`)
    const serverConfig = serverConfigs.get(guildid);

    if (serverConfig) {
        console.log(`Crazy mode is ${serverConfig.crazyys}`);
        console.log(`Scaring Phase is ${serverConfig.scaringphase}`);

        if (serverConfig.crazyys === "On" && serverConfig.scaringphase === "On") {
            mg.channel.send({ content: `Scary Phase \`\`${serverConfig.scaringphase}\`\` and Crazy mode \`\`${serverConfig.crazyys}\`\`!` });
        } else {
            mg.channel.send({ content: `Scary Phase \`\`${serverConfig.scaringphase}\`\` and Crazy mode \`\`${serverConfig.crazyys}\`\`!` });
        }
    } else {
        mg.channel.send(`No configuration found for server ${guildname}, use kgrl- config`);
    }
};