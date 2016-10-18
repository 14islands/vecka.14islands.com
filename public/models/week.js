var moment = require('moment');

// Constructor
function Week (weekIndex) {
  moment.locale('sv');
  this.index = weekIndex || 0;
  this.current = moment().add(this.index, 'weeks');
  console.log('index', this.index, this.current.toString())
  this.startDayOfWeek = this.current.clone().startOf('isoweek');
	this.endDayOfWeek =  this.current.clone().endOf('isoweek');
};

Week.prototype.isTodaysWeek = function() {
  return this.current.isSame(moment(), 'w');
};

Week.prototype.formatDate = function(date) {
  return date.format("ddd, MMM Do");
};

Week.prototype.getNumber = function() {
  return this.current.isoWeek();
};

Week.prototype.getStartDayText = function() {
  return this.formatDate(this.startDayOfWeek)
};

Week.prototype.getEndDayText = function() {
  return this.formatDate(this.endDayOfWeek)
};

Week.prototype.getYearText = function() {
  if (this.startDayOfWeek.isSame(this.endDayOfWeek, 'y')) {
    return this.startDayOfWeek.format("YYYY");
  }
  return this.startDayOfWeek.format("YYYY") + ' - ' + this.endDayOfWeek.format("YYYY");
};

Week.prototype.getIndex = function() {
  return this.index;
};

module.exports =  Week;
