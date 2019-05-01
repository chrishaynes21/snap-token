import React from 'react';
import {Nav, Navbar, NavbarBrand, NavItem} from 'reactstrap';
import {Link, NavLink} from 'react-router-dom';

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
                        <NavLink to='/admin' style={{color: 'white'}} replace>
                            Admin
                        </NavLink>
                    </NavItem>
                );
            }
        };
        return (
            <div>
                <Navbar className='header navbar-dark' expand='md'>
                    <NavbarBrand tag={Link} to='/' style={{color: 'white'}}>Snap Token</NavbarBrand>
                    <Nav className='ml-auto' navbar>
                        {navItem()}
                    </Nav>
                </Navbar>
            </div>
        );
    }
}