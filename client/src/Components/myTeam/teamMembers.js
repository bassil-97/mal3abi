import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';

import TeamMember from './teamMember';
import CreateTeamForm from './createTeam';
import './myTeam.css';

import axios from 'axios';
import bg from '../../Assets/list.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  demo: {
    backgroundColor: '#fcf8ec',
    minHeight: 310,
    overflowY: 'auto',
    borderTopLeftRadius: '10px',
    borderBottomLeftRadius: '10px',
    boxShadow: '0 4px 8px -2px gray',
    
  },
  createTeam: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  title: {
    margin: theme.spacing(4, 0, 2),
    fontFamily: 'Raleway'
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function InteractiveList(props) {

  useEffect(()=> {
    axios.get('http://localhost:3001/myTeam').
        then((response) => {
          if(response.data['message']) {
              setHasTeam(true);
              setMyTeam(response.data['team'][0]);
              setTeamId(response.data['team'][0]['team_id']);
              axios.post('http://localhost:3001/addedPlayers', {teamId: response.data['team'][0]['team_id']}).
                then((response)=> {
                    if(response.data['message']) {
                        console.log(response.data['players'].length);
                        setPlayersCount(response.data['players'].length);
                        setPlayers(response.data['players']);
                    } else {
                        setPlayersCount(0);
                        setPlayers(null);
                    }
                });
          } else {
              setHasTeam(false);
          }
      });
  }, []);

  const classes = useStyles();
  const [hasTeam, setHasTeam] = useState();
  const [myTeam, setMyTeam] = useState([]);
  const [teamId, setTeamId] = useState();
  const [players, setPlayers] = useState();
  const[playersCount, setPlayersCount] = useState();
  const[openModal, setOpenModal] = useState(false); 

  const closeModal = () => {
    setOpenModal(false);
  }

  const handleOpen = () => {
    setOpenModal(true);
  }

  const createTeamFun = (userId, teamName, numberOfTeamPlayers) => {

    axios.post("http://localhost:3001/createTeam", {
        userId: userId,
        teamName: teamName,
        numOfPlayers: numberOfTeamPlayers,
        
    }
    ).then( (response) => {
        
        if(response.data['message']) {
          setHasTeam(true);
          closeModal();
        } else {
          setHasTeam(false);
          closeModal();
        }
    }).catch((error) => {
        console.log(error);
    });
}

const removePlayer = (playerId) => {
  axios.get(`http://localhost:3001/removePlayer?playerId=${playerId}&teamId=${teamId}`).
  then((response) => {
      if(response.data['removed']) {
          setPlayersCount(response.data['players'].length);
          setPlayers(response.data['players']);
      } else if(response.data['playersCount'] == 0) {
          setPlayersCount(0);
      }
  }); 
}

  let createTeam = (<div className={classes.createTeam}>
    <Button
      variant="contained"
      color="default"
      size="small"
      className={classes.button}
      startIcon={<AddCircleOutlineIcon />}
      onClick={handleOpen}
    >
      Create your team
    </Button>
  </div>);

  let list = null;

  list = <List className={classes.demo} id="testScroll">
  { (players != undefined && (playersCount > 0)) ? players.map((player)=> {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    return <TeamMember fullName={capitalizeFirstLetter(player['firstName']) + ' ' + capitalizeFirstLetter(player['lastName'])} 
                      color={'#'+randomColor} 
                      position={player['player_position']} 
                      playerId={player['player_id']}
                      remove={removePlayer}
                      />
  }): <h5 className="text-center">You don't have any players</h5>}
</List>;
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className={classes.root}>
        <CreateTeamForm open={openModal} Close={closeModal} create={createTeamFun} />
        <Typography variant="h6" className={classes.title}>
            {(hasTeam) ? <div><PeopleOutlineIcon />Team Members</div> : <div>Add your Team Members</div>}
        </Typography>
        {
          (hasTeam) ? <div className={classes.demo}>
             {list}
        </div> : createTeam
        }
    </div>
  );
}
