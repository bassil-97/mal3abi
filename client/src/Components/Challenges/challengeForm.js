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

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
//import { ColorPicker } from 'material-ui-color';
import { ColorPalette } from 'material-ui-color';
//import { ColorBox } from 'material-ui-color';

import axios from 'axios';

import Style from './challenges.module.css';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: '#2E86C1',
      color: 'white'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    shirtColor: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }
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
      backgroundColor: '#ECF0F1'
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

    const palette = {
        red: '#ff0000',
        blue: '#0000ff',
        green: '#00ff00',
        yellow: 'yellow',
        cyan: 'cyan',
        lime: 'lime',
        gray: 'gray',
        orange: 'orange',
        purple: 'purple',
        black: 'black',
        white: 'white',
        pink: 'pink',
        darkblue: 'darkblue',
    };
    
    const[userId, setUserId] = useState(0);
    const [teamLeader, setTeamLeaderName] = useState("");
    const [challengeTitle, setChallengeTitle] = useState("");
    const [isBooked, setBookingStatus] = useState(false);
    const [snackbarColor, setSnackbarColor] = useState("");
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [shirtColor, setShirtColor] = useState('#000000');
    

    useEffect( () =>{
        axios.get("http://localhost:3001/login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setUserId(response.data.user[0].user_id);
            }
        });
    }, []);

    const handleChange = (value) => {
        console.log(value);
        setShirtColor(value);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setBookingStatus(false);
      };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const createChallenge = () => {

        axios.post("http://localhost:3001/create-challenge", {
            userId: userId,
            teamLeader: teamLeader,
            challengeTitle: challengeTitle,
            challengeStatus: 'available',
            shirtColor: shirtColor
        }
        ).then( (response) => {
            console.log("response log " + response.data.matchStatus);
            
            if(response.data.matchStatus) {
                setSnackbarColor("success");
                setSnackbarMsg("Your challenge was created successfully");
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
          <DialogTitle id="customized-dialog-title" onClose={props.Close} backgroundColor={shirtColor}>
          <img src="https://img.icons8.com/cotton/30/000000/football-goal.png"/>
          &nbsp; Mal3abi | Create Challenge
          </DialogTitle>
          <DialogContent dividers>
          <form className={`${Style.ChallengesForm}`}>
                <FormGroup>
                    <FormControl className="mb-2">
                        <InputLabel htmlFor="teamLeader">Team Leader Name</InputLabel>
                        <Input id="teamLeader" aria-describedby="my-helper-text" onChange={(e) => {setTeamLeaderName(e.target.value)}} />
                        <FormHelperText id="my-helper-text">We'll never share your personal data.</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-4">
                        <InputLabel htmlFor="challengeTitle">Challenge Title</InputLabel>
                        <Input id="challengeTitle" aria-describedby="my-helper-text" onChange={(e) => {setChallengeTitle(e.target.value)}} />
                    </FormControl>
                    <FormControl>
                        <div className="row">
                            <div className="col-lg-6">
                                <h6>Shirt Color</h6>
                                <i class="fas fa-tshirt fa-4x" 
                                    id="shirtLabel"
                                    style={{color:shirtColor}}
                                ></i>
                            </div>
                            <div className="col-lg-6">
                                <ColorPalette palette={palette} value={shirtColor} onSelect={handleChange}/>
                            </div>
                        </div>
                    </FormControl>
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
            <Button onClick={createChallenge} color="primary" variant="outlined">
              Create Challenge
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
  
