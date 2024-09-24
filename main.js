//* STATIC *\\
const { Client, GatewayIntentBits } = require('discord.js');
const readline = require('readline');
const gradient = require('gradient-string');
const fs = require('fs');
const bin = './bin';
gradient.white = gradient(['#ffffff', '#ffffff'])
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '    '
});
require('dotenv').config();

//* VARIABLES *\\
let TOKEN = process.env.TOKEN;
let CHANNEL_ID = 'TALKITY_NO_CHANNEL_SET';

//* MAIN *\\
client.once('ready', () => {
    const filePath = `${bin}/ascii.msg`;
    fs.readFile(filePath, 'utf8', (err, data) => {
        console.log('\n\n');
        console.log(gradient(['#569c6d', '#30e36b'])(data));
        console.log('\n\n');
        console.log(gradient.white(`    Version 0.2.0 || Build: x1020`));
        console.log(gradient.white(`    Logged in as ${client.user.username}`));
        console.log(gradient.white('    Run $cmds to see available commands'))
        rl.prompt();
    });

    

    rl.on('line', (message) => {
        if (message === '$cmds') {
            console.log(gradient.white(`    Available Commands:
    - $cmds || View the available commands.
    - $setchannel || Set the channel used to send text in to another channel using Discord Channel IDs.`))
            rl.prompt();
        } else if (message.startsWith('$setchannel')) {
            const NCI = message.split(' ')[1];
            if (NCI && /^\d+$/.test(NCI)) {
                CHANNEL_ID = NCI;
                console.log(gradient.white(`    Channel ID has been set to ${NCI}`));
                rl.prompt();
            } else {
                console.log(gradient.white(`    Invalid Channel ID. {EXPECTED-FULL-DIGITS}`));
                rl.prompt();
            }
        } else {
            if (CHANNEL_ID === 'TALKITY_NO_CHANNEL_SET') {
                console.log(gradient.white('    Edit the channel id by doing $setchannel {ID}'))
                rl.prompt();
                return;
            }

            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                channel.send(message)
                    .then(() => {
                        rl.prompt();
                    })
                    .catch(err => {
                        console.error('    Error sending message: ', err);
                        rl.prompt();
                    });
            } else {
                console.log(gradient.white(`    Channel not found, does the bot have access to it?`));
                rl.prompt();
            }
        }
    })
});

//* LOGIN *\\
client.login(TOKEN);
