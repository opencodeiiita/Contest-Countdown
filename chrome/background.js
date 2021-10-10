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


// Issue #9: Use http://contesttrackerapi.herokuapp.com/ api to get the list of all upcoming contests (and store it in allContests)
// @return nothing
function updateContests() {
    let url = 'https://contesttrackerapi.herokuapp.com/';
    fetch(url)
    .then(res => res.json())
    .then(out => {
        for(let i = 0;i<Object.keys(out.result.upcoming).length;i++)
        {
            let curr = out.result.upcoming[i];
            let curr_url = curr.url;
            let flag = 1; 
            for(let j = 0;j<Object.keys(allContests);j++)
            {
                let existing_url = allContests[i].url;
                if(existing_url === curr_url)
                {
                    flag = 0;
                    break;
                }

            }
            if(flag == 1)
            {
                allContests.push(curr);
            }

               
        }
        // nextContests();
    })
    
 
}

// Issue #9: create a function that will give the nearest upcoming contest
// @return a contest-object
function nextContests(){
    filterContest();
    return allContests[0];
}

// filterContest function removes all the contests from the list whose starting time has already passed
// also it sorts the contests in order of which contest will start first
function filterContest(){
    allContests = allContests.filter(current => new Date(current.StartTime) > new Date());
    allContests.sort((a, b) => a.StartTime - b.StartTime);
}
