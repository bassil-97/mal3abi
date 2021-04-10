import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import FaceIcon from '@material-ui/icons/Face';
import TeamMembers from './teamMembers';
import AddTeamMember from './addTeamMember';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import Chip from '@material-ui/core/Chip';
import EventIcon from '@material-ui/icons/Event';
import AppsIcon from '@material-ui/icons/Apps';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import anime from 'animejs';
import './myTeam.css';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    title: {
      margin: theme.spacing(4, 0, 2),
      fontFamily: 'Raleway',
    },
    button: {
        width: '100%',
        margin: theme.spacing(1)
    },
    chip: {
        margin: theme.spacing(1)
    }
  }));

function MyTeam(props) {

    const [isDisabled, setIsDisabled] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");
    const [myTeam, setMyTeam] = useState();
    const [hasTeam, setHasTeam] = useState();
    const [teamId, setTeamId] = useState();
    const [open, setOpen] = useState(false);

    let history = useHistory();
    const classes = useStyles();

    useEffect( ()=> {
        axios.get("http://localhost:3001/login").then((response) => {
            if(response.data["loggedIn"] == true) {
                setLoggedUser(`${capitalizeFirstLetter(response.data.user[0].firstName)} ${capitalizeFirstLetter(response.data.user[0].lastName)}`);
            } else {
                history.replace('/');
            }
        });

        axios.get('http://localhost:3001/myTeam').
        then((response) => {
            if(response.data['message']) {
                setHasTeam(true);
                setMyTeam(response.data['team'][0]);
                setTeamId(response.data['team'][0]['team_id']);
            } else {
                setHasTeam(false);
            }
        });
    }, []);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const openScreen = ()=> {
       setIsDisabled(true);
        anime({
            targets: '.leftSide',
            translateX: -800,
            duration: 6000,
            easing: 'easeInOutExpo'
        });
        anime({
            targets: '.rightSide',
            translateX: 800,
            duration: 6000,
            easing: 'easeInOutExpo'
        });
        
         setTimeout(() => {
            document.getElementsByClassName('leftSide')[0].style.display = "none";
            document.getElementsByClassName('rightSide')[0].style.display = "none";
            document.getElementsByTagName('body')[0].style.overflowY = 'scroll';
        }, 6500); 
    }    

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

   const removeTeam = (teamId) => {

    axios.get(`http://localhost:3001/removeTeam?teamId=${teamId}`).
    then((response) => {
        if(response.data['message']) {
            handleClose();
            setHasTeam(false);
            history.replace('/profile');
        } else {
            setHasTeam(true);
        }
    });

   }

    return(
        <div className="Wrapper">
            <div className="showTeamBtn">
                <Fab color="default" aria-label="add" disabled={isDisabled}>
                    <LockOpenIcon fontSize="large" onClick={openScreen} />
                </Fab>
            </div>
            <div className="leftSide"></div>
            <div className="rightSide"></div>
            <div className="myTeam-body">
                <div className="myTeam-header">
                    <h3><FaceIcon fontSize="large" /> {loggedUser}'s Team</h3>
                    <Divider className=" mb-4"/>
                    <div className="row">
                        <div className="col-lg-4">
                            <TeamMembers teamId={teamId}/>
                        </div>
                        <div className="col-lg-4">
                            {
                                (hasTeam) ? <AddTeamMember hasTeam={hasTeam} teamId={teamId} /> : null
                            }
                        </div>
                        <div className="col-lg-4">
                            {
                                (hasTeam) ? <div>
                                    <Typography variant="h6" className={classes.title}>
                                    <SettingsIcon />
                                    Team Settings
                                    </Typography>
                                    <div className="teamSettings">
                                        <Button
                                            style={{backgroundColor: '#456268', color: 'white'}}
                                            variant="contained"
                                            color="default"
                                            className={classes.button}
                                            startIcon={<EditIcon />}
                                        >
                                            Edit Team Information
                                        </Button>
                                        <Button
                                            style={{backgroundColor: '#F44336', color: 'white'}}
                                            variant="contained"
                                            className={classes.button}
                                            startIcon={<DeleteIcon />}
                                            onClick={handleClickOpen}
                                        >
                                            Remove My Team
                                        </Button>
                                    </div>
                                    <Divider className="mb-4" />
                                    <div className="team-information">
                                        <Chip
                                            className={classes.chip}
                                            icon={<EventIcon style={{color: 'white'}} />}
                                            label={(myTeam != undefined)? "Creation Date | "+ myTeam['creation_date']: "-"}
                                            clickable
                                            style={{backgroundColor: '#79a3b1', color: 'white'}}
                                        />
                                        <Chip
                                            className={classes.chip}
                                            icon={<AppsIcon style={{color: 'white'}} />}
                                            label={(myTeam != undefined)? "# of players ["+ myTeam['number_of_players']+"]": "-"}
                                            clickable
                                            style={{backgroundColor: '#79a3b1', color: 'white'}}
                                        />
                                        <Chip
                                            className={classes.chip}
                                            icon={<TextFieldsIcon style={{color: 'white'}} />}
                                            label={(myTeam != undefined)? "Team Name - "+ myTeam['team_name']: "-"}
                                            clickable
                                            style={{backgroundColor: '#79a3b1', color: 'white'}}
                                        />
                                    </div>
                                </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"><WarningIcon style={{color: '#FFEB3B'}} /> {"Team Settings - Remove Team"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure that you want to delete your team. Any deleted items will be permanently sremoved.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button 
                    onClick={()=> removeTeam(teamId)} 
                    style={{backgroundColor: 'red', color: 'white'}}
                    startIcon={<DeleteIcon />}
                >
                    Remove Team
                </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MyTeam;