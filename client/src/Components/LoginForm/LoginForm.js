import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Style from './LoginForm.module.css';

import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import PasswordField from 'material-ui-password-field';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
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

    const [usernameLogin, setUsernameLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const [loginStatus, setLoginStatus] = useState(false);

    axios.defaults.withCredentials = true;

    const login = () => {
        axios.post("http://localhost:3001/login", {
            username: usernameLogin,
            password: passwordLogin
        }
        ).then( (response) => {
            if(response.data.message) {
                setLoginStatus(response.data.message);
            } else {
                setLoginStatus(response.data[0].userEmail);
                history.push(`/profile/${response.data[0].firstName}-${response.data[0].lastName}`);
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    const adminLogin = () => {
      axios.post("http://localhost:3001/admin-login", {
          username: adminUsername,
          password: adminPassword
      }
      ).then( (response) => {
          if(response.data.message) {
              setLoginStatus(response.data.message);
          } else {
              setLoginStatus(response.data[0].adminEmail);
              history.push(`/dashboard`);
          }

      }).catch((error) => {
          console.log(error);
      });
  }

    let loginMsg = <h6 className="text-center">{loginStatus}</h6>;

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Login Form
            </Typography>
            <Button
                variant="contained"
                startIcon={<VpnKeyIcon />}
                onClick={login}
            >
                Login
            </Button>
          </Toolbar>
        </AppBar>
        <div className={`${Style.container}`}>
            <form className={`${Style.loginForm}`}>
                <FormGroup>
                    <FormControl className="mb-2">
                        <InputLabel htmlFor="my-input">Email address</InputLabel>
                        <Input id="my-input" aria-describedby="my-helper-text" onChange={(e) => {setUsernameLogin(e.target.value)}} />
                        <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                    </FormControl>
                    <FormControl className="mb-4">
                        <InputLabel htmlFor="my-password">Password</InputLabel>
                        <PasswordField
                            id="my-password"
                            onChange={(e) => {setPasswordLogin(e.target.value)}}
                        />
                    </FormControl>
                </FormGroup>
                <div className={`${Style.loginBtn}`}>
                    <small className="mb-2">OR</small>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => setIsAdmin(true)}
                    >Login As Admin</Button>
                </div>
                {loginMsg}
                {(isAdmin) ? 
              <form>
                <FormGroup>
                  <FormControl className="mb-2">
                      <InputLabel htmlFor="my-input">Admin Username</InputLabel>
                      <Input id="my-input" aria-describedby="my-helper-text" onChange={(e) => {setAdminUsername(e.target.value)}} />
                      <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
                  </FormControl>
                  <FormControl className="mb-4">
                      <InputLabel htmlFor="my-password">Admin Password</InputLabel>
                      <PasswordField
                          id="my-password"
                          onChange={(e) => {setAdminPassword(e.target.value)}}
                      />
                  </FormControl>
                </FormGroup>
                <Button size="small" variant="contained" onClick={adminLogin}>Login</Button>
              </form> : null
            }
            </form>
        </div>
      </Dialog>
    </div>
  );
}
