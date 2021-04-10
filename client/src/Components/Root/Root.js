import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';

import Bar from '../BottomNavBar/BottomNav';
import LoginModal from '../LoginForm/LoginForm';
import SignupModal  from '../RegisterForm/RegisterForm';
import logo from '../../Assets/mal3abiLogo.svg';

import Style from './Root.module.css';

function Root() {

    let history = useHistory();

    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    const handleLogin = () => {
        setLoginOpen(true);
    }

    const handleSignup = () => {
        setSignupOpen(true);
    }

    const handleClose = () => {
        setLoginOpen(false);
        setSignupOpen(false);
    }

    return(
        <div className={`${Style.Root}`}>
            <div className="row w-100" style={{height: '100vh', margin: '0 auto'}}>
                <div className="col-lg-6" id={`${Style.col1}`}>
                    <div className={`${Style.container}`}>
                        <h1 className="display-4 mb-2">Welcome to Mal3abi App</h1>
                        <p className="lead mb-4">
                            This application is developed to allow people to book their soccer matchs easily. And to make it
                            much easier to soccer fields owners to organize thier schedules
                        </p>
                        <img src="https://img.icons8.com/cotton/64/000000/football2.png" id="ball"/>
                        <Bar login={handleLogin} signup={handleSignup} />
                    </div>
                </div>
                <div className="col-lg-6" id={`${Style.col2}`}>
                    <img src={logo} width="400px" height="400px" data-aos="zoom-in" />
                    <h2>Mal3abi Application &#8482;</h2>
                </div>
            </div>
            <SignupModal open={signupOpen} close={handleClose} />
            <LoginModal open={loginOpen} close={handleClose} />
        </div>  
    );
}

export default Root;