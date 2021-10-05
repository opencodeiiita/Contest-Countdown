function remainingTime(targetDate) {
    var currentDate = new Date().getTime();
    var interval = targetDate - currentDate;

    var days = Math.floor(interval / (1000 * 60 * 60 * 24));
    var hours = Math.floor((interval % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((interval % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((interval % (1000 * 60)) / 1000);
    return {
        totalInterval: interval,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    };
}

function setClock(date) {
    var time = remainingTime(date);
    document.getElementById("timer").innerHTML = time.days + "d " + time.hours + "h " + time.minutes + "m " + time.seconds + "s Left";

    if (time.totalInterval <= 0) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "Contest has Started";
    }
}

function runClock(targetDate) {
    if (targetDate === undefined || targetDate === null) {
        var targetDate = new Date("Nov 4, 2021").getTime();
    }
    setClock(targetDate);
}
var timeinterval = setInterval(runClock, 1000);

// Issue #10: Write html and javascript to display contests from the paramter array
// @params allContests: array of contest-obeject (refer to backgroung.js)
// @return none
function displayContests() {}
