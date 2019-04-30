import React from 'react';
import {Container, DropdownMenu, DropdownToggle, Input, InputGroupButtonDropdown, Jumbotron, Row} from 'reactstrap';
import DropdownItem from "reactstrap/es/DropdownItem";
import InputGroup from "reactstrap/es/InputGroup";

class Vendors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            selectedVendor: '',
            snapAmount: 0
        };

        this.getVendorNames = this.getVendorNames.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.changeVendor = this.changeVendor.bind(this);
        this.changeSnap = this.changeSnap.bind(this)
    }

    getVendorNames() {
        let error = false;
        let counter = 0;
        let vendors = [];
        const addVendor = function(counter) {
            this.props.contract.methods.memberNames(counter).call().then((vendorName) => {
                if (vendorName === '') {
                    error = true;
                } else {
                    console.log(vendorName);
                    vendors.push(vendorName);
                }
            });
        };
        while (!error) {
            addVendor(counter++);
        }
        return vendors;
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeVendor(e) {
        this.setState({
            selectedVendor: e.currentTarget.getAttribute('name')
        });
    }

    changeSnap(e) {
        this.setState({
            snapAmount: e.target.value()
        })
    }

    render() {
        return (
            <div>
                <Jumbotron style={{marginTop: '50px', marginBottom: '0px'}}>
                    <h1 className="display-3">Vendor Area</h1>
                    <p className="lead">
                        Select a vendor to send snap token to.
                    </p>
                </Jumbotron>
                <Container>
                    <Row>
                        <InputGroup>
                            <InputGroupButtonDropdown
                                addonType="prepend"
                                isOpen={this.state.dropdownOpen}
                                toggle={this.toggleDropdown}>
                                <DropdownToggle caret>
                                    Vendors
                                </DropdownToggle>
                                <DropdownMenu>
                                    {this.getVendorNames().map((vendor) => {
                                        return <DropdownItem name={vendor}
                                                             onClick={this.changeVendor}>{vendor}</DropdownItem>
                                    })}
                                </DropdownMenu>
                            </InputGroupButtonDropdown>
                            <Input type='number' value={this.state.snapAmount} onChange={this.changeSnap}
                                   placeholder={'Snap Amount'}/>
                        </InputGroup>
                    </Row>
                </Container>
            </div>
        )
    };
}

export default Vendors;