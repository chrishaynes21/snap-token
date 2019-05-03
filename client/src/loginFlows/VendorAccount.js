import React from 'react';
import {Button, Col, Container, Input, Jumbotron, Row, Spinner} from 'reactstrap';
import InputGroup from 'reactstrap/es/InputGroup';
import InputGroupAddon from 'reactstrap/es/InputGroupAddon';
import {Redirect} from 'react-router';

class VendorAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snapAmount: undefined,
            spendColor: 'primary',
            etherPrice: undefined,
            balance: 0,
            spinner: false
        };

        this.changeSnap = this.changeSnap.bind(this);
        this.exchangeSnap = this.exchangeSnap.bind(this);
    }

    componentDidMount() {
        this.getBalance();
        this.getEtherPrice();
    }

    changeSnap(e) {
        this.setState({
            snapAmount: e.target.value
        })
    }

    getEtherPrice() {
        this.props.contract.methods.etherPrice().call().then((etherPrice) => {
            console.log(etherPrice);
            this.setState({
               etherPrice: etherPrice.toNumber()
            });
        })
    }

    exchangeSnap() {
        this.setState({spinner: true});
        this.props.contract.methods.exchangeSnap(this.props.loginName, this.state.snapAmount)
            .send()
            .on('confirmation', () => {
                this.setState({
                    spinner: false,
                    spendColor: 'success'
                });
            })
            .on('error', (error) => {
               alert('Transaction failed with error: ' + error);
                this.setState({
                    spinner: false,
                    spendColor: 'danger'
                });
            });
    }

    getBalance() {
        this.props.contract.methods.getBalance().call().then((balance) => {
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
                        <h1 className='display-3'>Vendor Account</h1>
                        <p className='lead'>
                            Exchange Snap for Ether
                        </p>
                        <br/>
                        <h6 className='display-6'>Current Snap Balance</h6>
                        <h1 className='display-4'>{this.state.balance}</h1>
                    </Jumbotron>
                    <Container>
                        <Row style={{paddingTop: '50px'}}>
                            <Col>
                                <InputGroup>
                                    <Input type='number' value={this.state.snapAmount} onChange={this.changeSnap}
                                           placeholder={'Snap Amount'}/>
                                    <InputGroupAddon addonType='append'>
                                        <Button color={this.state.spendColor}
                                                onClick={this.exchangeSnap}>Submit</Button>
                                        {this.state.spinner ? <Spinner type="grow" color={this.state.spendColor}/> : undefined}
                                    </InputGroupAddon>
                                </InputGroup>
                            </Col>
                            <Col style={{textAlign: 'center'}}>
                                <h4>Ether Amount</h4>
                                <h1 className="display-4">
                                    {this.state.snapAmount && this.state.etherPrice ?
                                        (this.state.snapAmount / this.state.etherPrice).toPrecision(3) : undefined
                                    }
                                </h1>
                            </Col>
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