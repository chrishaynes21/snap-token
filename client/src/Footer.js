import React from 'react';
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

export default class Footer extends React.Component {
    render() {
        return (
            <Row>
                <Col>
                    <p className="align-self-center">&copy; 2019 Snap Token</p>
                </Col>
            </Row>
        )
    };
}