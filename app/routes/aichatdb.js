let express = require('express');
let router = express.Router();

let presidents = {
	'brazil': 'Michel Temer',
	'china': 'Xi Jinping',
	'canada': 'Justin Trudeau',
	'mexico': 'Enrique Peña Nieto',
	'united states of america': 'Donald Trump'
};

/* GET users listing. */
router.post('/', function(req, res, next) {
	let data = req.body;
//	console.log(data.result.parameters);
	let country = data.result.parameters['geo-country'].toLowerCase();
	console.log(country);
	//let response = "Donald Trump";
	let response = presidents[country];
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ 
		// "speech" is the spoken version of the response, "displayText" is the visual version
		"speech": response, 
		"displayText": response
	}));
});

module.exports = router;
