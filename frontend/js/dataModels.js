class Challenge {
    constructor(user, deposit, description, beginning, end, count, state) {
        this.user = user;
        this.deposit = deposit;
        this.description = description;
        this.beginning = beginning;
        this.end = end;
        this.count = count; 
        this.state = state;
    }
  }
  
class Submission {
    constructor(ID, challengeID, url, comment, timestamp, state) {
        this.ID = ID;
        this.challengeID = challengeID;
        this.url = url;
        this.comment = comment;
        this.timestamp = timestamp;
        this.state = state;
    }
}

let ChallengeState = { 
    0: "initial", 
    1: "inprogress", 
    2: "success", 
    3: "failed",
    4: "successWithdraw",
    5: "failedWithdraw"
};

let SubmissionState = { 
    0: "initial", 
    1: "challenged", 
    2: "accepted", 
    3: "rejected" 
};