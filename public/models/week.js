var moment = require('moment')

// Constructor
class Week {

  constructor (weekIndex) {
    moment.updateLocale('sv', {
      ordinal: (number) => {
        const b = number % 10
        const output = (~~(number % 100 / 10) === 1) ? 'e'
          : (b === 1) ? 'a'
          : (b === 2) ? 'a'
          : (b === 3) ? 'e' : 'e'
        return number + ':' + output
      }
    })
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

  getMonthPeriod () {
    if (!this.startDayOfWeek.isSame(this.endDayOfWeek, 'year')) {
      // If start and end of week in separate year
      return `${this.startDayOfWeek.format('MMMM YYYY')} - ${this.endDayOfWeek.format('MMMM YYYY')}`
    } else if (!this.startDayOfWeek.isSame(this.endDayOfWeek, 'month')) {
      // If start and end of week in separate month
      return `${this.startDayOfWeek.format('MMMM')} - ${this.endDayOfWeek.format('MMMM YYYY')}`
    }
    return this.startDayOfWeek.format('MMMM YYYY')
  }

  getDayPeriod () {
    return `${this.startDayOfWeek.format('Do')} - ${this.endDayOfWeek.format('Do')}`
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
