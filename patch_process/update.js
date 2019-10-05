#!/usr/bin/env node
const path = require('path');
function usage() {
    const help = `Usage: update <topic>
    topic: firebase topic`;

    console.log(help);
}
if (process.argv[process.argv.length - 1].includes(path.join(__dirname, 'update'))) {
    console.error('Require topic argument');
    usage();
    process.exit(1);
} else {
    const sendMessage = require('./send-message').sendMessage;
    const config = require('./config').config;
    const topic = process.argv[process.argv.length - 1];

    sendMessage({command: 'load_patch', domain: config.domain, topic: topic});
}