import React, {Component} from 'react';
import {Button, Jumbotron} from "reactstrap";

class Login extends Component {
    constructor(props) {
        super(props);
        this.loggedIn = props.loggedIn;
        this.loginType = props.loginType;
    }

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1 className="display-3">Login</h1>
                    <p className="lead">
                        Click the button to sign in. Ensure Metamask is logged in.
                    </p>
                    <Button onClick={this.props.handleLoginSubmit.bind(this)}>Login</Button>
                </Jumbotron>
            </div>
        );
    }
}

export default Login;