import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Card from '../card';

import axios from 'axios';

const useStyles = makeStyles({
    list: {
      width: 250
    },
    fullList: {
      width: 'auto'
    },
});

function MyChallenges(props) {

    const classes = useStyles();

    useEffect( ()=> {
      axios.get('http://localhost:3001/myChallenges').
      then(response => {
        if(response.data != null) {
          setMyChallenges(response.data);
          setMyChallengesCount((response.data).length);
        }
          
      });

    }, []); 

    const [myChallenges, setMyChallenges] = useState([]);
    const [myChallengesCount, setMyChallengesCount] = useState(0);
    const [state, setState] = React.useState({
        top: false,
    });


    const acceptChallenge = (challengeId, opponentId) => {
      axios.get(`http://localhost:3001/acceptChallenge?id=${challengeId}&opponentId=${opponentId}`).
      then(response => {
        if(response.data['message']) {
          axios.get('http://localhost:3001/myChallenges').
            then(response => {
              if(response.data != null) {
                setMyChallengesCount((response.data).length);
                setMyChallenges(response.data);
              } else {
                setMyChallengesCount(0);
              }
            });
          } else {
            setMyChallengesCount(0);
          }
      });
    }

    const declineChallenge = (challengeId, opponentId) => {
      axios.get(`http://localhost:3001/declineChallenge?id=${challengeId}&opponentId=${opponentId}`).
      then(response => {
        if(response.data['message']) {
          axios.get('http://localhost:3001/myChallenges').
            then(response => {
              if(response.data != null) {
                setMyChallengesCount((response.data).length);
                setMyChallenges(response.data);
              } else {
                setMyChallengesCount(0);
              }
            });
          } else {
            setMyChallengesCount(0);
          }
      });
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        setState({ top: open });
        
    };

    const openChallengesDrawer = () => {
        setState({top: true});
    }

    const list = (anchor) => (
        <div
          className={clsx(classes.list, {
            [classes.fullList]: anchor === 'top' || anchor === 'bottom',
          })}
          role="presentation"
          onClick={toggleDrawer('top', false)}
          onKeyDown={toggleDrawer('top', false)}
        >
          <List>
            { (myChallengesCount > 0) ? myChallenges.map((item) => (
              <ListItem button key={item['challenge_id']}>
                <ListItemIcon> <InfoOutlinedIcon color="primary" /> </ListItemIcon>
                <Card item={item} accept={acceptChallenge} decline={declineChallenge} />
              </ListItem>
            )) : <ListItem> There is no challenges</ListItem>}
          </List>
        </div>
    );

    return(
        <div>
            <ListAltIcon onClick={openChallengesDrawer} />
            <Drawer anchor={'top'} open={state['top']} onClose={toggleDrawer(false)}>
                {list('top')}
            </Drawer>
        </div>
    )

}

export default MyChallenges;