import React, {useEffect, useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Divider from '@material-ui/core/Divider';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';


import axios from 'axios';

axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: 'white',
    fontFamily: 'Raleway',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  navLink: {
    color: 'white',
    fontSize: '.7em',
    fontFamily: 'Raleway'
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar() {

  let history = useHistory();

  const menuId = 'primary-search-account-menu';
  let renderMenu = null;

  useEffect( () =>{

    axios.get("http://localhost:3001/login")
    .then((response) => {
        if(response.data["loggedIn"] === true) {
            setIsLogged(response.data["loggedIn"]);
            setLoggedUser(`${response.data.user[0].firstName}` + "-"+ `${response.data.user[0].lastName}`);
        } else {
          history.replace("/");
        }
    });
  });

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [loggedUser, setLoggedUser] = useState("");
  
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  function handleLogout() {
    axios.get("http://localhost:3001/logout")
        .then((response) => {
            if(response.data.logout) {
              setIsLogged(false);
              setAnchorEl(null);
              handleMobileMenuClose();
              history.replace("/login");
            }
        });
        console.log(isLogged);
  }

  function goToProfile() {
    setAnchorEl(null);
    handleMobileMenuClose();
    history.replace("/profile/" + loggedUser);
  }

  if(isLogged) {
    renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={goToProfile}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    );
  } else {
    renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem>Login as admin</MenuItem>
      </Menu>
    );
  } 

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{backgroundColor: '#17202A'}} elevation={0}>
        <Toolbar>
          <SportsSoccerIcon
            edge="start"
            className={classes.menuButton}
            style={{color: 'white'}}
            aria-label="open drawer"
          >
            <MenuIcon />
          </SportsSoccerIcon>
          <Typography className={classes.title} variant="h6" noWrap>
            Mal3abi Application
          </Typography>
          
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <img src="https://img.icons8.com/fluent/25/000000/trophy.png"/>
              <Typography className={classes.navLink} variant="h6" noWrap>
                 Tournaments
              </Typography>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <img src="https://img.icons8.com/cotton/25/000000/football2.png"/>
              <Typography className={classes.navLink} variant="h6" noWrap>
                 Book your match
              </Typography>
            </IconButton>
            <Divider style={{backgroundColor: '#5F6A6A'}} orientation="vertical" flexItem />
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              style={{color: 'white'}}
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
