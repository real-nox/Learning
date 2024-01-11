import { EmbedBuilder } from "discord.js";
import { client } from "../central";
import { inspect } from "util";

export const errHandler = async (errors: any, mg: any) => {
    try {
        const channelreceive = "1171708521176379442"
        console.log(`[ Anti-Crash ] :: Client Error`);
        console.error(errors);

        const erruserbed = new EmbedBuilder()
            .setTitle("Something Wrong Happened")
            .setDescription(`**Error showed to**: <@${mg.author.id}>\n` + errors.message + "").setColor("Red");
        const errBed = new EmbedBuilder()
            .setTitle("Something Wrong Happened")
            .setDescription("\`\`\`" + errors.message + "\`\`\`").setColor("Red");
        await mg.reply({
            embeds: [errBed],
            ephemeral: true,
        });
        const channel = client.channels.cache.get(channelreceive);
        if (channel?.isTextBased()) {
            await channel.send({ embeds: [erruserbed] })
        }
        process.on('unhandledRejection', async (reason, p) => {
            console.log(`[ Anti-Crash ] :: Unhandled Rejection/Catch`);
            console.error(reason, p);

            const Embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: 'Error', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    {
                        name: 'Reason',
                        value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                    {
                        name: 'Promise',
                        value: `\`\`\`${inspect(p, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                )
                .setFooter({ text: `Anti-Crash System` })
                .setTimestamp();
            if (channel?.isTextBased()) {
                await channel.send({ embeds: [Embed] });
            }
        })

        process.on('uncaughtException', async (err, origin) => {
            console.log(`[ Anti-Crash ] :: Unhandled Exception/Catch`);
            console.error(err, origin);

            const Embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: 'Error', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    {
                        name: 'Error',
                        value: `\`\`\`${inspect(err, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                    {
                        name: 'Origin',
                        value: `\`\`\`${inspect(origin, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                )
                .setFooter({ text: `Anti-Crash System` })
                .setTimestamp();

            if (channel?.isTextBased()) {
                await channel.send({ embeds: [Embed] });
            }
        });

        process.on('multipleResolves', async (type, promise, reason) => {
            console.log(`[ Anti-Crash ] :: Unhandled Exception/Catch`);
            console.error(reason, promise);

            const Embed = new EmbedBuilder()
                .setColor('Red')
                .setAuthor({ name: 'Error', iconURL: client.user.displayAvatarURL() })
                .addFields(
                    {
                        name: 'Type',
                        value: `\`\`\`${inspect(type, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                    {
                        name: 'Promise',
                        value: `\`\`\`${inspect(promise, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                    {
                        name: 'Reason',
                        value: `\`\`\`${inspect(reason, { depth: 0 }).slice(0, 1000)}\`\`\``
                    },
                )
                .setFooter({ text: `Anti-Crash System` })
                .setTimestamp();

            if (channel?.isTextBased()) {
                await channel.send({ embeds: [Embed] });
            }
        });
    } catch (err) {
        console.log("Err on /src/errHandler()")
        console.log(err)
    }
};