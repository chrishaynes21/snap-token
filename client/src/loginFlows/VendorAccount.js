import React from 'react';
import {
    Button,
    Container,
    DropdownMenu,
    DropdownToggle,
    Input,
    InputGroupButtonDropdown,
    Jumbotron,
    Row
} from 'reactstrap';
import DropdownItem from 'reactstrap/es/DropdownItem';
import InputGroup from 'reactstrap/es/InputGroup';
import InputGroupAddon from 'reactstrap/es/InputGroupAddon';
import {Redirect} from 'react-router';

class VendorAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false,
            selectedVendor: 'Vendor',
            snapAmount: undefined,
            vendors: [],
            spendColor: 'primary',
            balance: 0
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.changeVendor = this.changeVendor.bind(this);
        this.changeSnap = this.changeSnap.bind(this);
        this.spendSnap = this.spendSnap.bind(this);
    }

    componentWillMount() {
        this.getVendorNames();
        this.getBalance();
    }

    getVendorNames() {
        let vendors = [];
        let vendorIndex = 0;

        const addVendor = function (context, counter) {
            context.props.contract.methods.vendorNames(counter).call().then((vendorName) => {
                if (vendorName !== null) {
                    vendors.push(vendorName);
                }
            });
        };

        while (vendorIndex < 100) {
            addVendor(this, vendorIndex++);
        }

        this.setState({
            members: vendors
        });
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    changeVendor(e) {
        this.setState({
            selectedMember: e.currentTarget.getAttribute('name')
        });
    }

    changeSnap(e) {
        this.setState({
            snapAmount: e.target.value
        })
    }

    spendSnap() {
        this.props.contract.methods.useSnap(this.props.loginName, this.state.selectedMember, this.state.snapAmount)
            .send()
            .on('confirmation', (confirmationNumber) => {
                alert('Success: your confirmation is ' + confirmationNumber);
                this.setState({
                    spendColor: 'success'
                });
            })
            .on('error', (error) => {
                alert('Transaction failed with error: ' + error);
                this.setState({
                    spendColor: 'danger'
                });
            });
    }

    getBalance() {
        this.props.contract.methods.getAllowance().call().then((balance) => {
            this.setState({
                balance: balance.toNumber()
            });
        });
    }

    render() {
        if (this.props.loginType === 'vendor') {
            return (
                <div>
                    <Jumbotron style={{marginTop: '50px', marginBottom: '0px'}}>
                        <h1 className='display-3'>Vendor Area</h1>
                        <p className='lead'>
                            Select a vendor to send snap token to.
                        </p>
                        <br/>
                        <h6 className='display-6'>Current Snap Balance</h6>
                        <h1 className='display-4'>{this.state.balance}</h1>
                    </Jumbotron>
                    <Container>
                        <Row style={{paddingTop: '50px'}}>
                            <InputGroup>
                                <InputGroupButtonDropdown
                                    addonType='prepend'
                                    isOpen={this.state.dropdownOpen}
                                    toggle={this.toggleDropdown}>
                                    <DropdownToggle caret>
                                        {this.state.selectedMember}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {this.state.members.map((vendor) => {
                                            return <DropdownItem name={vendor}
                                                                 onClick={this.changeVendor}>{vendor}</DropdownItem>
                                        })}
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>
                                <Input type='number' value={this.state.snapAmount} onChange={this.changeSnap}
                                       placeholder={'Snap Amount'}/>
                                <InputGroupAddon addonType='append'>
                                    <Button color={this.state.spendColor} onClick={this.spendSnap}>Submit</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (<Redirect push to='/'/>);
        }
    };
}

export default VendorAccount;