const fs = require('fs');
const express = require('express');
const app = express();

app.get('/static-apk/:version/:name', (req, res) => {
	const exist = fs.existsSync(`${__dirname}/public/${req.params.version}/${req.params.name}`);
	console.log(`${__dirname}/public/${req.params.version}/${req.params.name} ${exist ? 'existed' : 'not existed'}`);

	if (fs.existsSync(`${__dirname}/public/${req.params.version}/${req.params.name}`)) {
		const options = {
			root: __dirname + '/public/' + req.params.version,
			dotFiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			},
		};

		const fileName = req.params.name;
		res.sendFile(fileName, options, (err) => {
			if (err) console.log(err);
			else console.log(`Sent: ${req.params.version}/${fileName}`);
		});
	} else {
		res.send('File not found!');
	}
});

app.listen(3000, (req, res) => {
	console.log('Server is listening at port 3000');
});
