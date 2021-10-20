let contestReminder1 = document.getElementsByClassName(".contest-reminder1");



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

setInterval(() => {
    var date = new Date();
    if(date.getHours() < 10)
    {
        if(date.getMinutes()<10)
        document.getElementById("clock").innerHTML="0"+date.getHours()+":"+"0"+date.getMinutes();
        else
        document.getElementById("clock").innerHTML="0"+date.getHours()+":"+date.getMinutes();
    }
    else
    {
        if(date.getMinutes()<10)
        document.getElementById("clock").innerHTML=date.getHours()+":"+"0"+date.getMinutes();
        else
        document.getElementById("clock").innerHTML=date.getHours()+":"+date.getMinutes();
    }
    
}, 1000);

setInterval(() => {
    var day = new Date();
    var month = day.getMonth() + 1;
    switch (day.getDay()) {
        case 0:
            document.getElementById("day").innerHTML="Sunday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 1:
            document.getElementById("day").innerHTML="Monday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 2:
            document.getElementById("day").innerHTML="Tuesday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 3:
            document.getElementById("day").innerHTML="Wednesday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 4:
            document.getElementById("day").innerHTML="Thursday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 5:
            document.getElementById("day").innerHTML="Friday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
        case 6:
            document.getElementById("day").innerHTML="Saturday"+"     "+day.getDate()+"."+month+"."+day.getFullYear();
            break;
    
        default:
            break;
    }
    
}, 1000);