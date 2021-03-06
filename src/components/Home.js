import React from "react";
import { Button, Jumbotron } from 'react-bootstrap';
import '../css/Home.css';
import { withRouter } from "react-router-dom";

class Home extends React.Component {

    render() {
        return (
            <Jumbotron style={{height:'250px'}}>
                <h1>Welcome to the Clinical System!</h1>
                <p>
                    This system is designed for doctors, nurses and patients.
                    We're here to help you!
                </p>
                <p>
                    <Button bsstyle="primary">Learn more</Button>
                </p>
            </Jumbotron>
        );
    }
}

export default withRouter(Home);
