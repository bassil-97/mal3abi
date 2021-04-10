import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Style from './BookMatch.module.css';

import Navbar from '../Navbar/Navbar';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import FaceIcon from '@material-ui/icons/Face';

import BookingForm from './BookingForm';
import SocialMediaIcons from '../Social-Media/socialMedia';

import axios from 'axios';

axios.defaults.withCredentials = true;

function BookMatch() {

    let history = useHistory();

    const [isLogged, setIsLogged] = useState(false);
    const [loggedUser, setLoggedUser] = useState("");

    useEffect( () =>{
        axios.get("http://localhost:3001/login")
        .then((response) => {
            if(response.data["loggedIn"] === true) {
                setIsLogged(response.data["loggedIn"]);
                setLoggedUser(`${response.data.user[0].firstName} ${response.data.user[0].lastName}`);
            }
        });
    }, []);


    return(
        <div>
            <Navbar />
           <div className={`${Style.container}`}>
                <div className="row">
                    <div className="col-lg-6">
                        <h3 className="border-bottom pb-2"><FaceIcon fontSize="large" /> Welcome, {loggedUser}</h3>
                        <BookingForm />
                    </div>
                    <div className="col-lg-6" id={`${Style.BookingInfo}`}>
                        <h1 className="mb-4">
                            <SportsSoccerIcon fontSize="large" className="mb-2"/> Mal3abi Application &#8482;
                        </h1>
                        <small className="mb-4 w-75 text-center">
                            In Mal3abi Application you can book matches with your
                            friends, play tournaments and lots of other things
                        </small>
                        <div className="row w-100">
                            <div className="col-lg-6">
                                <div className={Style.box}>
                                    <img src="https://img.icons8.com/fluent/50/000000/trophy.png" className="mb-2"/>
                                    <h6>Create Tournaments</h6>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className={Style.box}>
                                <img src="https://img.icons8.com/cotton/50/000000/football2.png" className="mb-2"/>
                                    <h6>Book Matches</h6>
                                </div>
                            </div>
                            
                        </div>
                        <SocialMediaIcons />
                    </div>
                </div>
           </div>
            
        </div>
    );
}

export default BookMatch;