import React, {useState} from 'react';
import Style from './challenges.module.css';

import ChallengesTable from './challengesTable';
import Fab from '@material-ui/core/Fab';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import logo from '../../Assets/mal3abiLogo.svg';

import {useHistory} from 'react-router-dom';
import axios from 'axios';

function Challenges() {

    const history = useHistory();
    
    const [challenges, setAllChallenges] = useState(null);
    const [isChallengesLoading, setChallengesLoading] = useState(false);

    const loadChallenges = () => {
        setChallengesLoading(true);
        axios.get("http://localhost:3001/challenges")
        .then((response) => {

            setChallengesLoading(false);
            setAllChallenges(response.data);

        });
    }

    return(
        <div className={Style.Wrapper}>
            <Fab className="mb-4" variant="extended" data-aos="fade-right" onClick= { loadChallenges }>
                <SearchIcon />
                Search for an opponent
            </Fab>
            { isChallengesLoading ? <CircularProgress /> : null } 
            {challenges != null ?  <ChallengesTable challenges={challenges} /> : null}
        </div>
    );
}

export default Challenges;