# Tinker server implementation
## Setup
1 This is a node server so first of all run `npm install` to download required packages.  
    If you dont have npm then install nodejs before continue.
    
2 Inside <b>patch_process</b> folder, rename <b>config.template.js</b> to <b>config.js</b> and config with your own info
For example:
```javascript 1.6
exports.config = {
    domain: "https://gigasource.localtunnel.me", // public domain of your hosting server
    topic: "instagramPatching" // firebase topic that communicates with android device
};
```
3 You have to generate a private key file for your service account  
- In the Firebase console, open <b>Settings</b> > [Service Accounts](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
- Click <b>Generate New Private Key</b>, then confirm by clicking </b>Generate Key</b>
- Rename the downloaded file to <b>service-account-file.json</b> and put it in <b>patch_process</b> folder
<img src="https://i.imgur.com/UUV4hP5.png" />

