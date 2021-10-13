// contest-object =
// {
//      "Duration": "2h",
//      "EndTime": "Sun, 12 Dec 2021 22:35",
//      "Name": "Technocup 2022 - Elimination Round 3",
//      "Platform": "CODEFORCES",
//      "StartTime": "Sun, 12 Dec 2021 20:35",
//      "url": "http://codeforces.com/contest/1585"
//    },

// allContests = [array of contest-object]

var allContests = [];

function init() {
    updateContests();

    setTimeout(
        updateContests
        , 1000 * 60 * 60);

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.command === "allContest")
            sendResponse({ "allContests": allContests });

        else
            sendResponse({ response: "invalid" });
    });


}


// Issue #9: Use http://contesttrackerapi.herokuapp.com/ api to get the list of all upcoming contests (and store it in allContests)
// @return nothing
function updateContests() {
    let url = 'https://contesttrackerapi.herokuapp.com/';
    fetch(url)
        .then(res => res.json())
        .then(out => {
            for (let i = 0; i < Object.keys(out.result.upcoming).length; i++) {
                let curr = out.result.upcoming[i];
                allContests.push(curr);
            }
            const uniqueObjects = [...new Map(allContests.map(item => [item.url, item])).values()];
            allContests = uniqueObjects;
        })


}

// filterContest function removes all the contests from the list whose starting time has already passed
// also it sorts the contests in order of which contest will start first
function filterContest() {
    allContests = allContests.filter(current => new Date(current.StartTime) > new Date());
    allContests.sort((a, b) => a.StartTime - b.StartTime);
}
init();