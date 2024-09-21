// Yes, I am aware the code looks shit and not clean at all.
// Give me some time for the next update, as I wrote this in 30 minutes while watching a movie at 4 AM.

const { Client, GatewayIntentBits } = require('discord.js');
const readline = require('readline');
const gradient = require('gradient-string');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '    '
});
let TOKEN = '';
let CHANNEL_ID = '';

// Getting TOKEN
try {
    TOKEN = fs.readFileSync('./bin/TOKEN.cfg', 'utf8').trim();
} catch (err) {
    process.exit(1)
}

if (TOKEN.startsWith('TOKEN')) {
    console.log('');
    console.log(gradient(['#e02e2b', '#e02e2b'])(`    Edit bin/TOKEN.cfg with your bots token in order for it to work!`));
    return;
}

client.once('ready', () => {
    const x = `
    88888888888       888 888      d8b 888             
        888           888 888      Y8P 888             
        888           888 888          888             
        888   8888b.  888 888  888 888 888888 888  888 
        888      "88b 888 888 .88P 888 888    888  888 
        888  .d888888 888 888888K  888 888    888  888 
        888  888  888 888 888 "88b 888 Y88b.  Y88b 888 
        888  "Y888888 888 888  888 888  "Y888  "Y88888 
                                                   888 
                                              Y8b d88P 
                                               "Y88P"  
`;
    console.log(gradient(['#569c6d', '#30e36b'])(x));
    console.log(gradient(['#ffffff', '#ffffff'])(`    Version 1.0.0`));
    console.log(gradient(['#ffffff', '#ffffff'])(`    Logged in as ${client.user.username}`));
    console.log(gradient(['#ffffff', '#ffffff'])(`    Type cmds to view the available commands.`));
    rl.prompt()

    rl.on('line', (message) => {
        if (message.startsWith('cmds')) {
            console.log('    ');
            console.log(gradient(['#ffffff', '#ffffff'])(`    Available Commands:`));
            console.log(gradient(['#ffffff', '#ffffff'])(`    - cmds :: Display the available commands.`));
            console.log(gradient(['#ffffff', '#ffffff'])(`    - setchannel {ID} :: Uses command to set the channel to send messages in.`));
            rl.prompt();
        } else if (message.startsWith('setchannel')) {
            const NCI = message.split(' ')[1];
            if (NCI && /^\d+$/.test(NCI)) {
                CHANNEL_ID = NCI;
                console.log(gradient(['#ffffff', '#ffffff'])(`    Channel ID has been set to ${NCI}`));
                rl.prompt();
            } else {
                console.log(gradient(['#ffffff', '#ffffff'])(`    Invalid Channel ID. {EXPECTED-FULL-DIGITS}`));
                rl.prompt();
            }
        } else {
            if (CHANNEL_ID === '') {
                console.log(gradient(['#ffffff', '#ffffff'])(`    CHANNEL_ID[BOOL] is a blank value, use setchannel command to set the channel.`));
                rl.prompt();
                return
            }

            const channel = client.channels.cache.get(CHANNEL_ID);
            if (channel) {
                channel.send(message)
                    .then(() => {
                        rl.prompt();
                    })
                    .catch(err => {
                        console.error('Error sending message: ', err);
                    });
            } else {
                console.log(gradient(['#ffffff', '#ffffff'])(`    Channel not found, does the bot have access to it?`));
                rl.prompt();
            }
        };
    });
})

client.login(TOKEN);
