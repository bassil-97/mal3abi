import React, {useEffect, useState} from 'react';

import { useHistory } from "react-router-dom";

import Container from '@material-ui/core/Container';
import Sidebar from '../Siderbar/Sidebar';

import Style from './Profile.module.css';

import axios from 'axios';

axios.defaults.withCredentials = true;

function UserProfile() {

    let history = useHistory();

    const [isLogged, setIsLogged] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");
    const [matchs, setMatchs] = useState();
    const [tournaments, setTournaments] = useState();
    const [userNotifications, setUserNotifications] = useState();
    const [isMatchsLoaded, setMatchsLoaded] = useState(false);
    const [isTournamentsLoaded, setTournamentsLoaded] = useState(false);

    useEffect( () =>{
        axios.get("http://localhost:3001/login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setIsLogged(response.data["loggedIn"]);
                setLoggedUser(`${response.data.user[0].firstName} ${response.data.user[0].lastName}`);
            } else {
                history.replace('/');
            }
        });

        axios.get("http://localhost:3001/matchs")
        .then((response) => {
            setMatchs(response.data);
            setMatchsLoaded(true);
            console.log(response.data);
        });

        axios.get("http://localhost:3001/tournaments")
        .then((response) => {
            setTournaments(response.data);
            setTournamentsLoaded(true);
            console.log(response.data);
        });

    }, []);

    return(
        <Container maxWidth="xl" style={{ height: '100vh', padding: '0'}}>
            { (isMatchsLoaded && isTournamentsLoaded) ? <Sidebar 
                loggedUser={loggedUser} 
                matchs={matchs} 
                tournaments={tournaments}
                loaded={isMatchsLoaded && isTournamentsLoaded} 
            /> : null}
        </Container>
    );
}

export default UserProfile;