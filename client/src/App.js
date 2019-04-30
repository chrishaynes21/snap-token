import React, {Component} from 'react';
import {HashRouter, Route} from 'react-router-dom'
import './App.css';
import TopNav from './TopNav';
import Home from './home/HomePage';
import Footer from './Footer';
import Web3 from '../node_modules/web3';
import Login from "./login/Login";
import {Switch} from "react-router";
import Vendors from "./loginFlows/Vendors";
import contractAbi from './contractAbi.json';

class App extends Component {
    constructor(props) {
        super(props);

        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(contractAbi, '0xd6997d525244325409fd8ffe6ab7d46eaf3bdf0a');

        web3.eth.getAccounts().then(function (accounts) {
            web3.eth.defaultAccount = accounts[0];
            console.log(web3.eth.defaultAccount);
        });

        this.state = {
            web3: web3,
            contract: contract,
            isLoggedIn: false,
            loginName: '',
            loginType: null,
        };

        this.login = this.login.bind(this);
    }

    login(userName) {
        if (!this.state.isLoggedIn) {
            this.state.contract.methods.members(userName).call().then((memberAddress) => {
                if (memberAddress === this.state.web3.eth.defaultAccount) {
                    this.setState({loginType: 'member', isLoggedIn: true, loginName: userName});
                    return true;
                }
            });
        }
        if (!this.state.isLoggedIn) {
            this.state.contract.methods.vendors(userName).call().then((memberAddress) => {
                if (memberAddress === this.state.web3.eth.defaultAccount) {
                    this.setState({loginType: 'vendor', isLoggedIn: true, loginName: userName});
                    return true;
                }
            });
        }
        return false;
    };

    render() {
        const loginInfo = {
            login: this.login,
            isLoggedIn: this.state.isLoggedIn
        };
        const vendorOptions = {
            web3: this.state.web3,
            contract: this.state.contract,
            loginName: this.state.loginName
        };


        return (
            <HashRouter>
                <div className='App'>
                    <header>
                        <TopNav {...this.state}/>
                    </header>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' render={() => <Login {...loginInfo}/>}/>
                        <Route exact path='/vendors' render={() => <Vendors {...vendorOptions}/>}/>
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
