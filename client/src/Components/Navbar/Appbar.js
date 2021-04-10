import React from 'react';
import {useHistory} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SecurityIcon from '@material-ui/icons/Security';

import logo from '../../Assets/mal3abiLogo.svg';

import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontFamily: 'Raleway'
  },
}));

export default function ButtonAppBar(props) {

  const classes = useStyles();
  let history = useHistory();

  const logout = () => {
    axios.get("http://localhost:3001/logout")
    .then((response) => {
      if(response.data["logout"] == true) {
        history.push("/");
      }
    })
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <SecurityIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Admin Dashboard - {props.admin}
          </Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
