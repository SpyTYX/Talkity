//* STATIC *\\
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const readline = require('readline');
const gradient = require('gradient-string');
const fs = require('fs').promises;
require('dotenv').config();

const bin = './bin';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '    '
});

//* COLOUR CODING *\\
gradient.white = gradient(['#ffffff', '#ffffff']);
gradient.error = gradient(['#e0443f', '#e0443f']);

//* ENVIRONMENT *\\
let TOKEN = process.env.TOKEN;
let VERSION = process.env.VERSION;
let BUILD = process.env.BUILD;
let CHANNEL_ID = 'TALKITY_NO_CHANNEL_SET';
let cache = null;

//* STATIC FUNCTIONS *\\
async function start() {
    try {
        const data = await fs.readFile(`${bin}/ascii.msg`, 'utf8');
        console.log(gradient(['#569c6d', '#30e36b'])(data));
        console.log(gradient.white(`    Version ${VERSION} || Build: ${BUILD}`));
        console.log(gradient.white(`    Logged in as ${client.user.username}`));
        console.log(gradient.white('    Run $cmds to see available commands'));
    } catch (err) {console.log(gradient.error(`    Failed to run function: sync.func(start[]), Details:\n${err}`))};
};

function setChannel(id) {
    if (/^\d+$/.test(id)) {
        CHANNEL_ID = id;
        cache = client.channels.cache.get(CHANNEL_ID);
        console.log(gradient.white(`    Channel ID has been set to ${id}`));
    } else {console.log(gradient.white(`    Oops! A Discord Channel ID can not contain any letters, did you make a typo?`))}
}

async function message(message) {
    if (!cache) {
        console.log(gradient.white(`    Channel Cache is clear, have you used $setchannel yet?`));
        return;
    }
    try {await cache.send(message)} catch (err) {console.error('    Error sending message:', err)}
}

//* MAIN *\\
client.once('ready', async () => {
    process.stdout.write(`\x1b]2;Talkity BETA ${VERSION} - ${BUILD}\x07`);
    await start();
    rl.prompt();

    rl.on('line', (input) => {
        const trimmedInput = input.trim();
        const [command, ...args] = trimmedInput.split(' ');

        switch (command) {
            case '$cmds':
                console.log(gradient.white(`    Available Commands:
    - $cmds        || View the available commands.
    - $info        || Displays the information about the application including Build and Version.
    - $setchannel  || Set the channel used to send text using Discord Channel IDs.`));
                break;

            case '$setchannel':
                setChannel(args[0]);
                break;

            case '$info':
                console.log(gradient.white(`
    Talkity BETA
    Version ${VERSION}
    Build ${BUILD}
    
    Made by moonzy.dev with a sprinkle of love and hatred.
                `))
                break;

            default:
                if (CHANNEL_ID === 'TALKITY_NO_CHANNEL_SET') {
                    console.log(gradient.white('    Set a channel first using $setchannel {ID}'));
                } else {
                    message(trimmedInput);
                }
                break;
        }

        rl.prompt();
    });
});

//* LOGIN *\\
if (TOKEN) {
    client.login(TOKEN).catch(err => {
        console.error('    There was an error while logging into your Discord Bot, Details:\n', err);
    });
} else if (TOKEN === 'TOKEN_HERE') {
    console.error(`    You must edit the .env file's TOKEN value to login to your Discord Bot!`);
}
