const fs = require('fs');
const express = require('express');
const app = express();

app.get('/static-apk/:topic/:version/:name', (req, res) => {
	const filePath = `${req.params.topic}/${req.params.version}/${req.params.name}`;
	const exist = fs.existsSync(`${__dirname}/public/${filePath}`);
	console.log(`${__dirname}/public/${filePath} ${exist ? 'existed' : 'not existed'}`);

	if (fs.existsSync(`${__dirname}/public/${filePath}`)) {
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
			else console.log(`Sent: ${filePath}`);
		});
	} else {
		res.send('File not found!');
	}
});

app.listen(3000, (req, res) => {
	console.log('Server is listening at port 3000');
});
