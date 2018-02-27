var express = require('express');
var router = express.Router();
let apiai = require('apiai');
let consts = require('../constants');
let ai = apiai(consts.APIAI_CLIENT, consts.APIAI_DEVELOPER);
let cors = require('cors');
router.use(cors({ methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' }));

/*
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/

/* create a message for the bot. */
router.post('/', function(req, res, next) {
	// ask something
	//ask('<Your text query>')
	let message = req.body.message;
	console.log(message);
	ask(message)
		.then(response => {
			let ful = response.result.fulfillment;
			let answer = {};
			(typeof ful.displayText !== 'undefined') ? answer.answer = ful.displayText : answer.answer = ful.speech;
			console.log(answer);
			res.send(answer);
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
			//console.log(response);
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
