var moment = require('moment');

// Constructor
function Week(weekIndex) {
  moment.locale('sv');
  this.index = weekIndex || 0;
  this.current = moment().add(this.index, 'weeks');
};

Week.prototype.isTodaysWeek = function() {
  return this.current.isSame(moment(), 'w');
};

Week.prototype.getIndex = function() {
  return this.index;
};

Week.prototype.formatDate = function(date) {
  if (date.isSame(moment(), 'y')) {
    return date.format("dddd, MMM D");
  }
  return date.format("dddd, MMM D YYYY");
};

Week.prototype.getNumber = function() {
  return this.current.isoWeek();
};

Week.prototype.getDayText = function() {
  var startDayOfWeek = this.current.clone().startOf('isoweek');
	var endDayOfWeek =  this.current.clone().endOf('isoweek');
  return (this.formatDate(startDayOfWeek) + ' - ' + this.formatDate(endDayOfWeek))
};

module.exports =  Week;
