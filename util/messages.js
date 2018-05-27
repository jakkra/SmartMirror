const greetings = {
  morning: ['God morgon!', 'Kaffe?', 'Ha en bra dag!', 'Hoppas du får en bra dag!', 'Sovit gott?'],
  afternoon: ['Ganska fin du!', 'Trevlig eftermiddag!', 'Eftermiddags kaffe?', 'Glömde väl inte att fika?'],
  evening: ['Trevlig kväll!', 'Ser bra ut!', 'Myskväll?!'],
};

module.exports = {
  getMessage: function(callback) {
    const d = new Date();
    var hour = d.getHours();

    if (hour >= 5 && hour < 12) {
      return greetings.morning[Math.floor(Math.random() * greetings.morning.length)];
    } else if (hour >= 12 && hour < 18) {
      return greetings.afternoon[Math.floor(Math.random() * greetings.afternoon.length)];
    } else if (hour >= 18 || (hour >= 0 && hour < 5)) {
      return greetings.evening[Math.floor(Math.random() * greetings.evening.length)];
    } else {
      return 'Something wrong, hour is: ' + hour;
    }
  },
};
