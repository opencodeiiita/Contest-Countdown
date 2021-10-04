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

const CODEFORCES_API_URL = "https://codeforces.com/api/contest.list?gym=false";

var Contests = class {
  constructor() {
    // https://github.com/ifl0w/RandomWallpaperGnome3/blob/develop/randomwallpaper%40iflow.space/wallpaperController.js
    let xdg_cache_home = GLib.getenv("XDG_CACHE_HOME");
    if (!xdg_cache_home) xdg_cache_home = `${GLib.getenv("HOME")}/.cache`;
    this.cacheLocation = `${xdg_cache_home}/${Self.metadata["uuid"]}/`;
    this.cacheFile = this.cacheLocation + "contest.json";

    // This array stores all the contests information
    // each member of the array is an object with *atleast* these fields:
    //          name, startTimeSeconds, durationSeconds
    // this.allContests = [{name: "example cf round 89", startTimeSeconds: 19900399, durationSeconds: 1290}]
    this.allContests = [];

    this.retriesLeft = 5;
    this.retryTime = 1;
    this.refreshTimeout = null;
    this.nextContest = null;
    this.loadFromFile();
    this.refresh();
  }

  loadFromFile() {
    // TODO: Issue#5
    // Load the contest of the the cache file, parse the json within and then use updateContestsand setNextContest
  }

  saveToFile() {
    // TODO: Issue#5
    // Save this.allContests array to the cache file (this.cacheFile)
  }

  refresh() {
    this.retriesLeft--;

    // remove refreshTimeout used when refresh fails
    if (this.refreshTimeout) {
      Mainloop.source_remove(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    let session = new Soup.SessionAsync();
    // TODO: Issue#8
    // We want to expand to other sites as ell
    // Create adapter class for codeforces,
    let message = Soup.Message.new("GET", CODEFORCES_API_URL);

    session.queue_message(message, (session, message) => {
      try {
        let response = JSON.parse(message.response_body.data);
        if (response.status != "OK") throw "Got non OK status";

        this.updateContests(response.result);

        // if successful after retries, restore these
        this.retriesLeft = 5;
        this.retryTime = 1;
        this.refreshTimeout = Mainloop.timeout_add_seconds(
          6 * 3600,
          Lang.bind(this, this.refresh)
        );
      } catch (e) {
        global.log(
          "ContestCountdown: Contest refresh failed\n retry left " +
            this.retriesLeft +
            "\n" +
            e
        );

        if (this.retriesLeft) {
          // if retries are left, then retry with exponentialy increasing time
          this.retryTime *= 2;
          this.refreshTimeout = Mainloop.timeout_add_seconds(
            this.retryTime,
            Lang.bind(this, this.refresh)
          );
        } else {
          // permanent fail, no more try
          this.retriesLeft = 5;
          this.retryTime = 1;
        }
      }
    });
  }

  // TODO: Issue#6
  // use the newContest array to update the existing this.allContests array efficiently
  // since original array contains more information, only add entries dont remove any
  updateContests(newContests) {}

  // TODO: Issue#7
  // remove all contest object from the contests array that have already occured
  _filterContest(contests) {}

  secondsTillContest(contest) {
    return Math.floor(
      (new Date(contest.startTimeSeconds * 1000) - new Date()) / 1000
    );
  }

  // TODO: Issue #7
  // set this.nextContest to the nearest contest that user is participating in
  setNextContest() {}

  // returns the seconds till this.nextContest
  // when no next contest
  // if still trying to load data, return -1
  // if failed to load, return -Infinity
  // if no upcoming contest, return Infinity
  secondsTillNextContest() {
    if (this.nextContest) {
      let timeDiff = this.secondsTillContest(this.nextContest);
      if (timeDiff >= 0) return timeDiff;
      else {
        this.setNextContest();
        return this.secondsTillNextContest();
      }
    } else {
      if (this.retriesLeft < 5) return -1;
      if (this.allContests.length == 0) return -Infinity;
      return Infinity;
    }
  }
};
