#!/usr/bin/env node

const yargs = require('yargs');
const sendMessage = require('./send-message').sendMessage;
const buildPatch = require('./build-patch').buildPatch;

const { argv } = yargs
    .usage('Usage: patch <options>')
    .env(true)
    .option('c', {
        alias: 'command',
        describe: 'Commands include: load_patch, clean_patch, load_library, kill_process'
    })
    .option('u', {
        alias: 'url',
        describe: 'Public APK url required for load_patch message'
    })
    .option('build', {
        describe: 'Require build apk first before patching'
    })
    .option('p', {
        alias: 'project',
        describe: 'Android project path'
    })
    .option('s', {
        alias: 'source',
        describe: 'Source apk path. If not specified, the apk file from originalBuild directory will be used'
    })
    .boolean('build')
    .help('help', 'Show this help and exit');

if (argv.command || argv.build) {
    if (argv.build) {
        if (argv.project) {
            const buildSuccess = buildPatch(argv.project, argv.source);
            if (!buildSuccess) {
                process.exit(1);
            }
        } else {
            console.error("Build option requires project path");
            process.exit(1);
        }
    }
    if (argv.command) {
        const commands = ['load_patch', 'clean_patch', 'load_library', 'kill_process'];
        if (commands.includes(argv.command)) {
            if (argv.command === 'load_patch' && argv.url === undefined) {
                console.error('Command load_patch requires specifying url argument');
                process.exit(1);
            }
            sendMessage({command: argv.command, url: argv.url});
        } else {
            console.error('Invalid command: ' + argv.command);
            process.exit(1);
        }
    }
} else {
    yargs.showHelp();
    console.error('Need at least 1 in 2 options: command or build');
    process.exit(1);
}
