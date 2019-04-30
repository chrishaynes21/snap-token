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
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Vendors from "./loginFlows/Vendors";

class App extends Component {
    constructor(props) {
        super(props);

        const web3 = new Web3(Web3.givenProvider);
        const contract = new web3.eth.Contract(contractAbi, '0xc64f893ba4c20f9b1b196efc001a39cbcc95b11a');

        web3.eth.getAccounts().then(function (accounts) {
            web3.eth.defaultAccount = accounts[0];
            console.log(web3.eth.defaultAccount);
        });

        this.state = {
            web3: web3,
            contract: contract,
            isLoggedIn: false,
            loginType: null,
            errorModal: false
        };

        this.login = this.login.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    login(userName) {
        if (!this.state.isLoggedIn) {
            this.state.contract.methods.members(userName).call().then((memberAddress) => {
                if (memberAddress === this.state.web3.eth.defaultAccount) {
                    this.setState({loginType: 'member', isLoggedIn: true})
                }
            });
        }
        if (!this.state.isLoggedIn) {
            this.state.contract.methods.vendors(userName).call().then((memberAddress) => {
                if (memberAddress === this.state.web3.eth.defaultAccount) {
                    this.setState({loginType: 'vendor', isLoggedIn: true})
                }
            });
        }

        if (!this.state.loggedIn) {
            this.setState({errorModal: true});
        }
    }

    toggleModal() {
        this.setState((prevState) => ({
            errorModal: !prevState.errorModal
        }));
    }

    render() {
        const loginFunction = {
            login: this.login
        };
        const vendorOptions = {
            web3: this.state.web3,
            contract: this.state.contract
        };

        return (
            <HashRouter>
                <div className='App'>
                    <header>
                        <TopNav {...this.state}/>
                    </header>
                    <Modal isOpen={this.state.errorModal} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
                        <ModalBody>
                            Unable to login. Please contact Snap owner to register.
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggleModal}>Close</Button>
                        </ModalFooter>
                    </Modal>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/login' render={() => <Login {...loginFunction}/>}/>
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
