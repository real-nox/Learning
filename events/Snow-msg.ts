import { Client, PermissionFlagsBits } from "discord.js"
import { snowstart } from "../chistimas/CoreSnow";
import { Emitter, Ranox, normalroles, rolepermited, superiorsroles } from "../configs/roles";
import { errHandler } from "../configs/error"
import { reactor } from "../configs/configurations";

let serveridtouse1: string = ""
let channeltoreact1: string = ""
const kerfuffle = "1165651523636834374"
let auto_redirector = false
export const createsnow = (client: Client) => {
    client.on("messageCreate", async (mg) => {
        try {
            //Check
            if (!mg.member) return;
            if (mg.author.bot) return; //Bot return 
            if (!mg.content.startsWith("ksnow-")) return;

            if (mg.channel.id !== kerfuffle) {
                const SuperiorRole = mg.member.roles.cache.find(role => superiorsroles.includes(role.id));
                const NormalRole = mg.member.roles.cache.find(role => normalroles.includes(role.id));

                if ((!mg.member?.permissions.has(PermissionFlagsBits.ViewChannel) && !SuperiorRole || !NormalRole || !rolepermited) && mg.member.id !== Emitter && mg.member.id !== Ranox) { throw new Error("Role or permission is missing. You can't use this command!"); }
            } else if (mg.channel.id === kerfuffle) {
                auto_redirector = true
            }

            //Cmd Parm
            const args: string[] = mg.content.split(" ");
            const snow: string = args[1];
            if (!snow) throw new Error("Format isn't correct! You may stick to the bot's commands!");

            //Cmds
            switch (snow.toLowerCase()) {
                case "start": case "s":
                    if (mg.member.roles.cache.find(role => (normalroles.includes(role.id)) || (rolepermited.includes(role.name))) || mg.member.id === Emitter || mg.member.id === Ranox || auto_redirector) {
                        serveridtouse1 = mg.guild.id
                        channeltoreact1 = mg.channel.id
                        return await snowstart(mg)
                    } else {
                        reactor(mg)
                        throw new Error("Role is missing. You can't use this command!");
                    }
            }
        } catch (err: any) {
            console.log("Err at /events/mg.ts/createsnow()");
            console.log(err);
            errHandler(err, mg);
        }
    })
}
export { serveridtouse1, channeltoreact1 }
