var express = require('express');
var router = express.Router();
// Include config files that are in gitignore
var config = require('../config/config');
// Include mysql module so that node can talk to sql
var mysql = require('mysql');
// Set up a connection variable to use over and over
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

// After this line runs, we will have a valid connectino to MySQL
connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	var getImagesQuery = "SELECT * FROM images";
	connection.query(getImagesQuery, (error, results, fields)=>{
		// res.json(results);
		// grab a random image from the results
		var randomIndex = (Math.floor(Math.random() * results.length));
		// res.json(results[randomIndex]);
		res.render('index', { 
			title: 'Rate the Cars',
			imageToRender: '/images/'+results[randomIndex].imageUrl,
			imageID: results[randomIndex].id
		});		
	})
});

router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
	// res.json(req.params.imageID);
	var imageID = req.params.imageID;
	var voteD = req.params.voteDirection;
	var insertVoteQuery = "INSERT INTO votes (ip, imageId, voteDirection) VALUES ('"+req.ip+"',"+imageID+",'"+voteD+"')"
	res.send(insertVoteQuery);
});

router.get('/standings', function(req, res, next) {
  res.render('standings', { title: 'Standings' });
});

module.exports = router;