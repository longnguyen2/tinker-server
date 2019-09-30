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
                notification: {
                    title: 'Load new patch',
                    body: 'A new patch is available and automatically updated'
                },
                data: {
                    command: command,
                    domain: option.domain
                },
                topic: firebaseTopic
            };
            break;
        case "clean_patch":
            message = {
                notification: {
                    title: 'Clean patch',
                    body: 'Clean app patch and reverse to original app'
                },
                data: {
                    command: command,
                },
                topic: firebaseTopic
            };
            break;
        case "kill_process":
            message = {
                notification: {
                    title: 'Kill app',
                    body: 'This app process is being killed'
                },
                data: {
                    command: command,
                },
                topic: firebaseTopic
            };
            break;
        case "load_library":
            message = {
                notification: {
                    title: 'Load library',
                },
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