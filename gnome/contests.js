// web
const Soup = imports.gi.Soup;

// file system
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;

// set timeout
const Mainloop = imports.mainloop;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Self = ExtensionUtils.getCurrentExtension();

const API_URL = "https://contesttrackerapi.herokuapp.com/";

// contest =
// {
//      "Duration": "2h",
//      "EndTime": "Sun, 12 Dec 2021 22:35",
//      "Name": "Technocup 2022 - Elimination Round 3",
//      "Platform": "CODEFORCES",
//      "StartTime": "Sun, 12 Dec 2021 20:35",
//      "url": "http://codeforces.com/contest/1585",
//      "participating" : "true/false"
//    },

var Contests = class {
    constructor() {
        // https://github.com/ifl0w/RandomWallpaperGnome3/blob/develop/randomwallpaper%40iflow.space/wallpaperController.js
        let xdg_cache_home = GLib.getenv("XDG_CACHE_HOME");
        if (!xdg_cache_home) xdg_cache_home = `${GLib.getenv("HOME")}/.cache`;
        this.cacheLocation = `${xdg_cache_home}/${Self.metadata["uuid"]}/`;
        this.cacheFile = this.cacheLocation + "contest.json";

        this.retriesLeft = 5;
        this.retryTime = 1;
        this.refreshTimeout = null;
        this.allContests = [];
        this.nextContest = null;
        this.loadFromFile();
        this.refresh();
    }

    //Issue #7: complete this function, also call set Next contest and update contest
    loadFromFile() { 

        try // we use this to check for errors, 
        {
                let Data = GLib.file_get_contents(this.cacheFile); // data will be an array
                if (Data[0])
                        this.updateContests(JSON.parse(Data[1]));

                this.setNextContest();
        }
        catch (e) // if error found 
        {
                global.log("ContestCountdown: Cache file not found")
        }
    }

    //Issue #7: complete this function
    saveToFile() 
    {
        GLib.mkdir_with_parents(this.cacheLocation, parseInt('0755', 8)); // 0755 = --- rwx r-x r-x,octal notation
        // user = read and write , group = read and execute, other = read and execute

        let input = Gio.file_new_for_path(this.cacheFile);

        let fstream = input.replace(null, false, Gio.FileCreateFlags.NONE, null);

        fstream.write(JSON.stringify(this.allContests), null);

        fstream.close(null);
     }

    refresh() {
        this.retriesLeft--;

        // remove refreshTimeout used when refresh fails
        if (this.refreshTimeout) {
            Mainloop.source_remove(this.refreshTimeout);
            this.refreshTimeout = null;
        }

        let session = new Soup.SessionAsync();
        let message = Soup.Message.new("GET", API_URL);

        session.queue_message(message, (session, message) => {
            try {
                let response = JSON.parse(message.response_body.data);
                global.log(response);

                this.updateContests(response.result.upcoming);

                // if successful after retries, restore these
                this.retriesLeft = 5;
                this.retryTime = 1;
                this.refreshTimeout = Mainloop.timeout_add_seconds(6 * 3600, Lang.bind(this, this.refresh));
            } catch (e) {
                global.log("ContestCountdown: Contest refresh failed\n retry left " + this.retriesLeft + "\n" + e);

                if (this.retriesLeft) {
                    // if retries are left, then retry with exponentialy increasing time
                    this.retryTime *= 2;
                    this.refreshTimeout = Mainloop.timeout_add_seconds(this.retryTime, Lang.bind(this, this.refresh));
                } else {
                    // permanent fail, no more try
                    this.retriesLeft = 5;
                    this.retryTime = 1;
                }
            }
        });
    }

    updateContests(newContests) {
        newContests = this._filterContest(newContests);

        newContests.forEach((contest) => {
            if (!this.allContests.some((existingContest) => existingContest.url == contest.url)) {
                if (!("participating" in contest)) contest.participating = true;
                this.allContests.push(contest);
            }
        });

        this.allContests = this._filterContest(this.allContests);

        this.setNextContest();
        this.saveToFile();
    }

    _filterContest(contests) {
        contests = contests.filter((contest) =>  (new Date(contest.StartTime) > new Date()) && this.secondsTillContest(contest) >= 0);

        contests.sort((a, b) => {
            return new Date(a.StartTime) - new Date(b.StartTime);
        });

        return contests;
    }

    secondsTillContest(contest) {
        return Math.floor((new Date(contest.StartTime) - new Date()) / 1000);
    }

    setNextContest() {
        this.nextContest = null;
        this.allContests = this._filterContest(this.allContests);
        for (let contest of this.allContests)
            if (contest.participating) {
                this.nextContest = contest;
                break;
            }
    }

    secondsTillNextContest() {
        if (this.nextContest) {
            let timeDiff = this.secondsTillContest(this.nextContest);
            if (timeDiff >= 0) return timeDiff;
            else {
                this.setNextContest();
                return this.secondsTillNextContest();
            }
        } else {
            // when no next contest
            // if still trying to load data, return -1
            // if failed to load, return -Infinity
            // if no upcoming contest, return Infinity

            if (this.retriesLeft < 5) return -1;
            if (this.allContests.length == 0) return -Infinity;
            return Infinity;
        }
    }
};
