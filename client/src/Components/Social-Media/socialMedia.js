import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.8),
    },
  },
}));

export default function Chips() {
  const classes = useStyles();

  const goToFB = () => {
    window.open('https://www.facebook.com/profile.php?id=100004515360178', '_blank');
  }


  const goToInstagram = () => {
    window.open('https://www.instagram.com/bassil_qadi/', '_blank');
  }

  return (
    <div className={classes.root}>
      <Chip
        style={{fontFamily: 'Raleway'}}
        icon={<InstagramIcon />}
        label="bassil_qadi"
        color="secondary"
        variant="outlined"
        onClick={goToInstagram}
      />
      <Chip
        style={{fontFamily: 'Tajawal'}}
        icon={<FacebookIcon />}
        label="باسل القاضي"
        color="primary"
        variant="outlined"
        onClick={goToFB}
      />
    </div>
  );
}
