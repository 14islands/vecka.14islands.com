var moment = require('moment')

// Constructor
class Week {

  constructor (weekIndex) {
    moment.locale('sv')
    this.index = weekIndex || 0
    this.current = moment().add(this.index, 'weeks')
    this.startDayOfWeek = this.current.clone().startOf('isoweek')
    this.endDayOfWeek = this.current.clone().endOf('isoweek')
  }

  isTodaysWeek () {
    return this.current.isSame(moment(), 'w')
  };

  isFirstWeekOfYear () {
    return this.getNumber() === 1
  };

  formatDate (date) {
    return date.format('ddd, Do MMM')
  };

  getNumber () {
    return this.current.isoWeek()
  }

  getStartDayText () {
    return this.formatDate(this.startDayOfWeek)
  }

  getEndDayText () {
    return this.formatDate(this.endDayOfWeek)
  }

  getYearText () {
    if (this.startDayOfWeek.isSame(this.endDayOfWeek, 'y')) {
      return this.startDayOfWeek.format('YYYY')
    }
    return this.startDayOfWeek.format('YYYY') + ' - ' + this.endDayOfWeek.format('YYYY')
  }

  getIndex () {
    return this.index
  };
};

module.exports = Week
