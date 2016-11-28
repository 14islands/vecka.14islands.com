var Week = require('./week')

class Weeks {

  constructor () {
    this.list = []
    this.load()
  }

  load () {
    var index = 0
    var numberOfWeeks = 70 // Show all weeks per year + 4

    for (var i = 0; i < numberOfWeeks; i++) {
      var week = new Week(index)
      this.list.push(week)
      index++
    }
  }

  getList () {
    return this.list
  }
}

module.exports = new Weeks()
