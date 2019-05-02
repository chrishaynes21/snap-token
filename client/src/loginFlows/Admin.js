import React from 'react';
import {
    Button,
    Col,
    Container,
    DropdownMenu,
    DropdownToggle,
    Input,
    InputGroupButtonDropdown,
    Jumbotron,
    Row, Spinner,
    Table
} from 'reactstrap';
import {Redirect} from 'react-router';
import DropdownItem from "reactstrap/es/DropdownItem";
import InputGroup from "reactstrap/es/InputGroup";

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            newUserName: undefined,
            newUserAddress: undefined,
            newAllowance: undefined,
            isVendor: false,
            dropdownOpen: false,
            selectedUserType: 'User Type',
            userSpinner: false,
            allowanceSpinner: false
        };

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.updateUserType = this.updateUserType.bind(this);
        this.updateUserName = this.updateUserName.bind(this);
        this.updateUserAddress = this.updateUserAddress.bind(this);
        this.submitNewUser = this.submitNewUser.bind(this);
        this.updateUserAllowance = this.updateUserAllowance.bind(this);
        this.giveAllowances = this.giveAllowances.bind(this);
        this.getMemberNames = this.getMemberNames.bind(this);
    }

    async componentDidMount() {
        await this.getMemberNames();
    }

    toggleDropdown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    updateUserType(e) {
        const userType = e.currentTarget.getAttribute('name');
        let vendor;
        if (userType === 'Member') {
            vendor = false;
        } else {
            vendor = true;
        }
        this.setState({
            selectedUserType: e.currentTarget.getAttribute('name'),
            isVendor: vendor
        });
    }

    updateUserName(e) {
        this.setState({
            newUserName: e.target.value
        });
    }

    updateUserAddress(e) {
        this.setState({
            newUserAddress: e.target.value
        });
    }

    updateUserAllowance(e) {
        this.setState({
            newAllowance: e.target.value
        });
    }

    submitNewUser() {
        if (this.state.newUserName === undefined ||
            this.state.newUserAddress === undefined ||
            this.state.selectedUserType === 'User Type' ||
            (this.state.newAllowance === undefined && this.state.selectedUserType === 'Member')) {
            alert('No field can be blank.');
        } else {
            this.setState({userSpinner: true});
            if (this.state.selectedUserType === 'Member') {
                this.props.contract.methods.addMember(this.state.newUserName, this.state.newUserAddress, this.state.newAllowance)
                    .send()
                    .on('confirmation', () => {
                        this.setState({userSpinner: false});
                    })
                    .on('error', (error) => {
                        alert('Transaction failed with error: ' + error);
                        this.setState({userSpinner: false});
                    });
            } else {
                this.props.contract.methods.addVendor(this.state.newUserName, this.state.newUserAddress)
                    .send()
                    .on('confirmation', () => {
                        this.setState({userSpinner: false});
                    })
                    .on('error', (error) => {
                        alert('Transaction failed with error: ' + error);
                        this.setState({userSpinner: false});
                    });
            }
        }
    }

    async getMemberNames() {
        let members = [];

        let memberIndex = 0;
        let exit = false;

        const getMember = function (context, counter) {
            return context.props.contract.methods.memberNames(counter).call().then((memberName) => {
                if (memberName !== null) {
                    members.push([memberName, 0]);
                    return false;
                } else {
                    return true;
                }
            });
        };

        while (!exit && memberIndex < 100) {
            // eslint-disable-next-line
            await getMember(this, memberIndex++).then((shouldExit) => {
                exit = shouldExit;
            });
        }

        for (let i = 0; i < members.length; i++) {
            let allowance = await this.getAllowance(members[i][0]);
            members[i][1] = allowance.toNumber();
        }

        this.setState({
            members: members
        });
    }

    getAllowance(memberName) {
        return this.props.contract.methods.members(memberName).call().then((address) => {
            return this.props.contract.methods.allowances(address).call().then((allowance) => {
                return allowance;
            });
        });
    }

    async giveAllowances() {
        this.setState({allowanceSpinner: true});
        this.props.contract.methods.getRequiredEther().call().then((wei) => {
            this.props.contract.methods.giveAllowances()
                .send({value: wei})
                .on('confirmation', () => {
                    this.setState({allowanceSpinner: false});
                })
                .on('error', (error) => {
                    alert('Transaction failed with error: ' + error);
                    this.setState({allowanceSpinner: false});
                });
        });
    }

    render() {
        if (this.props.loginType === 'owner') {
            return (
                <div>
                    <Jumbotron style={{marginTop: '50px', marginBottom: '0px'}}>
                        <h1 className='display-3'>Administration</h1>
                        <p className='lead'>
                            Add members or vendors, increase or decrease allowances, and give allowances.
                        </p>
                    </Jumbotron>
                    <Container>
                        <Row style={{marginTop: '50px'}}>
                            <Col>
                                <Row>
                                    <h4 className='text-muted' style={{textAlign: 'center'}}>Create User</h4>
                                    <InputGroup style={{paddingBottom: '25px'}}>
                                        <InputGroupButtonDropdown
                                            addonType='prepend'
                                            isOpen={this.state.dropdownOpen}
                                            toggle={this.toggleDropdown}>
                                            <DropdownToggle caret>
                                                {this.state.selectedUserType}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem name="Member"
                                                              onClick={this.updateUserType}>Member</DropdownItem>
                                                <DropdownItem name="Vendor"
                                                              onClick={this.updateUserType}>Vendor</DropdownItem>
                                            </DropdownMenu>
                                        </InputGroupButtonDropdown>
                                        <Input type='text' value={this.state.newUserName} onChange={this.updateUserName}
                                               placeholder={'Username'}/>
                                    </InputGroup>
                                </Row>
                                <Row>
                                    <Input type='text' value={this.state.newUserAddress}
                                           onChange={this.updateUserAddress}
                                           placeholder={'Address'}/>
                                </Row>
                                <Row style={{marginTop: '25px'}}>
                                    <Input type='number' value={this.state.newAllowance}
                                           onChange={this.updateUserAllowance}
                                           placeholder={'Allowance'} disabled={this.state.isVendor}/>
                                </Row>
                                <Row style={{marginTop: '25px'}}>
                                    <Button onClick={this.submitNewUser} style={{marginRight: '10px'}}>
                                        Submit New User
                                    </Button>
                                    {this.state.userSpinner ? <Spinner type="grow" color="primary"/> : undefined}
                                </Row>
                            </Col>
                            <Col>
                                <h4 className='text-muted'>Current Members</h4>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Allowance</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.members.map((member, i) => {
                                        return (
                                            <tr key={i}>
                                                <th scope="row">{member[0]}</th>
                                                <td>{member[1]}</td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col>
                                <h4 className='text-muted'>Give Allowances</h4>
                                <Button onClick={this.giveAllowances} style={{marginRight: '10px'}}>
                                    Give Allowances
                                </Button>
                                {this.state.allowanceSpinner ? <Spinner type="grow" color="primary"/> : undefined}
                            </Col>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return (<Redirect push to='/'/>);
        }
    }
    ;
}

export default Admin;