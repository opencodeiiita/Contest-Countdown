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
    const fetch = require('node-fetch');
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
function filterContest(){
    
    while(check(allContests[0].StartTime)==false)
    {
        allContests.splice(0,1);
    }
    
}

// check takes StartTime as string and returns whether the time has passed or not
// returns true if time will come, returns false if time has already passed  
function check(date){
    var user=new Date(date);
    var current=new Date();
    if(current.getFullYear()>user.getFullYear()){
        return false;
    }else if(current.getFullYear()<user.getFullYear()){
        return true;
    }else{

        if(current.getMonth()>user.getMonth()){
            return false;
        }else if(current.getMonth()<user.getMonth()){
            return true;
        }else{
                 
            if(current.getDate()>user.getDate() ){
                return false;
            }else if(current.getDate()<user.getDate()){
                return true;
            }else{

                  if(current.getTime()>user.getTime()){
                    return false;
                  }else if(current.getTime()<user.getTime()){
                    return true;
                  }else{
                    return true;
                  }

            }

        }

    }
    
}