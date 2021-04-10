import React, {useEffect, useState} from 'react';

import {useHistory} from 'react-router-dom';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import EditIcon from '@material-ui/icons/Edit';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Button from '@material-ui/core/Button';

import Avatar from '../../Avatar/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import DataTable from '../../MatchTable/MatchTable';
import TournamentsTable from '../../TournamentTable/TournamentTable';
import Tournament from '../../TournamentModal/TournamentModal';
import BookingForm from '../../BookMatch/BookingForm';

import axios from 'axios';
import logo from '../../../Assets/mal3abiLogo.svg';
import './Sidebar.css';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    backgroundColor: '#17202A',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(10),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    fontFamily: 'Raleway'
  },
  logo: {
    width: '100%',
    position: 'absolute',
    bottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    height: '100%',
    backgroundColor: '#F5F5F5',
    boxShadow: '0 0 4px #ADADAD',
    padding: theme.spacing(3),
    borderRadius: '4px',
    fontFamily: 'Raleway',
    textAlign: 'center'
  }
}));

export default function MiniDrawer(props) {

  useEffect(()=> {
    setLoaded(props.loaded);
    if(isLoaded) {
      if(props.matchs.length > 0) {
        setFirstMatch(props.matchs[0]["match_start_time"]);
      } else {
        setFirstMatch("You dont have any matchs");
      }

      if(props.tournaments.length > 0) {
        setFirstTournament(props.tournaments[0]["tournament_start_time"]);
      } else {
        setFirstTournament("You dont have any tournaments");
      }
    }
  });

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [matchs, setMatchs] = useState();
  const [firstMatch, setFirstMatch] = useState();
  const [firstTournament, setFirstTournament] = useState();
  const [isLoaded, setLoaded] = useState(false);
  const [OpenModal, setOpenModal] = useState(false);
  const [openBookMatch, setOpenBookMatch] = useState(false);

  let myMatchs = null;

  const skeleton = (
    <div className="w-75">
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
    </div>
  );
  
  const history = useHistory();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const bookNewMatch = () => {
    setOpenBookMatch(true);
  }

 
  const createTournament = () => {
    setOpenModal(true);
  }

  const closeModal = () => {
    setOpenModal(false);
    setOpenBookMatch(false);
  }

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
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap style={{fontFamily: 'Raleway'}}>
          Mal3abi Application - {props.loggedUser}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <div className="drawer-header">
          <Avatar user={props.loggedUser}/>
          <h4>Admin Dashboard</h4>
        </div>
        <Divider />
        <List>
          <ListItem button key="k1">
            <ListItemIcon><DateRangeIcon /></ListItemIcon>
            <ListItemText primary="My Matches" />
          </ListItem>
          <ListItem button key="k2" onClick={() => bookNewMatch()}>
            <ListItemIcon><AddCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Book New Match" />
          </ListItem>
          <ListItem button key="k3" onClick={() => createTournament()}>
            <ListItemIcon><SportsSoccerIcon color="error" /></ListItemIcon>
            <ListItemText primary="Create Tournaments" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key="k4">
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText primary="Edit Profile" />
          </ListItem>
          <ListItem button key="k5" onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
        <Divider />
        <div className={classes.logo}>
          <img src={logo} width="40px" height="40px" />
        </div>
      </Drawer>
      <main className={classes.content} data-aos="zoom-in">
        <div className="w-100">
          <h5><i class="fas fa-futbol"></i> Matchs</h5>
          {isLoaded ? <DataTable matchs={props.matchs} /> : skeleton}
        </div>
        <Tournament open={OpenModal} onClose={closeModal} user={props.loggedUser} />
        <BookingForm open={openBookMatch} Close={closeModal} />
        <div className="row w-100 my-4">
          <div className="col-lg-6">
            <div className={classes.box}>
              <img src="https://img.icons8.com/cotton/64/000000/calendar.png"/>
              <h4 className="mt-2 mb-4">Upcoming Match</h4>
              <h6>{firstMatch}</h6>
            </div>
          </div>
          <div className="col-lg-6">
            <div className={classes.box}>
            <img src="https://img.icons8.com/cotton/64/000000/trophy--v1.png"/>
              <h4 className="mt-2 mb-4">Upcoming Tournaments</h4>
              <h6>{firstTournament}</h6>
            </div>
          </div>
        </div>
        <div className="w-100 mb-4">
          <h5><i class="fas fa-trophy"></i> Tournaments</h5>
          {isLoaded ? <TournamentsTable tournaments={props.tournaments} /> : skeleton}
        </div>
      </main>
    </div>
  );
}
