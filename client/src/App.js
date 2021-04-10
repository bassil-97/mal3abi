import React, {useEffect} from 'react';

import {Switch, Route} from 'react-router-dom';

import LoginForm from './Components/LoginForm/LoginForm';
import SignupForm from './Components/RegisterForm/RegisterForm';
import BookMatch from './Components/BookMatch/BookMatch';
import Root from './Components/Root/Root';
import UserProfile from './Components/Profile/Profile';
import Dashboard from './Components/Admin/adminDashboard/dashboard';
import Challenges from './Components/Challenges/challenge';
import MyTeam from './Components/myTeam/myTeam';
import SnowStorm from 'react-snowstorm';

import firebase from './firebase';

import './App.css';

function App() {

  useEffect( ()=> {
    const messaging = firebase.messaging();
    messaging.requestPermission().then( ()=> {
      return messaging.getToken();
    }).then(token => {
      console.log('Token: ', token );
    }).catch( (err)=> {
      console.log(err);
    });
  }); 

  return (
    <div className="App">
      
      <Switch>
        <Route exact path="/" component={Root} />
        <Route path="/login" component={LoginForm} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/signup" component={SignupForm} />
        <Route path="/book-match" component={BookMatch}  />
        <Route path="/dashboard" component={Dashboard}  />
        <Route path="/challenges" component={Challenges} />
        <Route path="/MyTeam" component={MyTeam} />
      </Switch>
    </div>
  );
}

export default App;
