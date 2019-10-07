const admin = require('firebase-admin');

const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.sendMessage = function sendMessage(option) {
    console.log('Sending message: ' + JSON.stringify(option));
    const command = option.command;
    let message;
    const firebaseTopic = option.topic;
    switch (command) {
        case "load_patch":
            message = {
                data: {
                    command: command,
                    domain: option.domain
                },
                topic: firebaseTopic
            };
            break;
        case "clean_patch":
            message = {
                data: {
                    command: command,
                },
                topic: firebaseTopic
            };
            break;
        case "kill_process":
            message = {
                data: {
                    command: command,
                },
                topic: firebaseTopic
            };
            break;
        case "load_library":
            message = {
                data: {
                    command: command,
                },
                topic: firebaseTopic
            };
            break;
    }

    admin.messaging().send(message)
        .then(response => {
            console.log("Send message success: " + response);
            process.exit(1);
        })
        .catch(error => {
            console.error("Error sending message: " + error);
            process.exit(1);
        });
};