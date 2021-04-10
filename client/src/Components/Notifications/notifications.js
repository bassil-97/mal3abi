import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';


import axios from 'axios';

const useStyles = makeStyles({
    list: {
      width: 250
    },
    fullList: {
      width: 'auto'
    },
});


function Notifications(props) {

    const classes = useStyles();

    useEffect( ()=> {
        axios.get("http://localhost:3001/notifications").
            then(response => {
                if(response.data != null) {
                  console.log(response.data);
                    setUserNotifications(response.data);
                    setUserNotificationsCount((response.data).length);
                }     
        });
    }, []);

    const [userNotifications, setUserNotifications] = useState([]);
    const [userNotificationsCount, setUserNotificationsCount] = useState(0);
    const [state, setState] = React.useState({
        top: false,
    });
    
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }

        if(open == false) {
            setUserNotificationsCount(0);
            axios.get("http://localhost:3001/notificationViewed").
                then(response => {
                    console.log(response.data);
            });
        }
    
        setState({ top: open });
        
    };

    const resetNotificationCounter = ()=> {
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
            { (userNotificationsCount > 0) ? userNotifications.map((item) => (
              <ListItem button key={item['notification_id']}>
                <ListItemIcon> <InfoOutlinedIcon color="primary" /> </ListItemIcon>
                <ListItemText primary={item['notification_content']} />
              </ListItem>
            )) : <ListItem> There is no notifications</ListItem>}
          </List>
        </div>
    );

    return(
        <div>
            <Badge badgeContent={userNotificationsCount} color="secondary"  onClick = {resetNotificationCounter}>
                <NotificationsIcon />
            </Badge>
            <Drawer anchor={'top'} open={state['top']} onClose={toggleDrawer(false)}>
                {list('top')}
            </Drawer>
        </div>
    )
}

export default Notifications;