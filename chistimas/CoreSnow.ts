import { client } from "../central";
import { errHandler } from "../configs/error";
import { Emitter, Ranox, normalroles, superiorsroles } from "../configs/roles";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, MessageCollector, TextChannel } from "discord.js";
import { drawAvatarsAndSendData } from "./utils/MSFunction";
import { channeltoreact1, serveridtouse1 } from "../events/Snow-msg";
import { reactor } from "../configs/configurations";

let snowgameCounter = 0;
export const snowpickmg = "## Time to collect the snow, use shovel!"
export type snowevent = {
    //Clan attacker
    attackers: Map<string, number>
    attackersnames: Map<string, string>
    //Clan defender
    defenders: Map<string, number>
    defendersnames: Map<string, string>

    attackpoints: Map<string, number>;

    treator: Map<string, number>

    snowplayers: Set<string>;

    creator: Set<string>,
    //Info
    snowcollector: MessageCollector;
    profilePics: Map<string, string>;
    points: Map<string, number>;
    players: string[];
    playerNames: Map<string, string>,
    gamesnow: boolean;
};
export const snowevent2 = new Map<string, snowevent>();

export const snowstart = async (mg: Message) => {
    const channel = mg.channel;
    try {
        const snowgameobj: snowevent = {
            snowplayers: new Set(),

            attackpoints: new Map(),

            attackers: new Map<string, number>(),
            attackersnames: new Map<string, string>(),

            treator: new Map<string, number>(),

            defenders: new Map<string, number>(),
            defendersnames: new Map<string, string>(),


            creator: new Set<string>(),
            snowcollector: channel.createMessageCollector(),
            profilePics: new Map(),
            points: new Map(),
            players: [],
            playerNames: new Map<string, string>(),
            gamesnow: true,
        };

        if (snowgameobj) {
            snowevent2.delete(channel.id)

            snowevent2.set(channel.id, snowgameobj);
            const snowevent = snowevent2.get(channel.id);
            snowevent.creator.add(mg.author.id)
            await stator(mg)
        } else {
            reactor(mg)
        }
    } catch (err: any) {
        console.log("Error at gamecreate().");
        console.log(err);
        throw new Error(err.message);
    }
};

const gameCounter: Map<string, number> = new Map();
export const stator = async (mg: Message) => {
    const serverId = mg.guild?.id;

    let currentRounds = gameCounter.get(serverId) || 0;

    gameCounter.set(serverId, currentRounds + 1);

    let gamecounterstring: string = ""
    currentRounds++
    if (currentRounds === 1) {
        gamecounterstring = "st"
    } else if (currentRounds === 2) {
        gamecounterstring = "nd"
    } else if (currentRounds === 3) {
        gamecounterstring = "rd"
    } else {
        gamecounterstring = "th"
    }

    if (mg.guild?.id === serveridtouse1 && mg.channel.id === channeltoreact1) {
        const channel = mg.channel;
        const data = snowevent2.get(channel.id);
        const bot = mg.author.bot;
        let playersCount = 0;
        mg.react("❄️")

        data.snowplayers.clear();

        data.playerNames.clear();
        data.profilePics.clear();
        data.points.clear();

        snowgameCounter++;
        try {
            if (mg.author.bot) { return } //Return the bot
            if (!bot) {

                const tittlebed = {
                    title: `**${mg.guild.name} ${currentRounds}${gamecounterstring} Snow Ball Game**`,
                    description: `**Gathering Players\n- ❄️ to join the snow fight\n- 📣 to start the game**`,
                    color: 0x00FFFF,
                };
                const counterbed = {
                    description: `**Number of Snow Players: 0**`,
                    color: 0x00FFFF,
                };
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder().setCustomId('handler_button').setLabel('📣 Start').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('join_button').setLabel('❄️ Join').setStyle(ButtonStyle.Success)
                );
                const sentMessage = await mg.channel?.send({ embeds: [tittlebed, counterbed], components: [row], });

                const updateCounterbed = () => {
                    counterbed.description = `**Number of Snow Players: ${playersCount}**`;
                    sentMessage?.edit({ embeds: [tittlebed, counterbed], components: [row] });
                };

                //Buttons && Interaction
                const handleButtonClick = async (interaction: any) => {
                    if (!interaction.isButton() || interaction.message.id !== sentMessage?.id) return;
                    const interactionMember = await interaction.guild?.members.fetch(interaction.user.id);

                    const interactor = interaction.user.username
                    const interactori = interaction.user.id
                    const startingbed = new EmbedBuilder().setTitle("**Starting the game!**").setDescription(`\`\`\`Started by: ${interactor}\`\`\``).setColor("Blue")
                    if (interaction.customId === 'handler_button') {
                        const cantperm = new EmbedBuilder().setDescription(`**You don't have permission to start!**`).setColor("Red")
                        if (interactionMember?.roles.cache.find((role => normalroles.includes(role.id))) || interaction.user.id === Emitter || interaction.user.id === Ranox) {
                            const cantstart = new EmbedBuilder().setDescription(`**You can't start.**`).setColor("Red")
                            const notinteractoristo = new EmbedBuilder().setDescription(`**You can't start the game.**`).setColor("Red")
                            if (data.creator.has(interactori) || interactionMember?.roles.cache.find((role => superiorsroles.includes(role.id))) || interaction.user.id === Emitter || interaction.user.id === Ranox) {
                                if (data.gamesnow) {
                                    if (playersCount >= 2) {
                                        data.gamesnow = false
                                        snowevent2.set(channel.id, data);
                                        await interaction.reply({ embeds: [startingbed], ephemeral: false })
                                        console.log(`Game started by : ${interactor}`)
                                        cycle(mg)
                                        playersCount === 0
                                    }
                                    if (playersCount < 2) {
                                        const cantbed = { description: `**At least 2 players required ⛔**` }
                                        await interaction.reply({ embeds: [cantbed], ephemeral: true });
                                        return;
                                    }
                                } else {
                                    interaction.reply({ embeds: [cantstart], ephemeral: true });
                                    return;
                                }
                            } else {
                                interaction.reply({ embeds: [notinteractoristo], ephemeral: true });
                                return;
                            }
                        } else {
                            interaction.reply({ embeds: [cantperm], ephemeral: true });
                            return;
                        }
                    }
                    if (interaction.customId === 'join_button') {
                        const cantstart = new EmbedBuilder().setDescription(`**The game is ongoing.**`).setColor("Red")
                        if (data.gamesnow) {
                            const user = interaction.user;

                            const userName = user.username;
                            const userId = user.id;
                            const avatarURL = user.displayAvatarURL({ extension: 'png', dynamic: true });

                            const joined = new EmbedBuilder().setDescription(`**You joined! ❄️**`).setColor("Blue")
                            const already = new EmbedBuilder().setDescription(`**You are already in! ✅**`).setColor("Red")
                            const gamestarted = new EmbedBuilder().setDescription(`**Game already started**`).setColor("Red")

                            if (!data.playerNames.has(userId)) {

                                data.snowplayers.add(userName);
                                //Get members and devide them to two clans
                                if (data.defenders.size <= data.attackers.size) {
                                    data.defenders.set(userId, userName);
                                    data.defendersnames.set(userId, userName);
                                } else {
                                    data.attackers.set(userId, userName);
                                    data.attackersnames.set(userId, userName);
                                }
                                data.points.set(userId, 0);
                                data.players.push(userId);
                                data.playerNames.set(userId, userName);
                                data.profilePics.set(userId, avatarURL);

                                playersCount++;
                                await interaction.reply({ embeds: [joined], ephemeral: true });
                                updateCounterbed();

                            } else if (data.playerNames.has(userId)) {
                                await interaction.reply({ embeds: [already], ephemeral: true });
                            } else if (data.gamesnow) {
                                await interaction.reply({ embeds: [gamestarted], ephemeral: true });
                            }
                        } else {
                            interaction.reply({ embeds: [cantstart], ephemeral: true })
                        }
                    }
                };
                client.on('interactionCreate', handleButtonClick);
            }
        } catch (err: any) {
            console.log('Err at /events/mg.ts/createsnow()');
            console.log(err);
            errHandler(err, mg);
        }
    }
};

export const cycle = async (mg: Message) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
        await delay(7000);
        remainor(mg)

        await delay(3500);
        drawAvatarsAndSendData(mg);

    } catch (err: any) {
        console.log('Err at /utlis/SFunction.ts/cycle()');
        console.log(err);
        errHandler(err, mg);
    }
}

function remainor(mg: Message) {
    const channelId = mg.channel
    const data = snowevent2.get(mg.channel.id)
    const attackers: string[] = [];
    const defenders: string[] = [];

    if (data.attackers && data.defenders) {

        data.attackersnames.forEach((attackersname) => {
            attackers.push(attackersname);
        });
        data.defendersnames.forEach((defendersname) => {
            defenders.push(defendersname);
        });
        const warremainingMessage = "```" + "\n" + attackers.join("\n") + "\n" + "```";
        const remainingMessage = "```" + "\n" + defenders.join("\n") + "\n" + "```";

        const stoppick = new EmbedBuilder()
            .setDescription(`### Teams are created`).setColor("Aqua")

        const warembed = new EmbedBuilder()
            .setTitle(`${data.attackers.size} Attackers remaining`)
            .setDescription(warremainingMessage).setColor("DarkBlue");

        const embed = new EmbedBuilder()
            .setTitle(`${data.defenders.size} Defenders remaining`)
            .setDescription(remainingMessage).setColor("Blue");

        const channel = channelId as TextChannel;
        channel.send({ embeds: [stoppick, embed, warembed] });
    }
}

export function sendwariors(mg: Message) {
    const channelId = mg.channel
    const data = snowevent2.get(mg.channel.id)
    const attackers: string[] = [];
    const defenders: string[] = [];

    if (data.attackers.size >= 1 && data.defenders.size >= 1) {

        data.attackersnames.forEach((attackersname) => {
            attackers.push(attackersname);
        });
        data.defendersnames.forEach((defendersname) => {
            defenders.push(defendersname);
        });
        const warremainingMessage = "```" + "\n" + attackers.join("\n") + "\n" + "```";
        const remainingMessage = "```" + "\n" + defenders.join("\n") + "\n" + "```";

        const warembed = new EmbedBuilder()
            .setTitle(`${data.attackers.size} Attackers remaining`)
            .setDescription(`**Still attacking** ${warremainingMessage}`).setColor("DarkBlue");

        const embed = new EmbedBuilder()
            .setTitle(`${data.defenders.size} Defenders remaining`)
            .setDescription(`**Still attacking** ${remainingMessage}`).setColor("Blue");

        const channel = channelId as TextChannel;
        channel.send({ embeds: [embed, warembed] });

    } else if (data.attackers.size >= 1 && data.defenders.size === 0) {

        data.attackersnames.forEach((attackersname) => {
            attackers.push(attackersname);
        });

        const warremainingMessage = "```" + "\n" + attackers.join("\n") + "\n" + "```";

        const warembed = new EmbedBuilder()
            .setTitle(`${data.attackers.size} Attackers remaining!!!`)
            .setDescription(`**Still attacking** ${warremainingMessage}`).setColor("DarkBlue");

        const channel = channelId as TextChannel;
        channel.send({ embeds: [warembed] });
    } else if (data.attackers.size === 0 && data.defenders.size >= 1) {

        data.defendersnames.forEach((defendersname) => {
            defenders.push(defendersname);
        });
        const remainingMessage = "```" + "\n" + defenders.join("\n") + "\n" + "```";

        const embed = new EmbedBuilder()
            .setTitle(`${data.defenders.size} Defenders remaining!!!`)
            .setDescription(`**Still attacking** ${remainingMessage}`).setColor("Blue");

        const channel = channelId as TextChannel;
        channel.send({ embeds: [embed] });
    }
}