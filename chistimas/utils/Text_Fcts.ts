import fs from "node:fs"
import path from "node:path";

export async function getDeathMessageDuel(killerName: string, killedName: string): Promise<string> {
    const filePath = path.join(__dirname, '.', 'texts', 'kill_messages.txt');
    try {
        let txt = fs.readFileSync(filePath).toString();

        let messages = txt.split('\n');

        let length = messages.length;
        let message = messages[Math.floor(Math.random() * length)];

        message = message.replace(/x /g, `__${killedName}__ `).replace(/ x /g, ` __${killedName}__ `).replace(/ y /g, ` __${killerName}__ `).replace(/ y /g, ` __${killerName}__`);

        return message;
    } catch (err: any) {
        console.log(err)
    }
}
export async function getDeathMessageSingle(killedName: string): Promise<string> {
    const filePath = path.join(__dirname, '.', 'texts', 'death_messages.txt');
    try {
        let txt = fs.readFileSync(filePath).toString();

        let messages = txt.split('\n');

        let length = messages.length;
        let message = messages[Math.floor(Math.random() * length)];

        message = message.replace(/x /g, ` __${killedName}__ `).replace(/ x /g, ` __${killedName}__ `);

        return message;
    } catch (err: any) {
        console.log(err)
    }
}