import 'date-fns';

import React, {useState, useEffect} from 'react';

import { makeStyles, withStyles} from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import axios from 'axios';

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
    form: {
        padding: '0px 30px'
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
    
    const [userId, setUserId] = useState();
    const [teamName, setTeamName] = useState("");
    const [numberOfTeamPlayers, setNumOfPlayers] = useState(7);

    useEffect( () =>{
        axios.get("http://localhost:3001/login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setUserId(response.data.user[0].user_id);
            }
        });
    }, []);

    return (
      <div>
        <Dialog onEscapeKeyDown={props.Close} fullWidth={true} onClose={props.Close} aria-labelledby="customized-dialog-title" open={props.open}>
          <DialogTitle id="customized-dialog-title" onClose={props.Close}>
                Mal3abi | Create Team
          </DialogTitle>
          <DialogContent dividers>
            <form>
                <FormGroup>
                    <FormControl className="mb-4">
                        <InputLabel htmlFor="teamName">Team Name</InputLabel>
                        <Input id="teamName" aria-describedby="my-helper-text" onChange={(e) => {setTeamName(e.target.value)}} />
                        <FormHelperText id="my-helper-text">Choose unique name for your team</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-4">
                        <InputLabel id="demo-simple-select-label">Number of available players</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={numberOfTeamPlayers}
                            onChange={(e)=> setNumOfPlayers(e.target.value)}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                        </Select>
                    </FormControl>
                </FormGroup>                       
            </form>
          </DialogContent>
          <DialogActions>
            <Button color="default" variant="outlined" onClick={ ()=> props.create(userId, teamName, numberOfTeamPlayers)}>
              Create My Team
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
  
