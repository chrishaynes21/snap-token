import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom'
import './App.css';
import TopNav from './TopNav';
import Home from './home/HomePage';
import Footer from './Footer';
import Web3 from '../node_modules/web3';
import Login from "./login/Login";
import {Switch} from "react-router";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: new Web3('http://127.0.0.1:7545'),
            isLoggedIn: false,
            loginType: null
        }
    }

    render() {
        const loginProps = {
            ...this.state
        };

        return (
            <HashRouter>
                <div className='App'>
                    <header>
                        <TopNav/>
                    </header>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' render={() => <Login {...loginProps}/>}/>
                    </Switch>
                    <footer>
                        <Footer/>
                    </footer>
                </div>
            </HashRouter>
        );
    }
}

export default App;
