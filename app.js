const fs = require('fs');
const md5 = require('md5');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/static-apk/:topic/:version/:name', (req, res) => {
	const apkPath = `${__dirname}/public/${req.params.topic}/${req.params.version}/${req.params.name}`;
	const exist = fs.existsSync(apkPath);
	console.log(`${apkPath} ${exist ? 'existed' : 'not existed'}`);

	if (exist) {
		const options = {
			root: `${__dirname}/public/${req.params.topic}/${req.params.version}`,
			dotFiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			},
		};

		const fileName = req.params.name;
		res.sendFile(fileName, options, (err) => {
			if (err) console.log(err);
			else console.log(`Sent: ${apkPath}`);
		});
	} else {
		res.send('File not found!');
	}
});

app.get('/md5/:topic/:version/:name', (req, res) => {
	const apkPath = `${__dirname}/public/${req.params.topic}/${req.params.version}/${req.params.name}`;
	const exist = fs.existsSync(apkPath);
	if (exist) {
		const buf = fs.readFileSync(apkPath);
		res.status(200).send(md5(buf));
	} else {
		res.status(404).send('File not found!');
	}
});

app.post('/report', (req, res) => {
	const token = req.body.token;
	console.log(`${token} returned a failed result`);
	res.send('Retry patching in 5s');
});

app.get('/', (req, res) => {
	res.end('This is tinker server');
});

app.listen(3000, (req, res) => {
	console.log('Server is listening at port 3000');
});
