var express = require('express');
var router = express.Router();
let apiai = require('apiai');
let consts = require('../constants');
let ai = apiai(consts.APIAI_CLIENT, consts.APIAI_DEVELOPER);

/* create a message for the bot. */
router.post('/', function(req, res, next) {
	// ask something
	//ask('<Your text query>')
	ask('Who is the president of china?')
		.then(response => {
			//console.log(response);
			res.send(response);
		}).catch(error => {
			//console.log(error)
			res.send(error);
		});
	
/*
	// get list of all intents
	getAllIntents()
		.then(intents => {
			console.log(intents);
		}).catch(error => {
			console.log(error)
		});
		*/
});

function ask(text, options) {
	return new Promise((resolve, reject) => {
		var defaultOptions = {
			sessionId: '44jjd883', // use any arbitrary id - doesn't matter
		};

		let request = ai.textRequest(text, Object.assign(defaultOptions, options));

		request.on('response', (response) => {
			return resolve(response);
		});

		request.on('error', (error) => {
			return reject(error);
		});

		request.end();
	})
}

/*
function getAllIntents(options) {
	return new Promise((resolve, reject) => {
		let request = ai.intentGetRequest(options);

		request.on('response', (response) => {
			return resolve(response);
		});

		request.on('error', (error) => {
			return reject(error);
		});

		request.end();
	})
}
*/

module.exports = router;
