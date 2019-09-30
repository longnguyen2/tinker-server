#!/usr/bin/env node

const sendMessage = require('./send-message').sendMessage;
const config = require('./config').config;

sendMessage({command: 'load_patch', domain: config.domain, topic: config.topic});