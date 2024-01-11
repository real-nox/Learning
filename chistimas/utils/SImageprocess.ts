import { createCanvas, loadImage } from "canvas";
import path from "path";
import { snowevent2 } from "../CoreSnow";
import { AttachmentBuilder, EmbedBuilder, Message, TextChannel } from "discord.js";
import { client } from "../../central";

export const CombineTwoImages = async (mg: Message, user1: string, user2: string, channelId: string, killMessage: string) => {
    const data = snowevent2.get(mg.channel.id)
    try {
        const blue = "#206694"
        const frame = await loadImage(path.join(__dirname, '..', 'img', "dual.png"));
        const overlay_frame = await loadImage(path.join(__dirname, '..', 'img', "frame2.png"));
        const vsOverlay = await loadImage(path.join(__dirname, '..', 'img', "vs.png"));

        const pfp1 = await loadImage(data.profilePics.get(user1));
        const pfp2 = await loadImage(data.profilePics.get(user2));

        const finalImage = createCanvas(frame.width, frame.height);
        const ctx = finalImage.getContext('2d');

        ctx.drawImage(frame, 0, 0);
        ctx.drawImage(pfp1, 90, 300, 400, 400);
        ctx.drawImage(pfp2, 600, 300, 400, 400);
        ctx.drawImage(overlay_frame, 0, 0)
        ctx.drawImage(vsOverlay, 140, 150, 800, 800)

        const buffer = finalImage.toBuffer('image/png');
        const channel = mg.channel as TextChannel | undefined;
        if (channel) {
            send(buffer, killMessage, channelId, blue)
        } else {
        }
    } catch (err) {
        console.log(err)
    }
}

export const CombineOneImageSingle = async (mg: Message, userId: string, channelId: string, killMessage: string) => {
    CombineOneImage(mg, userId, channelId, false, killMessage, 0, 0, 0)
}

export const CombineOneImageWin = async (mg: Message, userId: string, channelId: string, kills: number, wins: number) => {
    CombineOneImage(mg, userId, channelId, true, "", kills, wins, 0)
}

export const CombineOneImageWinWithTreator = async (mg: Message, userId: string, channelId: string, kills: number, wins: number, treator: number) => {
    CombineOneImage(mg, userId, channelId, true, "", kills, wins, 1)
}

export const CombineOneImage = async (mg: Message, userId: string, channelId: string, isWinner: boolean, killMessage: string, kills: number, wins: number, treator: number) => {
    const data = snowevent2.get(mg.channel.id)
    try {
        const randomi = "#3498DB"
        const frame = await loadImage(path.join(__dirname, '..', 'img', isWinner ? 'winner.png' : 'single.png'));
        const overlayFrame = await loadImage(path.join(__dirname, '..', 'img', 'frame1.png'));
        const pfp = await loadImage((data.profilePics.get(userId)));

        const finalImage = createCanvas(frame.width, frame.height);
        const ctx = finalImage.getContext('2d');

        ctx.drawImage(frame, 0, 0);
        ctx.drawImage(pfp, 260, 245, 550, 550);
        ctx.drawImage(overlayFrame, 0, 0);

        const buffer = finalImage.toBuffer('image/png');
        if (isWinner) {
            if (data.attackers.size > 0 && data.defenders.size === 0) {
                if (treator === 0) {
                    const embed = new EmbedBuilder()
                        .setTitle('Winner!').setColor("Gold")
                        .setDescription(`:tada: <@${userId}> from **Attackers** won this game! \n` +
                            `:skull: **Total kills:** \`${kills}\` \n` +
                            `❄️: **Total Snowballs**: \`${((kills + 1) * 10) * 10}\` \n` +
                            `:trophy: **Total wins:** \`${wins}\``);

                    const file = { attachment: buffer, name: 'winner.png' };
                    const channel = mg.channel as TextChannel;

                    await channel.send({ embeds: [embed], files: [file] });
                    return;
                } else if (treator === 1) {
                    const embed = new EmbedBuilder()
                        .setTitle('Winner!').setColor("DarkGold")
                        .setDescription(`:tada: <@${userId}> from **Attackers** betrayed their friends and won this game! \n` +
                            `:skull: **Total kills:** \`${kills}\` \n` +
                            `❄️: **Total Snowballs**: \`${(kills + 1) * 10}\` \n` +
                            `:trophy: **Total wins:** \`${wins}\``);

                    const file = { attachment: buffer, name: 'winner.png' };
                    const channel = mg.channel as TextChannel;

                    await channel.send({ embeds: [embed], files: [file] });
                    return;
                }
            } else if (data.defenders.size > 0 && data.attackers.size === 0) {
                if (treator === 0) {
                    const embed = new EmbedBuilder()
                        .setTitle('Winner!').setColor("Gold")
                        .setDescription(`:tada: <@${userId}> from **Defenders** won this game! \n` +
                            `:skull: **Total kills:** \`${kills}\` \n` +
                            `❄️: **Total Snowballs**: \`${(kills + 1) * 10}\` \n` +
                            `:trophy: **Total wins:** \`${wins}\``);

                    const file = { attachment: buffer, name: 'winner.png' };
                    const channel = mg.channel as TextChannel;

                    await channel.send({ embeds: [embed], files: [file] });
                    return;
                } else if (treator === 1) {
                    const embed = new EmbedBuilder()
                        .setTitle('Winner!').setColor("DarkGold")
                        .setDescription(`:tada: <@${userId}> from **Defenders** betrayed their friends and won this game! \n` +
                            `:skull: **Total kills:** \`${kills}\` \n` +
                            `❄️: **Total Snowballs**: \`${(kills + 1) * 10}\` \n` +
                            `:trophy: **Total wins:** \`${wins}\``);

                    const file = { attachment: buffer, name: 'winner.png' };
                    const channel = mg.channel as TextChannel;

                    await channel.send({ embeds: [embed], files: [file] });
                    return;
                }
            }
        } else {
            send(buffer, killMessage, channelId, randomi);
        }
    } catch (err) {
        console.log(err)
    }
}
function getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

export function randomChance(one_in: number): boolean {
    if (one_in === 1) {
        return true;
    }

    if (one_in === 0) {
        return false;
    }

    const randomValue = getRandomInt(one_in);
    if (randomValue === 1) {
        return true;
    }

    return false;
}

export const send = async (fileName: Buffer, killMessage: string, channelId: string, color): Promise<void> => {
    const file = new AttachmentBuilder(fileName);

    const channel = await client.channels.fetch(channelId) as TextChannel;
    if (channel) {
        const embed = new EmbedBuilder().setDescription(`**${killMessage}**`).setColor(color);
        await channel.send({ embeds: [embed], files: [file] });
    }
}