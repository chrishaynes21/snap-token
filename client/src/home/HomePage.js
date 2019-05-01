import React from 'react';
import {Jumbotron} from 'reactstrap';
import grocery_image from '../images/GroceryStore.jpg';

const Home = () => {
    return (
        <div>
            <Jumbotron style={{marginTop: '50px', marginBottom: '0px'}}>
                <h1 className='display-3'>Snap Token</h1>
                <p className='lead'>
                    Welcome to Snap Token, the home for using Snap to buy goods from registered vendors.
                </p>
            </Jumbotron>
            <figure className='home-image'>
                <img style={{width: '100%'}} src={grocery_image} alt={'Grocery Store'} />
            </figure>
        </div>
    );
};

export default Home;