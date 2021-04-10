import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import moment from 'moment';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import MuiPhoneNumber from 'material-ui-phone-number';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Style from './Tournament.module.css';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {

  const [TournamentName, setTournamentName] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(moment(new Date()).format("MMM DD YYYY"));
  const [selectedStartTime, setSelectedStartTime] = React.useState(moment(new Date()).format('MMMM DD YYYY, h:30 a'));
  const [selectedEndTime, setSelectedEndTime] = React.useState(moment(new Date().getTime() + (60*60*2000)).format('MMMM DD YYYY, h:00 a'));
  const [userId, setUserId] = useState(0);
  const [isDisabled, setEnable] = useState(true);
  const [numberOfTeams, setnumberOfTeams] = React.useState("");
  const [tournamentType, setTournamentType] = React.useState("");

  const [isBooked, setBookingStatus] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("");
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const createTournament = () => {

    console.log(userId);

    axios.post("http://localhost:3001/create-tournament", {
        userId: userId,
        tournamentName: TournamentName,
        tournamentDate: selectedDate,
        tournamentStartTime: selectedStartTime,
        tournamentEndTime: selectedEndTime,
        numberOfTeams: numberOfTeams,
        tournamentType: tournamentType
    }
    ).then( (response) => {
        console.log("response log " + response.data.matchStatus);
        
        if(response.data.matchStatus) {
            setSnackbarColor("success");
            setSnackbarMsg("Your tournament was booked successfully");
            setBookingStatus(true);
        } else {
            setSnackbarColor("error");
            setSnackbarMsg("Sorry, a match is booked in the same date");
            setBookingStatus(true);
        }
    }).catch((error) => {
        console.log(error);
    });
  }

  useEffect( () =>{
    axios.get("http://localhost:3001/login")
    .then((response) => {
        if(response.data["loggedIn"] === true) {
            setUserId(response.data.user[0].user_id);
        }
    });
}, []);


const handleTournamentName = (e) => {
  setEnable(false);
  setTournamentName(e.target.value);
  if(e.target.value == "") {
    setEnable(true);
  } else {

  }
}

const handleDateChange = (date) => {
    setSelectedDate(moment(date).format("MMM DD YYYY"));
};

const handleStartTimeChange = (date) => {
    setSelectedStartTime(moment(date).format('MMMM DD YYYY, h:30 a'));
    setSelectedEndTime(moment(date.getTime() + (60 * 60 *2000)).format('MMMM DD YYYY, h:00 a'));
};

const handleEndTimeChange = (date) => {
    setSelectedEndTime(moment(date.getTime()).format('MMMM DD YYYY, h:00 a'));
};

const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setBookingStatus(false);
};

const handleNumberOfTeams = (e) => {
  setnumberOfTeams(e.target.value);
}

const handleTournamentType = (e) => {
  setTournamentType(e.target.value);
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


  const classes = useStyles();

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.onClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            <img src="https://img.icons8.com/fluent/30/000000/trophy.png"/> 
             {TournamentName} Tournament
            </Typography>
            <Button onClick={createTournament} color="inherit" disabled={isDisabled}>
              Create Tournament
            </Button>
          </Toolbar>
        </AppBar>
        <div className={Style.test}>
          <div className={Style.tournamentForm} data-aos="fade-right" data-aos-duration="1000">
          <FormGroup>
            <FormControl className="mb-2">
                <InputLabel htmlFor="tournamentName">Tournament Name</InputLabel>
                <Input id="tournamentName" aria-describedby="my-helper-text" onChange={handleTournamentName} />
                <FormHelperText id="my-helper-text">Choose a unique name for your tournament</FormHelperText>
            </FormControl>
            <FormControl className="mb-4">
              <InputLabel id="demo-simple-select-label">Number of Teams</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={numberOfTeams}
                onChange={handleNumberOfTeams}
              >
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={12}>12</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="mb-4">
              <InputLabel id="demo-simple-select-label">Tournament Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={tournamentType}
                onChange={handleTournamentType}
              >
                <MenuItem value="KO">knockout (KO)</MenuItem>
                <MenuItem value="RR">round-robin (RR)</MenuItem>
              </Select>
            </FormControl>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                    margin="normal"
                    id="date-picker-dialog"
                    label="Tournament Date"
                    format="MM/dd/yyyy"
                    minDate={moment().toDate()}
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                    }}
                />
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Tournament Start Time"
                    minDate={moment().toDate()}
                    value={selectedStartTime}
                    onChange={handleStartTimeChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
                <KeyboardTimePicker
                    margin="normal"
                    id="time-picker"
                    label="Tournament End Time"
                    value={selectedEndTime}
                    onChange={handleEndTimeChange}
                    KeyboardButtonProps={{
                        'aria-label': 'change time',
                    }}
                />
            </MuiPickersUtilsProvider>
          </FormGroup>
          </div>
        </div>
        <Snackbar 
            open={isBooked}
            autoHideDuration={5000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={snackbarColor}>
                {snackbarMsg}
            </Alert>
        </Snackbar>
      </Dialog>
    </div>
  );
}
