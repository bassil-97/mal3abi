import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

const useStyles = makeStyles({
  root: {
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    backgroundColor: 'rgb(108,200,202)'
  },
});

export default function SimpleBottomNavigation(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction className="text-white" label="Create New Account" icon={<SupervisorAccountIcon />} onClick={props.signup} />
      <BottomNavigationAction className="text-white" label="Login" icon={<VpnKeyIcon />} onClick={props.login} />
    </BottomNavigation>
  );
}
