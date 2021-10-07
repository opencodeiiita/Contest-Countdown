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
// @params allContests: array of contest-obeject (refer to backgroung.js)/

// @return none
function displayContests(allContests) {
    if (!allContests) return;
    const container = document.getElementById("contests");
    // console.log("hello");
    // console.log("hello");
    allContests.map((contest) => {
        let element = document.createElement("div");
        element.className = "contestDiv";
        const nametext = document.createElement("p");
        nametext.innerHTML = `${contest.Name}`;
        nametext.className = "contestName";

        const platform = document.createElement("p");
        platform.innerHTML = `${contest.Platform}`;
        platform.className = "contestPlatform";
        // console.log(contest.name);

        const startime = document.createElement("p");
        startime.innerHTML = `Start Time: ${contest.StartTime}`;
        startime.className = "startime";

        const endtime = document.createElement("p");
        endtime.innerHTML = `End Time: ${contest.EndTime}`;
        endtime.className = "endtime";

        const duration = document.createElement("p");
        duration.innerHTML = `Duration: ${contest.Duration}`;
        duration.className = "duration";

        const link = document.createElement("a");
        link.href = `${contest.url}`;
        link.innerHTML = `Compete`;
        link.className = "link";

        element.appendChild(nametext);
        element.appendChild(platform);
        element.appendChild(startime);
        element.appendChild(endtime);
        element.appendChild(duration);
        element.appendChild(link);

        container.appendChild(element);
    });
}
