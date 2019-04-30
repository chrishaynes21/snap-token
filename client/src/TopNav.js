import React from 'react';
import {Nav, Navbar, NavbarBrand, NavbarToggler, NavItem} from 'reactstrap';
import {NavLink} from "react-router-dom";

export default class TopNav extends React.Component {
    render() {
        const navItem = () => {
            if (!this.props.isLoggedIn) {
                return (
                    <NavItem>
                        <NavLink to='/login' style={{color: 'white'}} replace>
                            Login
                        </NavLink>
                    </NavItem>
                );
            } else if (this.props.loginType === 'member') {
                return (
                    <NavItem>
                        <NavLink to='/vendors' style={{color: 'white'}} replace>
                            Vendors
                        </NavLink>
                    </NavItem>
                );
            } else if (this.props.loginType === 'vendor') {
                return (
                    <NavItem>
                        <NavLink to='/vendorAccount' style={{color: 'white'}} replace>
                            Account
                        </NavLink>
                    </NavItem>
                );
            } else {
                return (
                    <NavItem>
                        <NavLink to='/owner' style={{color: 'white'}} replace>
                            Admin Stuff
                        </NavLink>
                    </NavItem>
                );
            }
        };
        return (
            <div>
                <Navbar className="header navbar-dark" expand="md">
                    <NavbarBrand href="/" color="white">Snap Token</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Nav className="ml-auto" navbar>
                        {navItem()}
                    </Nav>
                </Navbar>
            </div>
        );
    }
}