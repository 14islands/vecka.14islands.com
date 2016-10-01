var Week = require('./week')

function Weeks() {
  this.list = []
};

Weeks.prototype.getList = function() {
  var index = 0;
  var numberOfWeeks = 56; // Show all weeks per year + 4

  for (var i = 0; i < numberOfWeeks; i++) {
    var week = new Week(index);
    this.list.push(week);
    index++;
  }

  return this.list;
};

module.exports = new Weeks();

/*import Week from './week';

// publishing custom event to any registered listener
class Weeks {
    constructor() {
        super(...arguments);
        this.list = []
    }

    getList() {
      const numberOfWeeks = 56; // Show all weeks per year + 4

      for (let i = 0; i < numberOfWeeks; i++) {
        var week = new Week(i);
        this.list.push(week);
      }

      return this.list;
    }
}

export default Weeks*/
