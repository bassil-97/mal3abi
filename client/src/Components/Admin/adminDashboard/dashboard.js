import React, {useEffect, useState} from 'react';

import { useHistory } from "react-router-dom";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Appbar from '../../Navbar/Appbar';
import MatchsTable from '../../MatchTable/MatchTable';

import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import moment from 'moment';
import axios from 'axios';

axios.defaults.withCredentials = true;

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        padding: theme.spacing(4)
    },
    wrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
    }
}));

function AdminDashboard() {

    let history = useHistory();

    const classes = useStyles();
    const [isLogged, setIsLogged] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");
    const [matchs, setMatchs] = useState();
    const [tournaments, setTournaments] = useState();
    const [isMatchsLoaded, setMatchsLoaded] = useState(false);
    const [isTournamentsLoaded, setTournamentsLoaded] = useState(false);
    const [selectedDate, setSelectedDate] = React.useState(moment(new Date()).format("MMM DD YYYY"));

    useEffect( () =>{
        axios.get("http://localhost:3001/admin-login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setIsLogged(response.data["loggedIn"]);
                setLoggedUser(`${response.data.user[0].firstName} ${response.data.user[0].lastName}`);
            } else {
                history.replace('/');
            }
        });
    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(moment(date).format("MMM DD YYYY"));
    };

    const getAllMatches = () => {
        axios.post("http://localhost:3001/all-matchs", {
            day: selectedDate
        })
        .then((response) => {
            setMatchs(response.data);
            setMatchsLoaded(true);
            console.log(response.data);
        });
    }

    return(
        <div>
            <Appbar admin={loggedUser} />
            <Container maxWidth="xl" className={classes.root}>
                <div className={classes.wrapper}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label="Select matches date"
                            format="MM/dd/yyyy"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <Button variant="contained" color="primary" onClick={getAllMatches}>
                        Show Matches
                    </Button>
                </div>
                { (isMatchsLoaded) ? <MatchsTable 
                    matchs={matchs}
                    loaded={isMatchsLoaded} 
                /> : null}
            </Container>
        </div>
    );
}

export default AdminDashboard;