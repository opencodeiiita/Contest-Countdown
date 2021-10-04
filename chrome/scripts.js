var targetDate = new Date("Nov 4, 2021").getTime();

var x = setInterval(function() {

  var currentTime = new Date().getTime();
  var interval = targetDate - currentTime;

  var days = Math.floor(interval / (1000 * 60 * 60 * 24));
  var hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((interval % (1000 * 60)) / 1000);

  document.getElementById("timer").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s Left";

  if (interval < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "Contest has Started";
  }
}, 1000);
