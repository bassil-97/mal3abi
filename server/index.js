const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const moment = require('moment');
var duplicateArray = require('remove-array-duplicates');	

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 60 * 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "123456",
  database: "loginsystem",
});

app.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;

  const fNameCapitalized = firstname.charAt(0).toUpperCase() + firstname.slice(1);
  const lNameCapitalized = lastname.charAt(0).toUpperCase() + lastname.slice(1);

  bcrypt.hash(password, saltRounds, (err, hash) => {

    if(err) {
      console.log(err);
    }

    db.query("SELECT * FROM users WHERE userEmail = ?",
      username,
      (err, result) => {

        if(err) {
          console.log(err);
        }

        if(result.length > 0) {
          res.send({Registerd: false});
        } else {
          db.query(
            "INSERT INTO users (userEmail, userPassword, firstName, lastName) VALUES (?, ?, ?, ?)",
            [username, hash, fNameCapitalized, lNameCapitalized],
            (err, result) => {
              console.log(err);
              if(result) {
                res.send({Registered: true});
              } else {
                res.send({Registered: false});
              }
            }
          );
        }
      }
    )
  });

});

//=============== User Login =================

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM users WHERE userEmail = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].userPassword, (error, response) => {
          if (response) {
            req.session.user = result; // Create User Session
            res.send(result); 
          } else {
            res.send({ message: "Wrong username/password combination!" });
          }
        });
      } else {
        res.send({ message: "User doesn't exist" });
      }
      
    }
  );
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

//========================================================
//=============== Admin Login =================

app.post("/admin-login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  db.query(
    "SELECT * FROM admins WHERE adminEmail = ?;",
    username,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }

      if (result.length > 0) {
        console.log(result[0].adminPassword);
        console.log(password);
        req.session.user = result; // Create User Session
        res.send(result); 
      } else {
        res.send({ message: "User doesn't exist" });
      }  
    }
  );
});

app.get("/admin-login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

//========================================================
//=============== Book Match - Get All Matchs - Canel Matchs =============================

app.post("/book-match", (req, res) => {
  const userId = req.body.userId;
  const username = req.body.userEmail;
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const phoneNum = req.body.phoneNum;
  const matchDate = req.body.matchDate;
  const matchStartTime = req.body.matchStartTime;
  const matchEndTime = req.body.matchEndTime;

  let canReserve = null;

  db.query(
    "SELECT * FROM matchs WHERE match_date = ?",
    [matchDate],
    (err, result) => {

      if (err) {
        res.send({ err: err });
      }

      if(result.length > 0) {
        
        for(let el of result) {

          let matchsHasEqualTime = matchStartTime == el['match_start_time'] || matchEndTime == el['match_end_time'];
          let matchsDontEqualTime = moment(matchStartTime).isAfter(el['match_start_time']) && moment(matchStartTime).isBefore(el['match_end_time']);
          console.log(matchsHasEqualTime, matchsDontEqualTime);
          if( matchsHasEqualTime || matchsDontEqualTime ) {

            canReserve = false;
            break;
            //res.send({ message: "Sorry - a match is booked in this date", matchStatus: false});

          } else {
            canReserve = true;
          }

        } 

        console.log("Reserve: ",canReserve);

      } else {
        canReserve = true;
      }
      
      if(canReserve) {
        db.query(
          "INSERT INTO matchs(match_date, match_start_time, match_end_time, user_id) VALUES (?, ?, ?, ?)",
          [matchDate, matchStartTime, matchEndTime, userId],
          (err, result) => {
            if(err) {
              console.log(err);
            }

            if(result) {
              console.log("success");
              res.send({matchStatus: true});
            } else {
              console.log("failed");
              res.send({matchStatus: false});
            }
        });
      } else {
        res.send({ message: "Sorry - a match is booked in this date", matchStatus: false});
      }
    });
});

app.get("/cancel-match", (req, res) => {
  let matchId = req.query.id;
  const query = "DELETE FROM matchs WHERE match_id = ?";
  db.query(query,
    matchId,
    (err, result) => {
      if(err) {
        res.send({err: err});
      }

      if(result) {
        console.log("match was canceld");
        res.send({matchCanceled: true});
      } else {
        console.log("something went wrong");
        res.send({matchCanceled: false});
      }

    });
});

app.get("/matchs", (req, res) =>{
  let user = req.session.user;
  
  const query = "SELECT * FROM matchs WHERE user_id = ?";
  db.query(query, 
    user[0].user_id,
  (err, result) => {
    if(err) {
      res.send({err: err});
    }

    if(result.length > 0) {
      //console.log(result);
      res.send(result); 
    } else {
      //console.log("no result");
      res.send({message: 'You dont have any upcoming matchs'});
    }
  });
});

app.post("/all-matchs", (req, res) =>{
  let date = req.body.day;
  console.log(date);
  const query = "SELECT * FROM matchs WHERE match_date = ?";
  db.query(query, 
    date,
  (err, result) => {
    if(err) {
      res.send({err: err});
    }

    if(result.length > 0) {
      console.log(result);
      res.send(result); 
    } else {
      res.send({message: 'There is no matchs today'});
    }
  });
});

//========================================================
//=============== Create Tournaments - Get All Tournaments - Cancel Tournaments =============================

app.post("/create-tournament", (req, res) => {
  const userId = req.body.userId;
  const tournamentName = req.body.tournamentName;
  const tournamentDate = req.body.tournamentDate;
  const tournamentStartTime = req.body.tournamentStartTime;
  const tournamentEndTime = req.body.tournamentEndTime;
  const numberOfTeams = req.body.numberOfTeams;
  const tournamentType = req.body.tournamentType;

  db.query(
    "SELECT * FROM matchs WHERE match_date = ? AND (match_start_time = ? OR match_end_time = ?)",
    [tournamentDate, tournamentStartTime, tournamentEndTime],
    (err, result) =>{

      if (err) {
        res.send({ err: err });
      }

      if(result.length > 0) {
        res.send({ message: "Sorry - there are matchs booked in this date", matchStatus: false});
      } else {
        db.query(
          "INSERT INTO tournaments(tournament_name, tournament_date, number_of_teams, tournament_type, tournament_start_time, tournament_end_time, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [tournamentName, tournamentDate, numberOfTeams, tournamentType, tournamentStartTime, tournamentEndTime,userId],
          (err, result) => {

            if(err) {
              console.log(err);
            }

            if(result) {
              console.log("success");
              res.send({matchStatus: true});
            } else {
              console.log("failed");
              res.send({matchStatus: false});
            }
          });
      }
    });
});

app.get("/cancel-tournament", (req, res) => {
  let tournamentId = req.query.id;
  const query = "DELETE FROM tournaments WHERE tournament_id = ?";
  db.query(query,
    tournamentId,
    (err, result) => {
      if(err) {
        res.send({err: err});
      }

      if(result) {
        console.log("match was canceld");
        res.send({tournamentCanceled: true});
      } else {
        console.log("something went wrong");
        res.send({tournamentCanceled: false});
      }

    });
});


app.get("/tournaments", (req, res) =>{

  let user = req.session.user;
  
  const query = "SELECT * FROM tournaments WHERE user_id = ?";
  db.query(query, 
    user[0].user_id,
  (err, result) => {
    if(err) {
      res.send({err: err});
    }

    if(result.length > 0) {
      res.send(result); 
    } else {
      console.log("no result");
      res.send({message: 'You dont have any upcoming Tournaments'});
    }
  });
});

app.get("/challenges", (req, res) =>{

  let user = req.session.user;
  
  const query = "SELECT * FROM challenges WHERE challengeStatus = 'available'";
  db.query(query, user[0].user_id ,(err, result) => {

    if(err) throw err; 

    if(result.length > 0) {
      res.send(result);
      console.log(result);
  
    } else {
    
      res.send({message: 'There is no challenges available right now'});
    
    }
  });
});

app.post('/create-challenge', (req, res) => {
  let userId = req.body.userId;
  let teamLeader = req.body.userId;
  let challengeTitle = req.body.challengeTitle;
  let challengeStatus = req.body.challengeStatus;
  let shirtColor = req.body.shirtColor;

  db.query("SELECT firstName, lastName FROM users WHERE user_id = ?",
  userId,
  (err, result) => {
    if(err) {
      res.send({err: err});
    }

    if(result.length > 0) {
      console.log(result[0]['firstName']);
    } else {
      console.log("no result");
    }
  });

  db.query("INSERT INTO challenges(firstTeamLeader, challengeTitle, challengeStatus, shirtColor) VALUES (?, ?, ?, ?)",
  [teamLeader, challengeTitle, challengeStatus, shirtColor] ,
  (err, result) => {
    if(err) {
      console.log(err);
    }

    if(result) {
      console.log("success");
      res.send({matchStatus: true});
    } else {
      console.log("failed");
      res.send({matchStatus: false});
    }
  });

});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get("/request-challenge", (req, res) => {

  let user = req.session.user;
  let challengeId = req.query.id;
  let opponentId = req.query.userId;
  var opponentName = "";
  let notificationTitle = "New Challenge is Waiting for you!";
  let notificationContent = "";

  db.query("SELECT firstName, lastName FROM users WHERE user_id = ?", 
  user[0].user_id,
  (err, result) => {

    if (err) throw err;

    if(result.length > 0) {
      
      opponentName = capitalizeFirstLetter(result[0]['firstName']) + ' ' + capitalizeFirstLetter(result[0]['lastName']);
      notificationContent = `${opponentName} challenged you in a match`;

      db.query("INSERT INTO notifications(user_id_fk, notification_title, notification_content, viewed) VALUES (?, ?, ?, 'NO')",
      [opponentId, notificationTitle, notificationContent], 
      (err, result) => {
        if (err) throw err;
      });

    }
  
  });


  const query = "UPDATE challenges SET challengeStatus = 'pending', secondTeamLeader = ? WHERE challenge_id = ?";
  db.query(query,
    [user[0].user_id, challengeId],
    (err, result) => {
      if(err) {
        res.send({err: err});
      }

      if(result) {
        console.log("challenge was requested successfully");
        res.send({challengeRequested: true});
      } else {
        console.log("something went wrong");
        res.send({challengeRequested: false});
      }
    });
  
});


app.get("/myChallenges", (req, res) => {

  let user = req.session.user;
  
  db.query("SELECT * FROM challenges JOIN users ON challenges.firstTeamLeader = ? WHERE challengeStatus = 'pending'",
  user[0].user_id,
  (err, result) => {
    if (err) throw err;

    if(result.length > 0) {

      const seen = new Set();
      const filteredArr = result.filter(el => {
        const duplicate = seen.has(el.challenge_id);
        seen.add(el.challenge_id);
        return !duplicate;
      });
      res.send(filteredArr);
      
    } else {
      res.send({message: false});
    }

  });

});

app.get('/acceptChallenge', (req, res) => {

  let challengeId = req.query.id;
  let userId = req.session.user;
  let opponentId = req.query.opponentId;
  let notificationTitle = "New Challenge is Waiting for you!";
  let notificationContent = "";

 db.query("UPDATE challenges SET challengeStatus = 'accepted' WHERE challenge_id = ?",
  challengeId,
  (err, result) => {

    if(err) throw err;

    if(result) {
      db.query("SELECT firstName, lastName FROM users WHERE user_id = ?", 
      userId[0].user_id,
      (err, result) => {

        if (err) throw err;

        if(result.length > 0) {
          
            opponentName = capitalizeFirstLetter(result[0]['firstName']) + ' ' + capitalizeFirstLetter(result[0]['lastName']);
            notificationContent = `${opponentName} accepted your challenge`;
            db.query("INSERT INTO notifications(user_id_fk, notification_title, notification_content, viewed) VALUES (?, ?, ?, 'NO')",
            [opponentId, notificationTitle, notificationContent], 
            (err, result) => {
                if (err) throw err;
            });
        }
      });
      res.send({message: 'true'});
    } else {
      res.send({message: 'something went wrong'});
    }

  }) 

});

app.get('/declineChallenge', (req, res) => {

  let challengeId = req.query.id;
  let userId = req.session.user;

  db.query("UPDATE challenges SET challengeStatus = 'declined' WHERE challenge_id = ?",
  challengeId,
  (err, result) => {

    if(err) throw err;

    if(result) {
      res.send({message: 'true'});
    } else {
      res.send({message: 'something went wrong'});
    }

  })

});

app.get("/notifications", (req, res) => {

  let user = req.session.user;

  db.query("SELECT * FROM notifications WHERE user_id_fk = ? AND viewed = 'NO'", 
  user[0].user_id,
  (err, result) => {
    if(err) throw err;

    if(result.length > 0) {
      res.send(result);
    } else {
      res.send({message: 'You dont have any notifications'});
    }

  });

});

app.get("/notificationViewed", (req, res) => {
  let user = req.session.user;

  db.query("UPDATE notifications SET viewed = 'YES' WHERE user_id_fk = ?", 
  user[0].user_id,
  (err, result) => {
    if(err) throw err;

    if(result) {
      res.send({message: true});
    } else {
      res.send({message: 'You dont have any notifications'});
    }

  });

});

app.post('/createTeam', (req, res) => {
  let user = req.body.userId;
  let teamName = req.body.teamName;
  let numberOfPlayers = req.body.numOfPlayers;
  let dateTime = new Date();
  let creation_date = dateTime.toISOString().slice(0,10);

  db.query("INSERT INTO team(team_name, team_creator, number_of_players, team_captain, creation_date) VALUES (?, ?, ?, ?, ?)",
  [teamName, user, numberOfPlayers, user, creation_date],
  (err, result) => {

    if(err) throw err;

    if(result) {
      res.send({message: true, teamName: teamName});
    } else {
      res.send({message: false});
    }

  });

});

app.get('/myTeam', (req, res) => {
  let user = req.session.user;

  db.query('SELECT * FROM team WHERE team_creator = ?',
  user[0].user_id,
  (err, result) => {
    if(err) throw err;

    if(result.length > 0) {
      res.send({message: true, team: result});
    } else {
      res.send({message: false});
    }

  });
});

app.get('/removeTeam', (req, res) => {

  let teamId = req.query.teamId;

  db.query("SELECT * FROM team WHERE team_id = ?", teamId,
  (err, result) => {

    if(err) throw err;

    if(result.length > 0) {

      db.query("DELETE FROM players WHERE team_id = ?", teamId,
      (err, result) => {

        if(err) throw err;

        if(result) {
          db.query("DELETE FROM team WHERE team_id = ?", teamId,
          (err, result) => {

            if(err) throw err;

            if(result) {
              console.log("team removed", result);
              res.send({message: true});

            } else {
              res.send({message: false});
            }

          });
        }
        
      })

    }

  });

});

app.post('/addPlayer', (req, res) => {
  
  let playerPosition = req.body.playerPosition;
  let teamId = req.body.teamId;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  db.query("INSERT INTO players(player_position, team_id, firstName, lastName) VALUES (?, ?, ?, ?)",
  [playerPosition, teamId, firstName, lastName],
  (err, result) => {

    if(err) throw err;

    if(result) {
      res.send({message: true});
    } else {
      res.send({message: false});
    }

  });

});

app.get('/removePlayer', (req, res) => {
  let playerId = req.query.playerId;
  let teamId = req.query.teamId;

  db.query("DELETE FROM players WHERE player_id = ?", playerId,
  (err, result) => {
    
    if(err) throw err;

    if(result) {
      db.query("SELECT * FROM players WHERE team_id = ?", teamId, 
      (err, result) => {

        if(err) throw err;

        if(result.length > 0) {
          console.log(result);
          res.send({removed: true, players: result});
        } else {
          res.send({playersCount: 0})
        }

      });
    }

  });
});

app.post('/addedPlayers', (req, res)=> {

  let teamId = req.body.teamId;
  db.query("SELECT * FROM players WHERE team_id = ?",
      teamId,
      (err, result) => {
        if(err) throw err;

        if(result.length > 0 ) {
          res.send({message: true, players: result});
        } else {
          res.send({message: false});
        }
      });
})

//==========================================================
//===================== User Logout ========================

app.get("/logout", (req, res) => {
  res.clearCookie("userId");
  req.session.destroy(function(err){
    if(err) {
      console.log(err);
    } else {
      res.send({logout: true});
    }
  });
});

app.listen(3001, () => {
  console.log("running server");
});