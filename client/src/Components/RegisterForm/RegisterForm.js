import React, {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Style from './RegisterForm.module.css';

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import PasswordField from 'material-ui-password-field';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  
    const classes = useStyles();

    let history = useHistory();

    const [usernameReg, setUsernameRegister] = useState("");
    const [passwordReg, setPasswordRegister] = useState("");
    const [firstnameReg, setFirstnameRegister] = useState("");
    const [lastnameReg, setLastnameRegister] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [snackbarColor, setSnackbarColor] = useState("");
    const [snackbarMsg, setSnackbarMsg] = useState("");

    axios.defaults.withCredentials = true;

    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setIsRegistered(false);
    };

  function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
  const register = () => {
      axios.post("http://localhost:3001/register", {
          username: usernameReg,
          password: passwordReg,
          firstname: firstnameReg,
          lastname: lastnameReg
      }
      ).then( (response) => {
          if(response.data.Registered) {
              setSnackbarColor("success");
              setSnackbarMsg("Thank You - your account was created successfully");
              setIsRegistered(true);
              setTimeout(function() {
                  history.replace("/login");
              }, 6000)

          } else {
              setSnackbarColor("error");
              setSnackbarMsg("Sorry - Username is already taken");
              setIsRegistered(true);
          }
          
      }).catch((error) => {
          console.log(error);
      });
      console.log(isRegistered);
  }

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Registration Form
            </Typography>
            <Button
                variant="contained"
                startIcon={<VpnKeyIcon />}
                onClick={register}
            >
                Create new account
            </Button>
          </Toolbar>
        </AppBar>
        <div className={`${Style.container}`}>
            <form className={`${Style.loginForm}`}>
                <FormGroup>
                    <FormControl>
                        <InputLabel htmlFor="my-input">Email address</InputLabel>
                        <Input id="my-input" aria-describedby="my-helper-text" onChange={(e) => {setUsernameRegister(e.target.value)}} />
                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-2">
                        <InputLabel htmlFor="firstName">First Name</InputLabel>
                        <Input id="firstName" aria-describedby="my-helper-text" onChange={(e) => {setFirstnameRegister(e.target.value)}} />
                    </FormControl>
                    <FormControl className="mb-2">
                        <InputLabel htmlFor="lastName">Last Name</InputLabel>
                        <Input id="lastName" aria-describedby="my-helper-text" onChange={(e) => {setLastnameRegister(e.target.value)}} />
                    </FormControl>
                    <FormControl className="mb-4">
                        <InputLabel htmlFor="my-password">Password</InputLabel>
                        <PasswordField
                            id="my-password"
                            onChange={(e) => {setPasswordRegister(e.target.value)}}
                        />
                    </FormControl>
                </FormGroup>
            </form>
            <Snackbar 
                open={isRegistered}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={snackbarColor}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>
        </div>
      </Dialog>
    </div>
  );
}
