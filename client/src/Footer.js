import React from 'react';
import Row from 'reactstrap/es/Row';
import Col from 'reactstrap/es/Col';

export default class Footer extends React.Component {
    render() {
        return (
            <Row className='footer' style={{position: 'absolute', bottom: 0, width: '100%', margin: 0}}>
                <Col>
                    <p className='align-self-center'>&copy; 2019 Snap Token</p>
                </Col>
            </Row>
        )
    };
}