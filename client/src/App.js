import React, {Component} from 'react';
import { HashRouter, Route } from 'react-router-dom'
import './App.css';
import TopNav from './TopNav';
import Home from './home/HomePage';
import Footer from './Footer';
import Web3 from '../node_modules/web3';

class App extends Component {
    constructor(props) {
        super(props);
        this.props = {
            web3: new Web3('http://127.0.0.1:7545')
        };
        this.state = {
            isLoggedIn: false,
            loginType: null
        }
    }

    render() {
        return (
            <div className='App'>
                <header>
                    <TopNav/>
                </header>
                <HashRouter>
                    <Route path='/' render={(props) => <Home {...props}/>}/>
                </HashRouter>
                <footer>
                    <Footer/>
                </footer>
            </div>
        );
    }
}

export default App;
