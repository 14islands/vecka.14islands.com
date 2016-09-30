var express = require('express');
var router = express.Router();

var weeks = require('./../public/javascripts/lib/weeks');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		weeks: weeks.getList()
	});
});

module.exports = router;
