import React, {Component} from 'react';
import './App.css';
import TopNav from "./TopNav";
import Home from "./home/HomePage";
import Footer from "./Footer";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header>
                    <TopNav/>
                </header>
                <Home/>
                <footer>
                    <Footer/>
                </footer>
            </div>
        );
    }
}

export default App;
