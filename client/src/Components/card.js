import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

import axios from 'axios';

const useStyles = makeStyles( (theme) => ({
  root: {
    width: '100%'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    color: 'white',
    margin: theme.spacing(1),
  },
}));

export default function SimpleCard(props) {

  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {props.item['userEmail']}
        </Typography>
        <Typography variant="h5" component="h2">
          {props.item['firstName'] + ' ' + props.item['lastName']}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {props.item['challengeTitle']}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          style={{backgroundColor: 'green'}}
          className={classes.button}
          startIcon={<CheckCircleIcon />}
          onClick={()=> props.accept(props.item['challenge_id'], props.item['secondTeamLeader'])}
        >
          Accept Challenge
        </Button>
        <Button
          variant="contained"
          style={{backgroundColor: 'red'}}
          className={classes.button}
          startIcon={<CancelIcon />}
          onClick={()=> props.decline(props.item['challenge_id'], props.item['secondTeamLeader'])}
        >
          Decline Challenge
        </Button>
      </CardActions>
    </Card>
  );
}
