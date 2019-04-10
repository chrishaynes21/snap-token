import React from 'react';
import { Jumbotron } from 'reactstrap';
import grocery_image from '../images/GroceryStore.jpg';

const Home = (props) => {
    return (
        <div>
            <Jumbotron>
                <h1 className="display-3">Snap Token</h1>
                <p className="lead">
                    Welcome to Snap Token, the home for using Snap to buy goods from registered vendors.
                </p>
            </Jumbotron>
            <img src={grocery_image} alt={'Grocery Store'} className={'home-image'}/>
        </div>
    );
};

export default Home;