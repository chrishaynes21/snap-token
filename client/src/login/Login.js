import React, {Component} from 'react';
import {Button, Container, Input, InputGroup, InputGroupAddon, Jumbotron, Row} from "reactstrap";

class Login extends Component {
    constructor(props) {
        super(props);
        this.loggedIn = props.loggedIn;
        this.loginType = props.loginType;
        this.state = {
            userName: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleChange(event) {
        this.setState({userName: event.target.value})
    }

    handleLogin() {
        this.props.login(this.state.userName);
    }

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1 className="display-3">Login</h1>
                    <p className="lead">
                        Enter your username. Ensure Metamask is logged in.
                    </p>
                </Jumbotron>
                <Container>
                    <Row>
                        <InputGroup>
                            <Input
                                type="text"
                                name="text"
                                id="memberName"
                                placeholder="Ex: username"
                                value={this.state.userName}
                                onChange={this.handleChange}
                            />
                            <InputGroupAddon addonType="append">
                                <Button color="success" onClick={() => this.handleLogin()}>Login</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Login;