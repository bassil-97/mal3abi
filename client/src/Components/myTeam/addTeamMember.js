import React, {useState, useEffect} from 'react';
import {makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Alert from '@material-ui/lab/Alert';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    addMembers: {
        padding: '0px'
    },
    addMembers: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '16px',
        backgroundColor: '#d0e8f2',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px'
    },
    title: {
        margin: theme.spacing(4, 0, 2),
        fontFamily: 'Raleway'
    },
    button: {
        margin: theme.spacing(0, 0, 2, 0)
    },
    bottomDiv: {
        width: '100%',
        backgroundColor: '#d0e8f2',
        borderTop: '1px solid lightgrey',
        padding: '30px',
        borderBottomRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        boxShadow: '0 4px 4px -2px gray'
    }
}));

function Alert1(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AddTeamMember(props) {

    useEffect(()=> {
        axios.get('http://localhost:3001/myTeam').
        then((response) => {
            if(response.data['message']) {
                setHasTeam(true);
                setMyTeam(response.data['team'][0]['number_of_players']);
                setTeamId(response.data['team'][0]['team_id']);

                axios.post('http://localhost:3001/addedPlayers', {teamId: response.data['team'][0]['team_id']}).
                then((response)=> {
                    if(response.data['message']) {
                        setStoredPlayers(response.data['players'].length);
                        if(response.data['players'].length == myTeam) {
                            setIsDisabled(true);
                        }
                    } else {
                        setStoredPlayers(0);
                    }
                });
            } else {
                setHasTeam(false);
            }
        }); 

    }); 

    const classes = useStyles();

    const [firstName, setFirstname] = useState();
    const [lastName, setLastname] = useState();
    const [playerPosition, setPlayerPosition] = useState("GK");
    const [myTeam, setMyTeam] = useState(props.team);
    const [hasTeam, setHasTeam] = useState(props.hasTeam);
    const [storedPlayers, setStoredPlayers] = useState(props.storedPlayers);
    const [teamId, setTeamId] = useState(props.teamId);
    const [isDisabled, setIsDisabled] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarColor, setSnackbarColor] = useState();
    const [snackbarMsg, setSnackbarMsg] = useState();

    let playerInformationInput = (<form autoComplete="no">
        <FormGroup>
          <div className="d-flex flex-row mb-2">
              <FormControl className="mb-2 mr-4">
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <Input id="firstName" onChange={(e) => {setFirstname(e.target.value)}} />
              </FormControl>
              <FormControl className="mb-2">
                  <InputLabel htmlFor="lastName">Last Name</InputLabel>
                  <Input id="lastName" onChange={(e) => {setLastname(e.target.value)}} />
              </FormControl>
          </div>
          <FormControl className="mb-4">
              <InputLabel id="demo-simple-select-label">Player Position</InputLabel>
              <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={playerPosition}
                  onChange={(e)=> setPlayerPosition(e.target.value)}
              >
                  <MenuItem value="GK">Goal Keeper (GK)</MenuItem>
                  <MenuItem value="CB">Center Back (CB)</MenuItem>
                  <MenuItem value="MD">Mid Field (MD)</MenuItem>
                  <MenuItem value="ST">Striker (ST)</MenuItem>
              </Select>
          </FormControl>
        </FormGroup>
    </form>);

    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenSnackbar(false);
    };

    const handleAdd = (playerPosition, teamId, firstName, lastName) => {

        if(!firstName || !lastName || !playerPosition) {
            setSnackbarColor("error");
            setSnackbarMsg("Fill all player's information");
            handleClick();
        } else {
            axios.post("http://localhost:3001/addPlayer", {
                playerPosition: playerPosition,
                teamId: teamId,
                firstName: firstName,
                lastName: lastName
                }).then((response) => {
                    if(response.data['message'] == true) {
                        setSnackbarColor("success");
                        setSnackbarMsg(`${firstName} ${lastName} was Added to your team`);
                        handleClick();
                        if(storedPlayers < myTeam) {
                            setStoredPlayers(storedPlayers + 1);
                        } else {
                            setIsDisabled(true);
                        }
                    }
            });
        }

    }

    return(
        <div>
            <Typography variant="h6" className={classes.title}>
                <GroupAddIcon fontSize='large' /> Add Players to your team
            </Typography>
            <div className={classes.addMembersWrapper}>
                <div className={classes.addMembers}>
                    {playerInformationInput}
                    <Button
                        variant="outlined"
                        color="default"
                        size="medium"
                        className={classes.button}
                        startIcon={<AddCircleOutlineIcon />}
                        disabled={isDisabled}
                        onClick={()=> handleAdd(playerPosition, teamId, firstName, lastName)}
                    >
                        Add New Player
                    </Button>
                    { (hasTeam && (storedPlayers < myTeam)) ? storedPlayers + ` / ` + myTeam 
                    : <Alert severity="success" variant="filled" data-aos="zoom-in">you have added all your team players [{storedPlayers}]</Alert> }
                    <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={snackbarColor} variant="filled">
                        {snackbarMsg}
                        </Alert>
                    </Snackbar>
                </div>
                <div className={classes.bottomDiv}></div>
            </div>
        </div>
    )

}

export default AddTeamMember;