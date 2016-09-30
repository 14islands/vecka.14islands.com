var Week = require('./week')

function Weeks() {
  this.list = []
};

Weeks.prototype.getList = function() {
  var index = -4; // Show 4 previous weeks
  var numberOfWeeks = 56; // Show all weeks per year + 4

  for (var i = 0; i < numberOfWeeks; i++) {
    var week = new Week(index);
    this.list.push(week);
    index++;
  }

  return this.list;
};

module.exports = new Weeks();
