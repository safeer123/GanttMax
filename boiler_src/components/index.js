import React from 'react';
import Header from './Header'
import Footer from './Footer'
import Content from './Content'
import '../../styles/main.scss';

let App = (props) => {

    return <div className="wrapper"> 
                <Header />
                <Content />
                <Footer />
            </div>;
}

export { App };