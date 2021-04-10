import React, {useState} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';

function Player(props) {

    return(
        <div>
            <ListItem>
                <ListItemAvatar>
                    <Avatar style={{color: 'white', backgroundColor: props.color}}>
                        {props.fullName[0]}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                primary={props.fullName}
                secondary={'Position: '.concat(props.position)}
                />
                <ListItemSecondaryAction>
                    <IconButton className="captinStar" edge="end" title="Assign Captin">
                        <StarIcon />
                    </IconButton>
                    <IconButton title="Remove Player" onClick={()=> props.remove(props.playerId)}>
                        <DeleteIcon color={'error'}/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </div>
    )
}

export default Player;