var express = require('express');
var router = express.Router();

var moment = require('moment');

function getFormat (date) {
  if (date.isSame(moment(), 'y')) {
    return date.format("dddd, MMM D");
  }
  return date.format("dddd, MMM D YYYY");
}

/* GET home page. */
router.get('/', function(req, res, next) {
	moment.locale('sv');

	// Read about exact week: http://stackoverflow.com/questions/32120122/difference-between-week-of-year-and-week-of-year-iso-tokens-moment-js
	var currentWeekNumber = moment().isoWeek();
	var startDayOfWeek = moment().startOf('isoweek');
	var endDayOfWeek = moment().endOf('isoweek');

	res.render('index', { 
		weekNumber: currentWeekNumber,
		weekDaysText: (getFormat(startDayOfWeek) + ' - ' + getFormat(endDayOfWeek))
	});
});

module.exports = router;
