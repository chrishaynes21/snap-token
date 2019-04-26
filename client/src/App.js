import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom'
import './App.css';
import TopNav from './TopNav';
import Home from './home/HomePage';
import Footer from './Footer';
import Web3 from '../node_modules/web3';
import Login from "./login/Login";
import {Switch} from "react-router";

import contractAbi from './contractAbi.json';

class App extends Component {
    constructor(props) {
        super(props);

        const web3 = new Web3('http://192.168.56.1:7545');
        const contract = new web3.eth.Contract(contractAbi, '0x6148a781fe26560f007ce96fc27802fe335d0952');

        this.state = {
            web3: web3,
            contract: contract,
            isLoggedIn: false,
            loginType: null,
            loginAddress: null
        };
    }

    handleLoginSubmit() {
        alert('Click');
    }

    render() {
        const loginFunction = {
            handleLoginSubmit: this.handleLoginSubmit
        };
        return (
            <HashRouter>
                <div className='App'>
                    <header>
                        <TopNav/>
                    </header>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' render={() => <Login {...loginFunction}/>}/>
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
