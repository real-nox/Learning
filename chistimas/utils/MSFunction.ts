import { Message } from "discord.js";
import { sendwariors, snowevent2 } from "../CoreSnow";
import { CombineOneImageSingle, CombineOneImageWin, CombineOneImageWinWithTreator, CombineTwoImages, randomChance } from "./SImageprocess";
import { getDeathMessageDuel, getDeathMessageSingle } from "./Text_Fcts";

export const drawAvatarsAndSendData = async (mg: Message) => {
    const channelId = mg.channel.id
    const data = snowevent2.get(mg.channel.id)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const gameLoop = async () => {
        try {
            while (data.players.length > 1) {
                if (data.players.length > 1) {
                    function generatenormaltime() {
                        return Math.floor(
                            Math.random() * (5 * 1000 - 10000 + 1) + 20000
                        );
                    }
                    const timer = generatenormaltime()

                    if (data.players.length % 10 == 0 || data.players.length == 4) {
                        sendwariors(mg)
                        await delay(5000);
                    }
                    if (randomChance(5) || data.players.length == 3) {
                        //Single
                        console.log("Single")
                        const killedId: string = data.players[Math.floor(Math.random() * data.players.length)];
                        const killedName: string | undefined = data.playerNames.get(killedId);


                        getDeathMessageSingle(killedName)
                            .then((deathMessage) => {
                                CombineOneImageSingle(mg, killedId, channelId, deathMessage)
                                setTimeout(() => {
                                    // Remove the killed player from various data structures
                                    if (data.attackers.has(killedId)) {
                                        data.attackers.delete(killedId);
                                        data.attackersnames.delete(killedId)
                                    } else if (data.defenders.has(killedId)) {
                                        data.defenders.delete(killedId);
                                        data.defendersnames.delete(killedId)
                                    }
                                    data.snowplayers.delete(killedId);
                                    data.players = data.players.filter(playerId => playerId !== killedId);
                                    data.playerNames.delete(killedId);
                                    data.profilePics.delete(killedId);
                                }, 3000)
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                        await delay(timer);
                    } else {
                        //Dual
                        console.log("Dual")
                        let killerId: string;
                        let killedId: string;
                        let killerName: string | undefined;
                        let killedName: string | undefined;

                        do {
                            killerId = data.players[Math.floor(Math.random() * data.players.length)];
                            killerName = data.playerNames.get(killerId);

                            killedId = data.players[Math.floor(Math.random() * data.players.length)];
                            killedName = data.playerNames.get(killedId);
                            console.log("In here: killerName " + killerName + " killedName " + killedName);
                        } while (killerId === killedId);

                        getDeathMessageDuel(killerName, killedName)
                            .then((killMessage) => {
                                CombineTwoImages(mg, killerId, killedId, channelId, killMessage);
                                setTimeout(() => {
                                    if (data.attackers.has(killerId) && data.attackers.has(killedId)) {
                                        console.log(`${killerId} and ${killedId} are both attackers!`);
                                        data.treator.set(killerId, 1)
                                    } else if (data.defenders.has(killerId) && data.defenders.has(killedId)) {
                                        console.log(`${killerId} and ${killedId} are both defenders!`);
                                        data.treator.set(killerId, 1)
                                    }
                                    // Remove the killed player from various data structures
                                    if (data.attackers.has(killedId)) {
                                        data.attackers.delete(killedId);
                                        data.attackersnames.delete(killedId)
                                    } else if (data.defenders.has(killedId)) {
                                        data.defenders.delete(killedId);
                                        data.defendersnames.delete(killedId)
                                    }
                                    data.snowplayers.delete(killedId);
                                    data.players = data.players.filter((playerId) => playerId !== killedId);
                                    data.playerNames.delete(killedId);
                                    data.profilePics.delete(killedId);

                                    // Add point
                                    if (data.points.has(killerId)) {
                                        data.points.set(killerId, data.points.get(killerId)! + 1);
                                    } else {
                                        data.points.set(killerId, 1);
                                    }
                                }, 4000);
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                        await delay(timer);
                    }
                }
                console.log(data.defenders.size, data.attackers.size)
            }
            await delay(1000);
            if (data.players.length === 1) {
                //Winner
                console.log("Winner")
                const winnerId: string | undefined = data.players.values().next().value
                console.log(`Winnerid = ${winnerId}`)
                if (!winnerId) {
                    console.error('No winner found.');
                    return;
                }
                let previousWins: number
                previousWins = 1;
                let treator: number
                treator = 1

                const winnerTreator = data.treator.get(winnerId);

                if (winnerTreator === 1) {
                    await CombineOneImageWinWithTreator(mg, winnerId, channelId, data.points.get(winnerId), previousWins, treator);
                } else {
                    await CombineOneImageWin(mg, winnerId, channelId, data.points.get(winnerId), previousWins);
                }
                data.snowplayers.delete(winnerId);
                snowevent2.delete(channelId)
                await delay(5000);
                return;
            }
        } catch (err) {
            console.log(err)
        }

    }
    console.log("Time to write the history")
    gameLoop();
}