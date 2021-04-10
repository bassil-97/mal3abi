import 'date-fns';

import React, {useState, useEffect} from 'react';

import {Link, useHistory} from 'react-router-dom';

import moment from 'moment';
import { makeStyles, withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import MuiPhoneNumber from 'material-ui-phone-number';
import DateFnsUtils from '@date-io/date-fns';
import { format } from 'date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

import Style from './BookMatch.module.css';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
});
  
const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
}))(MuiDialogContent);
  
const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
}))(MuiDialogActions);


export default function CustomizedDialogs(props) {

    axios.defaults.withCredentials = true;

    let history = useHistory();
    
    const [username, setUsernameBooking] = useState("");
    const [firstName, setFirstnameBooking] = useState("");
    const [lastName, setLastnameBooking] = useState("");
    const [phoneNum, setPhoneNumBooking] = useState("");
    const [selectedDate, setSelectedDate] = React.useState(moment(new Date()).format("MMM DD YYYY"));
    const [selectedStartTime, setSelectedStartTime] = React.useState(moment(new Date()).format('MMMM DD YYYY, h:30 a'));
    const [selectedEndTime, setSelectedEndTime] = React.useState(moment(new Date().getTime() + (60*60*2000)).format('MMMM DD YYYY, h:00 a'));
    const[userId, setUserId] = useState(0);

    const [isBooked, setBookingStatus] = useState(false);
    const [snackbarColor, setSnackbarColor] = useState("");
    const [snackbarMsg, setSnackbarMsg] = useState("");

    useEffect( () =>{
        axios.get("http://localhost:3001/login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setUserId(response.data.user[0].user_id);
            }
        });
    }, []);

    function handlePhone(value) {
        setPhoneNumBooking(value);
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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const BookMatch = () => {

        axios.post("http://localhost:3001/book-match", {
            userId: userId,
            userEmail: username,
            firstName: firstName,
            lastName: lastName,
            userPhone: phoneNum,
            matchDate: selectedDate,
            matchStartTime: selectedStartTime,
            matchEndTime: selectedEndTime
        }
        ).then( (response) => {
            console.log("response log " + response.data.matchStatus);
            
            if(response.data.matchStatus) {
                setSnackbarColor("success");
                setSnackbarMsg("Your match was booked successfully");
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
    
    return (
      <div>
        <Dialog onEscapeKeyDown={props.Close} fullWidth={true} onClose={props.Close} aria-labelledby="customized-dialog-title" open={props.open}>
          <DialogTitle id="customized-dialog-title" onClose={props.Close}>
                Mal3abi | Book Match
          </DialogTitle>
          <DialogContent dividers>
          <form className={`${Style.BookingForm}`}>
                <FormGroup>
                    <FormControl className="mb-2">
                        <InputLabel htmlFor="emailAddress">Email address</InputLabel>
                        <Input id="emailAddress" aria-describedby="my-helper-text" onChange={(e) => {setUsernameBooking(e.target.value)}} />
                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                    </FormControl>
                    <div className="d-flex flex-row mb-2">
                        <FormControl className="mb-2 mr-4">
                            <InputLabel htmlFor="firstName">First Name</InputLabel>
                            <Input id="firstName" onChange={(e) => {setFirstnameBooking(e.target.value)}} />
                        </FormControl>
                        <FormControl className="mb-2">
                            <InputLabel htmlFor="lastName">Last Name</InputLabel>
                            <Input id="lastName" onChange={(e) => {setLastnameBooking(e.target.value)}} />
                        </FormControl>
                    </div>
                    <MuiPhoneNumber className="mb-2" defaultCountry={'jo'} id="phoneNum" onChange={handlePhone} />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Match Date"
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
                            label="Match Start Time"
                            value={selectedStartTime}
                            minDate={moment().toDate()}
                            onChange={handleStartTimeChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Match End Time"
                            value={selectedEndTime}
                            onChange={handleEndTimeChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </FormGroup>
            </form>
            <Snackbar 
                open={isBooked}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={snackbarColor}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
          </DialogContent>
          <DialogActions>
            <Button onClick={BookMatch} color="primary" variant="outlined">
              Book the match
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
  
